import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

type AuthProviderProps = {
    children: ReactNode;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
});

export const AuthProvider: React.FC<AuthProviderProps> = (props: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        return onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading }}>
            {props.children}
        </AuthContext.Provider>
    );
};