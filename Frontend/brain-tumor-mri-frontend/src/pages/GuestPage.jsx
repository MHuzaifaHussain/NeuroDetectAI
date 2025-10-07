import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { UploadCloud, Brain, Activity, X, Info, Loader, Trash2, BrainCircuit, RefreshCw } from 'lucide-react';
import { apiCall } from '../services/api';


let hasGuestVisitedThisSession = false;

// Reusable Components & Modals

const GuestWarningModal = ({ isOpen, onClose }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                    <div className="flex flex-col items-center text-center">
                        <Info size={48} className="text-blue-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">You are in Guest Mode</h2>
                        <p className="text-gray-600 mb-6">
                            Your analysis history will not be saved. To keep a record of your results, please create an account.
                        </p>
                        <div className="w-full space-y-3">
                            <Link to="/register" className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:brightness-110 transition-colors">
                                Create Account
                            </Link>
                            <button onClick={onClose} className="w-full bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-lg hover:bg-gray-300 transition-colors">
                                Continue as Guest
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const ResultModal = ({ isOpen, onClose, prediction }) => {
    if (!isOpen || !prediction) return null;

    const confidence = prediction.confidence || 0;
    const confidenceColor = confidence > 75 ? 'bg-green-500' : confidence > 50 ? 'bg-yellow-500' : 'bg-red-500';
    
    // Add "Tumor" to the disease name if it's not "No Tumor"
    const displayDisease = prediction.disease === 'No Tumor' 
        ? 'No Tumor Detected' 
        : `${prediction.disease} Tumor`;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg relative"
                    >
                         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Analysis Result</h2>
                        <div className="space-y-4">
                            <div className="flex items-center text-lg"><Brain className="h-7 w-7 text-blue-500 mr-4 flex-shrink-0" /><div><span className="font-semibold text-gray-500">Prediction:</span><p className="text-2xl font-bold text-gray-800">{displayDisease}</p></div></div>
                            <div className="flex items-center text-lg"><Activity className="h-7 w-7 text-green-500 mr-4 flex-shrink-0" /><div><span className="font-semibold text-gray-500">Confidence Score:</span><p className="text-2xl font-bold text-gray-800">{confidence.toFixed(2)}%</p></div></div>
                        </div>
                        <div className="mt-6"><div className="w-full bg-gray-200 rounded-full h-4"><motion.div initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className={`h-4 rounded-full ${confidenceColor}`} /></div></div>
                        <div className="mt-8 text-center">
                             <button onClick={onClose} className="w-full sm:w-auto font-bold py-3 px-8 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:brightness-110 transform hover:-translate-y-px">
                                <RefreshCw size={18} />
                                Try with another Pic
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// Main Guest Page Component
const GuestPage = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const analyzeButtonRef = useRef(null);

    useEffect(() => {
        if (!hasGuestVisitedThisSession) {
            setIsWarningOpen(true);
            hasGuestVisitedThisSession = true;
        }
    }, []);

    const resetState = () => {
        setFile(null);
        setPreview(null);
        setPrediction(null);
        setIsResultModalOpen(false);
    };

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        resetState();
        if (fileRejections.length > 0) {
            toast.error('Invalid file type. Please upload an image (jpeg, png).');
            return;
        }
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));

        // Scroll to the analyze button after a short delay to allow the image to render
        setTimeout(() => {
            analyzeButtonRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 100);
    }, []);
    
    const handleRemoveFile = (e) => {
        e.stopPropagation();
        resetState();
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/jpeg': [], 'image/png': [] },
        multiple: false,
    });

    const handleAnalyze = async () => {
        if (!file) {
            toast.error('Please select a file first.');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        const toastId = toast.loading('Analyzing your scan...');

        try {
            const response = await apiCall('post', '/guest-predict', formData);
            setPrediction(response);
            setIsResultModalOpen(true);
            toast.success('Analysis complete!', { id: toastId });
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Analysis failed. Please try again.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <GuestWarningModal isOpen={isWarningOpen} onClose={() => setIsWarningOpen(false)} />
            <ResultModal isOpen={isResultModalOpen} onClose={resetState} prediction={prediction} />

            <header className="w-full p-4 sm:p-6 bg-white/80 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                     <Link to="/" className="flex items-center gap-2">
                        <BrainCircuit className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-800">NeuroDetect</span>
                    </Link>
                    <Link to="/" className="font-semibold text-blue-600 hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-2xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Guest Analysis
                        </h1>
                        <p className="text-lg text-gray-600 mt-2">Upload an MRI scan to get an instant AI-powered analysis.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 w-full">
                        <div
                            {...getRootProps()}
                            className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400'}`}
                        >
                            <input {...getInputProps()} />
                            <AnimatePresence>
                                {preview ? (
                                    <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
                                        <img src={preview} alt="MRI Preview" className="rounded-lg w-full h-auto max-h-80 object-contain" />
                                        <button onClick={handleRemoveFile} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600">
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col justify-center items-center text-center p-10 h-60">
                                        <UploadCloud className="h-16 w-16 text-gray-400 mb-4" />
                                        <p className="text-gray-600">{isDragActive ? "Drop the image here..." : "Drag & drop scan here, or click to select"}</p>
                                        <p className="text-xs text-gray-500 mt-2">Supports: PNG, JPG</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            ref={analyzeButtonRef} // Attach the ref to the button
                            onClick={handleAnalyze}
                            disabled={!file || loading}
                            className="w-full font-bold py-3 px-8 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:brightness-110 transform hover:-translate-y-px disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {loading ? (<><Loader className="animate-spin" />Analyzing...</>) : 'Analyze Scan'}
                        </button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default GuestPage;
