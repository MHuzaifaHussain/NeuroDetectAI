import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BrainCircuit, Mail, Lock } from 'lucide-react';
import { apiCall } from '../services/api';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const payload = {
            email: data.email.trim(),
            password: data.password,
        };
        
        const toastId = toast.loading('Logging in...');

        try {
            const response = await apiCall('post', '/auth/login', payload);
            toast.success(response.msg || "Login successful!", { id: toastId });
            navigate('/dashboard'); // Redirect to the dashboard on successful login
        } catch (error) {
            const errorMessage = error.response?.data?.detail || "Login failed. Please check your credentials.";
            toast.error(errorMessage, { id: toastId });
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="relative w-full max-w-4xl flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden">
                {/* Left Side - Branding */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 md:p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <BrainCircuit size={80} className="mx-auto" />
                        <h1 className="text-4xl font-bold mt-4">Welcome Back</h1>
                        <p className="mt-2 text-blue-100">Log in to access your dashboard.</p>
                    </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
                        <p className="text-gray-600 mb-8">Please enter your details to continue.</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    {...register('email', { 
                                        required: "Email is required", 
                                        pattern: { 
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address" 
                                        } 
                                    })}
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    {...register('password', { required: "Password is required" })}
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-3 text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:brightness-110 transform hover:-translate-y-px transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Logging In...' : 'Login'}
                            </button>
                        </form>
                        
                        <div className="text-center mt-8">
                            <p className="text-sm text-gray-600">Don't have an account?</p>
                            <Link to="/register" className="font-semibold text-blue-600 hover:underline relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-blue-600 after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                                Register Here
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
