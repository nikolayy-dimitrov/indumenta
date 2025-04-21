import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

import { getUserProfile } from "../services/user.service.ts";

type AuthProviderProps = {
    children: ReactNode;
}

interface AuthContextType {
    user: User | null;              // Firebase user
    profile: { subscriptionStatus?: string } | null; // Additional profile data
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    isLoading: true,
});

export const AuthProvider: React.FC<AuthProviderProps> = (props: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<{ subscriptionStatus?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        return onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const profileData = await getUserProfile(currentUser.uid);
                setUser(currentUser);
                setProfile(profileData);
            } else {
                setUser(null);
                setProfile(null);
            }
            setIsLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, isLoading }}>
            {props.children}
        </AuthContext.Provider>
    );
};