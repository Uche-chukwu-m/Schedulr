import datetime
import os
import json
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory, g
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth
from functools import wraps
from sqlalchemy import and_
from posting import post_to_platform

load_dotenv()

# Firebase Admin Credential setup
if 'RENDER' in os.environ:
    service_account_info = json.loads(os.environ['FIREBASE_SERVICE_ACCOUNT_JSON'])
    cred = credentials.Certificate(service_account_info)
else:
    cred = credentials.Certificate(os.path.join(os.path.dirname(__file__), '..', 'pack.json'))
firebase_admin.initialize_app(cred)

# --- Auth Decorator ---
def check_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer'):
            return jsonify({"error": "Authorization header missing or invalid"}), 401
        id_token = auth_header.split(' ').pop()
        try:
            decoded_token = auth.verify_id_token(id_token)
            g.user_id = decoded_token['uid']
        except Exception as e:
            return jsonify({"error": "Invalid token", "details": str(e)}), 401
        return f(*args, **kwargs)
    return decorated_function

# --- App Setup ---
app = Flask(__name__)
CORS(app)

database_url = os.environ.get('DATABASE_URL')
if database_url:
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- Models ---
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    scheduled_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String, nullable=False, default='scheduled')

    def __init__(self, user_id, content, platform, scheduled_time, status='scheduled'):
        self.user_id = user_id
        self.content = content
        self.platform = platform
        self.scheduled_time = scheduled_time
        self.status = status

    def to_json(self):
        return {
            'id': self.id,
            'content': self.content,
            'platform': self.platform,
            'scheduled_time': self.scheduled_time.isoformat() + "Z",
            'status': self.status
        }

# --- Public Routes ---
@app.route('/')
# @app.route('/<path:path>')
def index(path=None):
    frontend_dist = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')
    if os.path.exists(frontend_dist):
        return send_from_directory(frontend_dist, 'index.html')
    else:
        return jsonify({'message': 'Backend is running! Frontend not built yet.'})

@app.route('/assets/<path:filename>')
def assets(filename):
    frontend_dist = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist', 'assets')
    if os.path.exists(frontend_dist):
        return send_from_directory(frontend_dist, filename)
    else:
        return jsonify({'error': 'Assets not found'}), 404

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'Backend is running!'})

@app.route('/api/health', methods=['GET'])
def health():
    try:
        db.session.execute(db.text('SELECT 1'))
        return jsonify({'status': 'healthy', 'database': 'connected'})
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'database': 'disconnected', 'error': str(e)}), 500

# --- Protected API Routes ---
@app.route('/api/posts', methods=['GET'])
@check_auth
def get_posts():
    user_posts = Post.query.filter_by(user_id=g.user_id).order_by(getattr(Post, 'scheduled_time').desc()).all()
    return jsonify([post.to_json() for post in user_posts])

@app.route('/api/posts', methods=['POST'])
@check_auth
def create_post():
    data = request.get_json()
    if not data or 'content' not in data or 'platform' not in data or 'scheduled_time' not in data:
        return jsonify({'error': 'Missing data'}), 400
    scheduled_time_obj = datetime.datetime.fromisoformat(data['scheduled_time']).replace(tzinfo=None)
    new_post = Post(
        user_id=g.user_id,
        content=data['content'],
        platform=data['platform'],
        scheduled_time=scheduled_time_obj,
        status='scheduled'
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.to_json()), 201

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
@check_auth
def delete_post(post_id):
    post = Post.query.get(post_id)
    if post:
        if g.user_id == post.user_id:
            db.session.delete(post)
            db.session.commit()
            return jsonify({'message': 'Post deleted successfully'}), 204
        else:
            return jsonify({'error': 'Forbidden, Not authorized to perform this action'}), 403
    else:
        return jsonify({'error': 'Not found, No post found with that ID'}), 404
    
@app.route('/api/tasks/process-due-posts', methods=['POST'])
def process_due_posts():
    auth_header = request.headers.get('Authorization')
    expected_secret = os.environ.get('CRON_SECRET')

    if not auth_header or auth_header != f'Bearer {expected_secret}':
        return jsonify({'error': "Unauthorized"}), 401
    
    try:
        now = datetime.datetime.utcnow()
        posts_to_process = Post.query.filter(and_(
            Post.status == 'scheduled',
            Post.scheduled_time <= now
        )).all()

        if not posts_to_process:
            return jsonify({"message": "No posts to publish."}), 200
        
        success_count = 0
        failure_count = 0

        for post in posts_to_process:
            was_successful = post_to_platform(post.platform, post.content)

            if was_successful:
                post.status = 'published'
                success_count += 1
            else:
                post.status = 'failed'
                failure_count += 1
        
        db.session.commit()
        return jsonify({
            "message": "Processing complete",
            "published": success_count,
            "failed": failure_count
        }), 200

    except Exception as e:
        print(f"Error during post processing: {str(e)}")
        return jsonify({"error": "An Internal error occured."}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

