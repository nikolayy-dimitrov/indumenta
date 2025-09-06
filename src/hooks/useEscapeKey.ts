import { useEffect } from 'react';

/**
 * A custom hook that handles Escape key press to close modals or reset states
 *
 * @param callback The function to call when Escape key is pressed
 */
export const useEscapeKey = (callback: () => void) => {
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                callback();
            }
        };

        window.addEventListener('keydown', handleEscKey);

        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [callback]);
};