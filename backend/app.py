# from crypt import methods
# import platform
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import datetime

# App Setup
app = Flask(__name__)
CORS(app)

# Database Setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# Database model
# 'Post' table model
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    scheduled_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String, nullable=False, default='scheduled')

    # this is a class method that returns the json of the post table contents
    def to_json(self):
        return {
            'id': self.id,
            'content': self.content,
            'platform': self.platform,
            'scheduled_time': self.scheduled_time,
            'status': self.status
        }

# Test route to verify working
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'Backend is running!'})

@app.route('/api/posts', methods=['GET'])
def get_posts():
    # simulating scheduler -- will return to this
    now = datetime.datetime.utcnow()
    scheduled_posts = Post.query.filter_by(status='scheduled').all()
    for post in scheduled_posts:
        if post.scheduled_time <= now:
            post.status = 'published'
    db.session.commit()

    all_posts = Post.query.order_by(Post.scheduled_time.desc()).all()
    return jsonify([post.to_json() for post in all_posts])

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    if not data or not 'content' in data or not 'platform' in data or not 'scheduled_time' in data:
        return jsonify({'error': 'Missing data'}), 400
    
    # convert ISO format string from frontend back to datetime object
    scheduled_time_obj = datetime.datetime.fromisoformat(data['scheduled_time']).replace(tzinfo=None)

    new_post = Post(
        content=data['content'],
        platform=data['platform'],
        scheduled_time=scheduled_time_obj
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.to_json()), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

