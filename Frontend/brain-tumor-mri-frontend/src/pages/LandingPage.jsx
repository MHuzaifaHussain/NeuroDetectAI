import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
    BrainCircuit, 
    UploadCloud, 
    Zap, 
    CheckCircle2, 
    ShieldCheck, 
    Clock, 
    Check,
    Menu,
    X,
    UserPlus,
    LogIn,
    UserCheck,
    Home,
    CheckCircle
} from 'lucide-react';


const ActionButton = ({ to, onClick, children, className, variant = 'primary' }) => {
    const baseClasses = "font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105";
    
    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:brightness-110',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    };

    const finalClasses = `${baseClasses} ${variants[variant]} ${className}`;

    if (to) {
        return <Link to={to} className={finalClasses}>{children}</Link>;
    }
    return <button onClick={onClick} className={finalClasses}>{children}</button>;
};

const NavLink = ({ children, sectionId, onClick }) => (
    <a onClick={() => onClick(sectionId)} className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors">
        {children}
    </a>
);

const SectionTitle = ({ title, subtitle }) => (
    <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
        <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
    </div>
);

const FeatureCard = ({ icon, title, children }) => (
    <div className="flex flex-col items-center text-center">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full p-6 mb-6">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600">{children}</p>
    </div>
);

// Modal Components

const GetStartedModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Join NeuroDetect</h2>
                        <div className="space-y-4">
                            <motion.button whileHover={{ scale: 1.03 }} onClick={() => handleNavigate('/register')} className="w-full flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg transition-colors hover:brightness-110">
                                <UserPlus size={24} />
                                Create a New Account
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.03 }} onClick={() => handleNavigate('/login')} className="w-full flex items-center gap-4 p-4 rounded-lg bg-gray-700 text-white font-semibold text-lg transition-colors hover:bg-gray-800">
                                <LogIn size={24} />
                                Login to Your Account
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.03 }} onClick={() => handleNavigate('/guest')} className="w-full flex items-center gap-4 p-4 rounded-lg bg-emerald-500 text-white font-semibold text-lg transition-colors hover:bg-emerald-600">
                                <UserCheck size={24} />
                                Continue as Guest
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ThankYouModal = ({ isOpen, onClose }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-lg text-center"
                >
                    <div className="mb-6">
                        <CheckCircle size={60} className="mx-auto text-green-500" />
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Thank You!</h1>
                    <p className="mt-2 text-gray-600 max-w-md mx-auto">Your message has been sent. We will get back to you shortly.</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:brightness-110 transition-all"
                    >
                        <Home size={20} />
                        Back to Homepage
                    </motion.button>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);


// Main Landing Page Component

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);
    const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);

    const navItems = [
        { label: 'Home', sectionId: 'hero' },
        { label: 'How It Works', sectionId: 'how-it-works' },
        { label: 'About', sectionId: 'about' },
        { label: 'Contact Us', sectionId: 'contact' },
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    const handleContactSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const toastId = toast.loading('Sending your message...');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                toast.success('Message sent successfully!', { id: toastId });
                setIsThankYouModalOpen(true);
                form.reset();
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.', { id: toastId });
            console.error('Form submission error:', error);
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className="bg-slate-50 font-sans text-gray-800">
            <GetStartedModal isOpen={isGetStartedModalOpen} onClose={() => setIsGetStartedModalOpen(false)} />
            <ThankYouModal isOpen={isThankYouModalOpen} onClose={() => setIsThankYouModalOpen(false)} />
            
            <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-2">
                            <BrainCircuit className="w-8 h-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-800">NeuroDetect</span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-8">
                            {navItems.map(item => (
                                <NavLink key={item.label} sectionId={item.sectionId} onClick={scrollToSection}>
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>

                        <div className="hidden md:block">
                            <ActionButton onClick={() => setIsGetStartedModalOpen(true)} className="px-5 py-2.5">
                                Get Started
                            </ActionButton>
                        </div>

                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-blue-600 focus:outline-none">
                                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="md:hidden mt-4 overflow-hidden"
                            >
                                {navItems.map(item => (
                                    <a key={item.label} onClick={() => scrollToSection(item.sectionId)} className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                        {item.label}
                                    </a>
                                ))}
                                <div className="mt-4">
                                    <ActionButton onClick={() => setIsGetStartedModalOpen(true)} className="w-full text-center py-2.5">
                                        Get Started
                                    </ActionButton>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </nav>
            </header>

            <main>
                <section id="hero" style={{ background: 'radial-gradient(circle at top left, rgba(29, 78, 216, 0.1), transparent 40%), radial-gradient(circle at bottom right, rgba(147, 51, 234, 0.1), transparent 40%)' }} className="pt-20 pb-28">
                    <div className="container mx-auto px-6 text-center">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight"
                        >
                            AI-Powered MRI Analysis for <br className="hidden md:block" />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Early Brain Tumor Detection</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
                        >
                            Upload your brain MRI scans and get a fast, accurate classification to support clinical decisions. Our advanced deep learning model provides a new layer of insight.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-10"
                        >
                            <ActionButton to="/guest" className="px-8 py-4 text-lg">
                                Continue as Guest
                            </ActionButton>
                        </motion.div>
                    </div>
                </section>

                <motion.section id="how-it-works" className="py-20 bg-white" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
                    <div className="container mx-auto px-6">
                        <SectionTitle title="A Simple, Secure Process" subtitle="Get results in three easy steps." />
                        <div className="grid md:grid-cols-3 gap-12">
                            <FeatureCard icon={<UploadCloud className="w-12 h-12" />} title="1. Upload MRI">
                                Securely upload one or more brain MRI images. We support various standard formats like JPEG, PNG, and DICOM.
                            </FeatureCard>
                            <FeatureCard icon={<Zap className="w-12 h-12" />} title="2. AI Analysis">
                                Our state-of-the-art neural network analyzes the images in seconds, identifying patterns associated with different tumor types.
                            </FeatureCard>
                            <FeatureCard icon={<CheckCircle2 className="w-12 h-12" />} title="3. View Results">
                                Receive a clear, understandable report with the classification results and a confidence score to aid in your diagnosis.
                            </FeatureCard>
                        </div>
                    </div>
                </motion.section>

                <motion.section id="about" className="py-20 bg-slate-50" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Empowering Healthcare with Technology</h2>
                                <p className="mt-6 text-lg text-gray-600">NeuroDetect is a research-driven tool designed to assist radiologists, oncologists, and medical researchers. Our mission is to provide powerful, accessible technology that can help accelerate the diagnostic process and improve patient outcomes.</p>
                                <div className="mt-8 space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                                            <Check className="w-6 h-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-xl font-semibold">High Accuracy</h4>
                                            <p className="text-gray-600 mt-1">Trained on a vast dataset of curated MRI scans for reliable classification.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-xl font-semibold">Rapid Results</h4>
                                            <p className="text-gray-600 mt-1">Get analysis in seconds, not hours, allowing for quicker decision-making.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-xl font-semibold">Secure & Private</h4>
                                            <p className="text-gray-600 mt-1">We use end-to-end encryption. Your data is processed securely and is never stored long-term.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <img src="https://placehold.co/600x500/E0E7FF/3B82F6?text=NeuroDetect+AI" alt="Abstract representation of AI and neuroscience" className="rounded-2xl shadow-2xl w-full h-auto object-cover" />
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section id="contact" className="py-20 bg-white" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
                    <div className="container mx-auto px-6">
                        <SectionTitle title="Get In Touch" subtitle="Have questions? We'd love to hear from you." />
                        <div className="max-w-2xl mx-auto">
                            <form onSubmit={handleContactSubmit} action="https://formsubmit.co/8a3457c74e21c1972252a395393783f8" method="POST" className="space-y-6">
                                <input type="hidden" name="_subject" value="New Contact Form Submission from NeuroDetect" />
                                <input type="hidden" name="_captcha" value="false" />

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" name="name" id="name" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" name="email" id="email" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea id="message" name="message" rows="4" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">Send Message</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <Link to="/" className="flex items-center space-x-2">
                                <BrainCircuit className="w-8 h-8 text-white" />
                                <span className="text-2xl font-bold">NeuroDetect</span>
                            </Link>
                            <p className="mt-4 text-gray-400">Advanced AI for early brain tumor detection.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Quick Links</h3>
                            <ul className="mt-4 space-y-2">
                                {navItems.slice(1).map(item => (
                                     <li key={item.label}><a onClick={() => scrollToSection(item.sectionId)} className="cursor-pointer text-gray-400 hover:text-white">{item.label}</a></li>
                                ))}
                                <li><a onClick={() => setIsGetStartedModalOpen(true)} className="cursor-pointer text-gray-400 hover:text-white">Get Started</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Disclaimer</h3>
                            <p className="mt-4 text-gray-400 text-sm">NeuroDetect is a tool for informational and research purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.</p>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500">
                        <p>&copy; 2025 NeuroDetect. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
