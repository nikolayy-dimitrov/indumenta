import React, { createContext, useState } from "react";

type WardrobeProviderProps = {
    children: React.ReactNode;
};

interface WardrobeContextType {
    isLoading: boolean;
    setIsLoading: (value: boolean, delay?: number) => void;
}

export const WardrobeContext = createContext<WardrobeContextType>({
    isLoading: false,
    setIsLoading: () => {},
});

export const WardrobeProvider: React.FC<WardrobeProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <WardrobeContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </WardrobeContext.Provider>
    );
};
