import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { XMarkIcon } from './Icons';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Please enter a username.');
            return;
        }
        setError('');
        login(username);
        onClose();
        setUsername('');
        setPassword('');
    };

    const handleSkip = () => {
        onClose();
        setUsername('');
        setPassword('');
        setError('');
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="login-modal animate-fade-in">
                <div className="modal-header">
                    <h3>Welcome Back!</h3>
                    <button onClick={onClose} aria-label="Close login modal">
                        <XMarkIcon />
                    </button>
                </div>
                <div className="modal-content">
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g., alexdoe"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        {error && <p className="form-error">{error}</p>}
                        <button type="submit" className="login-submit-button">
                            Login
                        </button>
                    </form>
                    <div className="divider">
                        <span>OR</span>
                    </div>
                    <button onClick={handleSkip} className="skip-login-button">
                        Skip Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
