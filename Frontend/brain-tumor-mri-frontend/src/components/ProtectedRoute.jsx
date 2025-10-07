import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../services/api';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // This API call will succeed if the auth cookie is valid.
                await apiCall('get', '/auth/me');
                setIsAuthenticated(true);
            } catch (error) {
                // If it fails, the user is not authenticated.
                setIsAuthenticated(false);
                navigate('/login'); // Immediately redirect to the login page.
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-100">
                <Loader className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return isAuthenticated ? children : null;
};

export default ProtectedRoute;
