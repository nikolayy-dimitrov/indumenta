import React from 'react';
import { motion } from 'framer-motion';

export const LoadingIndicator: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-[90vh]">
            <div className="flex space-x-2">
                <motion.div
                    className="w-4 h-4 bg-primary rounded-full"
                    animate={{ scale: [0.5, 1, 0.5], opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="w-4 h-4 bg-primary rounded-full"
                    animate={{ scale: [0.5, 1, 0.5], opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                />
                <motion.div
                    className="w-4 h-4 bg-primary rounded-full"
                    animate={{ scale: [0.5, 1, 0.5], opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
            </div>
        </div>
    );
};
