import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiCall } from '../services/api';
import { CheckCircle, XCircle, Loader, BrainCircuit } from 'lucide-react';

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const email = searchParams.get('email');
        const token = searchParams.get('token');

        if (!email || !token) {
            setStatus('error');
            setMessage('Invalid verification link. Please try again.');
            return;
        }

        const verify = async () => {
            try {
                const response = await apiCall('get', `/auth/verify-email?email=${email}&token=${token}`);
                setStatus('success');
                setMessage(response.msg || 'Email verified successfully! You can now log in.');
                toast.success('Verification successful!');
                setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
            } catch (error) {
                setStatus('error');
                const errorMessage = error.response?.data?.detail || 'Verification failed. The link may be expired or invalid.';
                setMessage(errorMessage);
                toast.error(errorMessage);
            }
        };

        verify();
    }, [searchParams, navigate]);

    const statusIcons = {
        verifying: <Loader size={48} className="animate-spin text-blue-500" />,
        success: <CheckCircle size={48} className="text-green-500" />,
        error: <XCircle size={48} className="text-red-500" />,
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
            <Link to="/" className="flex items-center gap-2 mb-8">
                <BrainCircuit className="w-10 h-10 text-blue-600" />
                <span className="text-3xl font-bold">NeuroDetect</span>
            </Link>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-lg"
            >
                <div className="mb-6">
                    {statusIcons[status]}
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    {status === 'verifying' && 'Verification in Progress'}
                    {status === 'success' && 'Verification Successful!'}
                    {status === 'error' && 'Verification Failed'}
                </h1>
                <p className="text-gray-600">{message}</p>
                {status !== 'verifying' && (
                    <Link to="/login">
                        <button className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Go to Login
                        </button>
                    </Link>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmailPage;
