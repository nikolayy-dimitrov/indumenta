import React, { useState, useEffect, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { faCircleCheck, faX, faCalendarAlt, faTags, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { OutfitItem } from "../../types/wardrobe.ts";
import { db } from "../../config/firebaseConfig.ts";
import { AuthContext } from "../../context/AuthContext.tsx";
import { DeleteHandler } from "./DeleteHandler.tsx";
import { LikeOutfitHandler } from "./LikeOutfitHandler.tsx";

interface OutfitModalProps {
    outfit: OutfitItem | null;
    onClose: () => void;
    isOwner?: boolean;
    onDelete?: (outfitId: string) => void;
}

export const OutfitModal = ({ outfit, onClose, isOwner = false, onDelete }: OutfitModalProps) => {
    const [editLabel, setEditLabel] = useState<boolean>(false);
    const [newLabel, setNewLabel] = useState<string>("");
    const [date, setDate] = useState(new Date());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_scheduledDate, setScheduledDate] = useState<Date | null>(null);

    const { user } = useContext(AuthContext);

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

    const handleSuccessfulDelete = (outfitId: string) => {
        if (onDelete) {
            onDelete(outfitId);
        }
        // Close the modal after successful deletion
        onClose();
    };

    if (!outfit) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-primary dark:bg-secondary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        {!editLabel ? (
                            <div className="flex items-center">
                                <span>{outfit.label || 'OUTFIT'}</span>
                                <button
                                    onClick={toggleEditLabel}
                                    className="ml-2 text-secondary/70 dark:text-primary/60 hover:text-secondary/90 dark:hover:text-primary/80"
                                >
                                    <FontAwesomeIcon icon={faPencilAlt} size="sm" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    className="border border-secondary/40 dark:border-primary/40 rounded px-2 py-0.5 text-primary dark:text-primary/80 dark:bg-secondary"
                                    autoFocus
                                />
                                <button
                                    onClick={handleLabelChange}
                                    className="flex items-center text-primary-green/80 hover:text-primary-green dark:text-primary/80 dark:hover:text-primary"
                                >
                                    <FontAwesomeIcon icon={faCircleCheck} />
                                </button>
                            </div>
                        )}
                    </h2>
                    <button
                        className="text-secondary/80 hover:text-secondary/60 dark:text-primary/80 dark:hover:text-primary/60 transition-colors"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faX} />
                    </button>
                </div>

                {/* Content */}
                <div className="grid md:grid-cols-5 gap-4 p-4">
                    {/* Images Display - 3/5 of width */}
                    <div className="md:col-span-3 rounded-lg overflow-hidden bg-primary dark:bg-secondary">
                        <div className="md:w-11/12 max-md:w-8/12 h-full flex flex-col md:flex-row mx-auto gap-2">
                            <div className="w-full md:w-1/3 aspect-square md:h-auto">
                                <img
                                    src={outfit.outfitPieces.Top}
                                    alt="Top item"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <div className="w-full md:w-2/3 flex flex-row md:flex-col gap-2">
                                <div className="w-1/2 md:w-full aspect-square md:h-1/2">
                                    <img
                                        src={outfit.outfitPieces.Bottom}
                                        alt="Bottom item"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <div className="w-1/2 md:w-full aspect-square md:h-1/2">
                                    <img
                                        src={outfit.outfitPieces.Shoes}
                                        alt="Shoes item"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Section - 2/5 of width */}
                    <div className="md:col-span-2 space-y-6 flex flex-col">
                        {/* Schedule Section */}
                        <div>
                            <h3 className="text-sm uppercase tracking-wider text-secondary/80 dark:text-primary/80 font-medium mb-2">
                                Schedule
                            </h3>
                            <div className="h-px bg-secondary/50 dark:bg-primary/50 mb-4"></div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <label htmlFor="scheduledDate" className="block text-center text-sm text-secondary/80 dark:text-primary/80 mb-1">
                                            Scheduled Date
                                        </label>
                                        <div className="flex items-center justify-center gap-2">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-primary/80" />
                                            <input
                                                id="scheduledDate"
                                                type="date"
                                                value={date.toISOString().slice(0, 10)}
                                                onChange={onDateChange}
                                                className="border border-secondary/60 dark:border-primary/60 rounded-md
                                                w-1/2 px-3 py-2 text-secondary bg-primary dark:text-primary dark:bg-secondary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div>
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-2">
                                Details
                            </h3>
                            <div className="h-px bg-gray-200 dark:bg-gray-700 mb-4"></div>

                            {isOwner && (
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faTags} className="text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-300">Created</span>
                                    </div>
                                    <span className="text-gray-800 dark:text-gray-200">{outfit.createdAt.toDate().toLocaleDateString()}</span>
                                </div>
                            )}

                            {/* Additional outfit details */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faTags} className="text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-300">Items</span>
                                </div>
                                <span className="text-gray-800 dark:text-gray-200">3 pieces</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex-1 gap-3 mt-auto pt-4">
                            {isOwner && (
                                <div className="flex">
                                    <DeleteHandler
                                        itemId={outfit.id}
                                        collectionName="clothes"
                                        onSuccessfulDelete={handleSuccessfulDelete}
                                        confirmMessage="Are you sure you want to delete this item?"
                                    >
                                        {(handleDelete) => (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(outfit.id);
                                                }}
                                                className="flex w-full"
                                            >
                                                <span
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors">
                                                    Remove
                                                </span>
                                            </button>
                                        )}
                                    </DeleteHandler>
                                </div>
                            )}
                            {!isOwner && (
                                <LikeOutfitHandler
                                    outfit={outfit}
                                    currentUserId={user?.uid}
                                    title={'Save Outfit'}
                                    className="mx-auto w-full"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};