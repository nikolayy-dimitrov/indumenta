import React from 'react';
import { LoadingIndicator } from './LoadingIndicator';

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message }) => {
    if (!isLoading) return null;

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
            <LoadingIndicator />
            {message && (
                <p className="mt-8 text-xl text-primary font-light animate-pulse text-center px-4">
                    {message}
                </p>
            )}
        </div>
    );
};
