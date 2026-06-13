import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { AuthContext } from './authContext';

// Helper to check if email is from an educational institution
const isEduEmail = (email) => {
    if (!email) return false;
    const domain = email.split('@')[1]?.toLowerCase() || '';
    return domain.endsWith('.edu') || domain.endsWith('.ac.in') || domain.endsWith('.edu.in');
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(!!auth);

    useEffect(() => {
        let unsubscribe = null;
        if (auth) {
            unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                if (currentUser) {
                    const formattedUser = {
                        id: currentUser.uid,
                        name: currentUser.displayName,
                        email: currentUser.email,
                        avatar: currentUser.photoURL,
                        campus: 'Main Campus',
                        isVerifiedStudent: isEduEmail(currentUser.email)
                    };
                    setUser(formattedUser);
                    localStorage.setItem('findspace_user', JSON.stringify(formattedUser));
                } else {
                    setUser(null);
                    localStorage.removeItem('findspace_user');
                }
                setLoading(false);
            });
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const login = async () => {
        if (!auth) {
            console.error('Firebase auth not available');
            // For development without Firebase, simulate a login
            const mockUser = {
                uid: 'dev-user-id',
                displayName: 'Development User',
                email: 'dev@university.edu',
                photoURL: null,
            };
            
            const formattedUser = {
                id: mockUser.uid,
                name: mockUser.displayName,
                email: mockUser.email,
                avatar: mockUser.photoURL,
                campus: 'Main Campus',
                isVerifiedStudent: isEduEmail(mockUser.email)
            };
            setUser(formattedUser);
            localStorage.setItem('findspace_user', JSON.stringify(formattedUser));
            return;
        }
        
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const logout = async () => {
        if (!auth) {
            console.error('Firebase auth not available');
            // For development without Firebase, just clear local user
            setUser(null);
            localStorage.removeItem('findspace_user');
            return;
        }
        
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem('findspace_user');
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
