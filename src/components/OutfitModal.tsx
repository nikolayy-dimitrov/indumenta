import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { faCircleCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { OutfitItem } from "../types/wardrobe.ts";
import { db } from "../config/firebaseConfig";

interface OutfitModalProps {
    outfit: OutfitItem | null;
    onClose: () => void;
    isOwner?: boolean;
}

export const OutfitModal = ({ outfit, onClose, isOwner = false }: OutfitModalProps) => {
    const [editLabel, setEditLabel] = useState<boolean>(false);
    const [newLabel, setNewLabel] = useState<string>("");
    const [date, setDate] = useState(new Date());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_scheduledDate, setScheduledDate] = useState<Date | null>(null);

    useEffect(() => {
        if (outfit) {
            setNewLabel(outfit.label || "");
        }
    }, [outfit]);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [onClose]);

    useEffect(() => {
        const fetchScheduledDate = async () => {
            if (!outfit) return;
            try {
                const outfitRef = doc(db, "outfits", outfit.id);
                const outfitDoc = await getDoc(outfitRef);
                const scheduleData = outfitDoc.data()?.scheduledDate;
                if (scheduleData) {
                    const fetchedDate = scheduleData.toDate();
                    setScheduledDate(fetchedDate);
                    setDate(fetchedDate);
                }
            } catch (error) {
                console.error("Error fetching scheduled date:", error);
            }
        };
        fetchScheduledDate();
    }, [outfit]);

    const onDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        setDate(newDate);

        if (outfit) {
            try {
                const outfitRef = doc(db, "outfits", outfit.id);
                await updateDoc(outfitRef, { scheduledDate: newDate });
                toast.success("Scheduled date updated successfully!", {
                    position: "top-center",
                    closeOnClick: true,
                    theme: "dark",
                });
            } catch (error) {
                console.error("Error updating scheduled date:", error);
                toast.error("Failed to update scheduled date.", {
                    position: "top-center",
                    closeOnClick: true,
                    theme: "dark",
                });
            }
        }
    };

    const toggleEditLabel = () => {
        setEditLabel(!editLabel);
    };

    const handleLabelChange = async () => {
        if (!outfit) return;

        if (newLabel !== outfit.label) {
            try {
                const outfitRef = doc(db, "outfits", outfit.id);
                await updateDoc(outfitRef, { label: newLabel });
                setEditLabel(false);
                toast.success("Label updated successfully!", {
                    position: "top-center",
                    closeOnClick: true,
                    theme: "dark",
                });
            } catch (error) {
                console.error("Error updating label:", error);
                toast.error("Failed to update label.", {
                    position: "top-center",
                    closeOnClick: true,
                    theme: "dark",
                });
            }
        } else {
            setEditLabel(false);
        }
    };

    if (!outfit) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                onClick={onClose}
            >
                <FontAwesomeIcon icon={faX} size="1x" />
            </button>
            <div
                className="relative max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full h-full flex gap-1 overflow-hidden">
                    <div className="w-1/3 h-full">
                        <img
                            src={outfit.outfitPieces.Top}
                            alt="Top item"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-2/3 h-full flex flex-col gap-1">
                        <div className="w-full h-1/2">
                            <img
                                src={outfit.outfitPieces.Bottom}
                                alt="Bottom item"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="w-full h-1/2">
                            <img
                                src={outfit.outfitPieces.Shoes}
                                alt="Shoes item"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-between w-full px-2">
                            <input
                                id="scheduledDate"
                                type="date"
                                value={date.toISOString().slice(0, 10)}
                                onChange={onDateChange}
                                className="border rounded-md px-2 py-1 text-secondary"
                            />
                            {!editLabel ? (
                                <button onClick={toggleEditLabel}>
                                    {outfit.label || 'OUTFIT LABEL'}
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <input
                                        value={newLabel}
                                        onChange={(e) => setNewLabel(e.target.value)}
                                        className="text-secondary px-2 py-1 rounded"
                                    />
                                    <button onClick={handleLabelChange}>
                                        <FontAwesomeIcon icon={faCircleCheck} />
                                    </button>
                                </div>
                            )}
                            {isOwner ? (
                                <span>
                  {outfit.createdAt.toDate().toLocaleDateString()}
                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
