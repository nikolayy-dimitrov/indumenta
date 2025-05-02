import { motion, AnimatePresence } from "framer-motion";

type ConfirmModalProps = {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export const ConfirmModal = ({ message, onConfirm, onCancel }: ConfirmModalProps) => {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-secondary rounded-lg p-6 shadow-lg max-w-sm w-full"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                >
                    <p className="mb-4 text-primary">{message}</p>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-primary text-secondary rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
