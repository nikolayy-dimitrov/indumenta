/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from "react";

type WardrobeProviderProps = {
    children: React.ReactNode;
};

interface WardrobeContextType {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loadingMessage: string;
    setLoadingMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const WardrobeContext = createContext<WardrobeContextType>({
    isLoading: false,
    setIsLoading: () => {},
    loadingMessage: "",
    setLoadingMessage: () => {},
});

export const WardrobeProvider: React.FC<WardrobeProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    return (
        <WardrobeContext.Provider value={{ isLoading, setIsLoading, loadingMessage, setLoadingMessage }}>
            {children}
        </WardrobeContext.Provider>
    );
};
