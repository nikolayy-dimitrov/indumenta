import { useEffect } from 'react';

/**
 * A custom hook that handles Enter key press to facilitate initializing buttons
 *
 * @param callback The function to call when Enter key is pressed
 */
export const useEnterKey = (callback: () => void) => {
    useEffect(() => {
        const handleEnterKey = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                callback();
            }
        };

        window.addEventListener('keydown', handleEnterKey);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleEnterKey);
        };
    }, [callback]);
};