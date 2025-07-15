import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err.message);
        }
        }
    
    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        try{
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err.message);
        }};
    
    return (
        <div className="bg-gray-50">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="max-w-[480px] w-full">
                    <a href="javascript:void(0)"><img src="https://readymadeui.com/readymadeui.svg" alt="logo" className="w-40 mb-8 mx-auto block" />
                    </a>

                    <div class="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
                        <h1 class="text-slate-900 text-center text-3xl font-semibold">Sign in</h1>
                        <form class="mt-12 space-y-6">
                            <div>
                                <label class="text-slate-900 text-sm font-medium mb-2 block">Email</label>
                                <div class="relative flex items-center">
                                    <input name="email" type="email" required class="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                            </div>
                            <div>
                                <label class="text-slate-900 text-sm font-medium mb-2 block">Password</label>
                                <div class="relative flex items-center">
                                    <input name="password" type="password" required class="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p> }
                            <div class="flex flex-wrap items-center justify-between gap-4">
                                <div class="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
                                    <label htmlFor="remember-me" class="ml-3 block text-sm text-slate-900">
                                        Remember me
                                    </label>
                                </div>
                                <div class="text-sm">
                                    <a href="javascript:void(0);" class="text-blue-600 hover:underline font-semibold">
                            Forgot your password?
                        </a>
                                </div>
                            </div>

                            <div class="!mt-12">
                                <button type="submit" class="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer" onClick={handleSignIn}>
                                    Sign in
                                </button>
                            </div>
                            <div class="!mt-12">
                                <button type="submit" class="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none cursor-pointer" onClick={handleSignUp}>
                                    Sign up
                                </button>
                            </div>
                            <p class="text-slate-900 text-sm !mt-6 text-center">Don't have an account? <a href="javascript:void(0);" class="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold">Register here</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
    };



export default Login