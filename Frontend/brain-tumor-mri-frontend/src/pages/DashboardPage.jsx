import { useState, useEffect, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiCall } from '../services/api';
import { LogOut, Brain, Activity, UploadCloud, Loader, Trash2, Menu, X, ChevronDown, BrainCircuit, RefreshCw } from 'lucide-react';

const parseTimestamp = (timestamp) => {
    if (typeof timestamp === 'number') {
        return new Date(timestamp * 1000);
    }
    return new Date(timestamp);
};

const groupHistoryByDate = (history) => {
    if (!history || !Array.isArray(history)) return {};
    const sortedHistory = [...history].sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp));
    
    return sortedHistory.reduce((acc, item) => {
        const localDate = parseTimestamp(item.timestamp);
        const date = localDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});
};


const ResultDisplay = ({ prediction, onReset }) => {
    const confidence = prediction.confidence || 0;
    const confidenceColor = confidence > 75 ? 'bg-green-500' : confidence > 50 ? 'bg-yellow-500' : 'bg-red-500';
    const displayDisease = prediction.disease === 'No Tumor' ? 'No Tumor Detected' : `${prediction.disease} Tumor`;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-xl shadow-lg w-full">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Analysis Result</h2>
            <div className="space-y-4">
                <div className="flex items-center text-lg"><Brain className="h-7 w-7 text-blue-500 mr-4 flex-shrink-0" /><div><span className="font-semibold text-gray-500">Prediction:</span><p className="text-2xl font-bold text-gray-800">{displayDisease}</p></div></div>
                <div className="flex items-center text-lg"><Activity className="h-7 w-7 text-green-500 mr-4 flex-shrink-0" /><div><span className="font-semibold text-gray-500">Confidence Score:</span><p className="text-2xl font-bold text-gray-800">{confidence.toFixed(2)}%</p></div></div>
            </div>
            <div className="mt-6"><div className="w-full bg-gray-200 rounded-full h-4"><motion.div initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className={`h-4 rounded-full ${confidenceColor}`} /></div></div>
            <div className="mt-8 text-center">
                <button
                    onClick={onReset}
                    className="w-full sm:w-auto font-bold py-3 px-8 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:brightness-110 transform hover:-translate-y-px"
                >
                    <RefreshCw size={18} />
                    Try with another pic
                </button>
            </div>
        </motion.div>
    );
};

const UserProfile = ({ user, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=4f46e5&color=fff&bold=true`;

    return (
        <div className="relative mt-auto border-t border-slate-700 p-4">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <img src={avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full flex-shrink-0" />
                    <span className="font-semibold text-white truncate">{user?.username || 'User'}</span>
                </div>
                <ChevronDown size={20} className={`text-slate-400 transition-transform flex-shrink-0 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute bottom-full left-0 right-0 mb-2 bg-slate-900 rounded-lg p-2 shadow-lg">
                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-md">
                            <LogOut size={16} /> Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DashboardPage = () => {
    const [history, setHistory] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    
    const analyzeButtonRef = useRef(null);
    const resultRef = useRef(null);
    const uploaderRef = useRef(null);

    const fetchData = useCallback(async () => {
        try {
            const [userData, historyData] = await Promise.all([
                apiCall('get', '/auth/me'),
                apiCall('get', '/history')
            ]);
            
            setCurrentUser(userData);
            setHistory(historyData.history || []);

        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setPrediction(null);
        uploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        setPrediction(null);
        if (fileRejections.length > 0) {
            toast.error('Invalid file type. Please upload an image.');
            return;
        }
        setFile(acceptedFiles[0]);
        setPreview(URL.createObjectURL(acceptedFiles[0]));
        setTimeout(() => analyzeButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/jpeg': [], 'image/png': [] },
        multiple: false,
        disabled: !!prediction // Disable dropzone when a result is shown
    });

    const handleAnalyze = async () => {
        if (!file) {
            toast.error('Please select a file first.');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await apiCall('post', '/predict', formData);
            setPrediction(response);
            toast.success('Analysis complete!');
            fetchData();
            setFile(null); // Clear the file state to update the button
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        } catch (error) {
            // Error is handled by apiCall
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = async () => {
        try {
            await apiCall('post', '/auth/logout');
            toast.success('Logged out successfully!');
            setCurrentUser(null);
            navigate('/login');
        } catch (error) {
            // Error is handled by apiCall
        }
    };
    
    const handleHistoryClick = (item) => {
        setPrediction(item);
        setFile(null);
        setPreview(item.image_url); // Use Cloudinary URL for preview
        setIsSidebarOpen(false); // Close sidebar on mobile
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    };

    const groupedHistory = groupHistoryByDate(history);

    if (!currentUser) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-100">
                <Loader className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-800 text-white flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <BrainCircuit className="w-8 h-8 text-blue-500" />
                        <span className="text-xl font-bold">NeuroDetect</span>
                    </Link>
                    <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-slate-300">Analysis History</h2>
                </div>
                <div className="flex-grow overflow-y-auto p-4 pt-0 space-y-6 custom-scrollbar">
                    {Object.keys(groupedHistory).length > 0 ? (
                        Object.keys(groupedHistory).map(date => (
                            <div key={date}>
                                <h3 className="text-sm font-semibold text-slate-500 mb-2 px-2">{date}</h3>
                                <div className="space-y-2">
                                    {groupedHistory[date].map((item, index) => (
                                        <div key={item.id || index} onClick={() => handleHistoryClick(item)} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-700 cursor-pointer">
                                            <span className="truncate text-sm">{item.disease || item.label}</span>
                                            <span className="text-xs text-slate-500">
                                                {item.displayTime}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-slate-500 p-8">
                            <p>No info for now.</p>
                            <p className="text-sm mt-2">Upload a scan to get started.</p>
                        </div>
                    )}
                </div>
                <UserProfile user={currentUser} onLogout={handleLogout} />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-4 sm:p-8 overflow-y-auto">
                 <button className="md:hidden fixed top-4 left-4 z-20 bg-white p-2 rounded-full shadow-md" onClick={() => setIsSidebarOpen(true)}>
                    <Menu />
                </button>
                <div className="w-full max-w-2xl mx-auto flex-grow flex flex-col justify-center" ref={uploaderRef}>
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-lg text-gray-600 mt-2">Upload a new MRI scan for analysis.</p>
                    </div>
                    <div className="space-y-6 w-full">
                        <div {...getRootProps()} className={`relative border-2 border-dashed rounded-xl transition-colors duration-300 ${!!prediction ? 'cursor-default' : 'cursor-pointer'} ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400'}`}>
                            <input {...getInputProps()} />
                            <AnimatePresence>
                                {preview ? (
                                    <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
                                        <img src={preview} alt="Preview" className="rounded-lg w-full h-auto max-h-80 object-contain" />
                                        {!prediction && (
                                            <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600"><Trash2 size={18} /></button>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col justify-center items-center text-center p-10 h-60"><UploadCloud className="h-16 w-16 text-gray-400 mb-4" /><p className="text-gray-600">{isDragActive ? "Drop the image here..." : "Drag & drop scan here, or click to select"}</p><p className="text-xs text-gray-500 mt-2">Supports: PNG, JPG</p></motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button 
                            ref={analyzeButtonRef}
                            onClick={prediction && !file ? () => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) : handleAnalyze} 
                            disabled={loading || (!file && !prediction)} 
                            className="w-full font-bold py-3 px-8 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:brightness-110 transform hover:-translate-y-px disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? <><Loader className="animate-spin" />Analyzing...</>
                                : file
                                    ? 'Analyze Scan'
                                    : prediction
                                        ? <><ChevronDown size={20} />Here are the results</>
                                        : 'Analyze Scan'
                            }
                        </button>
                    </div>
                    <div className="mt-10 w-full" ref={resultRef}>
                        <AnimatePresence>
                            {prediction && <ResultDisplay prediction={prediction} onReset={handleReset} />}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
