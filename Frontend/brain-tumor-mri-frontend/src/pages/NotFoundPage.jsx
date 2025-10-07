import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Home } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <header className="w-full p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    <Link to="/" className="flex items-center gap-2 w-max">
                        <BrainCircuit className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-800">NeuroDetect</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        404
                    </h1>
                    <h2 className="mt-4 text-2xl md:text-4xl font-bold text-gray-800">
                        Page Not Found
                    </h2>
                    <p className="mt-2 text-gray-600 max-w-md mx-auto">
                        Sorry, we couldn't find the page you were looking for. It might have been moved or deleted.
                    </p>
                    <Link to="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:brightness-110 transition-all"
                        >
                            <Home size={20} />
                            Go to Homepage
                        </motion.button>
                    </Link>
                </motion.div>
            </main>
        </div>
    );
};

export default NotFoundPage;
