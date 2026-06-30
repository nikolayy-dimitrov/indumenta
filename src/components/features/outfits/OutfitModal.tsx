import { useState, useEffect, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
    faCircleCheck,
    faTags,
    faPencilAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GlassModal } from "../../ui/modals/GlassModal.tsx";
import { EditorialLabel } from "../../ui/typography/EditorialLabel.tsx";
import { DangerButton } from "../../ui/buttons/DangerButton.tsx";
import { DatePicker } from "../../ui/forms/DatePicker.tsx";
import { toast } from "react-toastify";

import { OutfitItem } from "../../../types/wardrobe.ts";
import { db } from "../../../lib/config/firebaseConfig.ts";
import { AuthContext } from "../../../context/AuthContext.tsx";
import { OptimizedImage } from "../../ui/media/OptimizedImage";
import { DeleteHandler } from "../wardrobe/DeleteHandler.tsx";
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
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setNewLabel(outfit.label || "");
        }
    }, [outfit]);

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

    const onDateChange = async (newDate: Date) => {
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
        onClose();
    };

    return (
        <GlassModal isOpen={!!outfit} onClose={onClose}>
            {outfit && (
                <>
                    <div
                        className="relative w-full flex flex-col p-6 md:p-10 max-h-[85vh] overflow-y-auto scrollbar-hide">

                        {/* Header: Title Editing */}
                        <div className="mb-8 flex items-center gap-4">
                            {!editLabel ? (
                                <>
                                    <h2 className="text-3xl font-light tracking-wide">{outfit.label || 'OUTFIT'}</h2>
                                    <button
                                        onClick={toggleEditLabel}
                                        className="text-primary/40 hover:text-primary transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} size="sm"/>
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <input
                                        value={newLabel}
                                        onChange={(e) => setNewLabel(e.target.value)}
                                        className="bg-transparent border-b border-primary/20 text-3xl font-light tracking-wide text-primary focus:outline-none focus:border-primary px-1 py-0.5 w-full md:w-64"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleLabelChange}
                                        className="text-primary-green/80 hover:text-primary-green transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faCircleCheck} size="lg"/>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="grid md:grid-cols-5 gap-8">
                            {/* Images Display - 3/5 of width */}
                            <div className="md:col-span-3">
                                <div
                                    className="w-full h-full flex flex-col md:flex-row gap-2 relative rounded-2xl overflow-hidden">
                                    <div className="w-full md:w-1/2 aspect-square md:h-[400px]">
                                        <OptimizedImage
                                            src={outfit.outfitPieces.Top} alt="Top"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div
                                        className="w-full md:w-1/2 flex flex-row md:flex-col gap-2">
                                        <div className="w-1/2 md:w-full aspect-square md:h-[196px]">
                                            <OptimizedImage
                                                src={outfit.outfitPieces.Bottom} alt="Bottom"
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="w-1/2 md:w-full aspect-square md:h-[196px]">
                                            <OptimizedImage
                                                src={outfit.outfitPieces.Shoes} alt="Shoes"
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                    {/* Subtle dark gradient overlay to blend corners nicely */}
                                    <div
                                        className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none"/>
                                </div>
                            </div>

                            {/* Details Section - 2/5 of width */}
                            <div className="md:col-span-2 flex flex-col gap-8">
                                {/* Schedule Section */}
                                <div className="flex flex-col gap-3">
                                    <EditorialLabel>Schedule</EditorialLabel>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex flex-col gap-1 w-full relative">
                                            <DatePicker date={date} onChange={onDateChange} />
                                        </div>
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="flex flex-col gap-4">
                                    <EditorialLabel>Details</EditorialLabel>

                                    {isOwner && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faTags}
                                                                 className="text-primary/40 text-xs"/>
                                                <span
                                                    className="text-sm font-light text-primary/80">Created</span>
                                            </div>
                                            <span
                                                className="text-sm font-medium">{outfit.createdAt.toDate().toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    {/* Additional outfit details */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faTags}
                                                             className="text-primary/40 text-xs"/>
                                            <span
                                                className="text-sm font-light text-primary/80">Items</span>
                                        </div>
                                        <span className="text-sm font-medium">3 pieces</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-auto pt-8 border-t border-white/5">
                                    {isOwner && (
                                        <DeleteHandler
                                            itemId={outfit.id}
                                            collectionName="outfits"
                                            onSuccessfulDelete={handleSuccessfulDelete}
                                            confirmMessage="Are you sure you want to remove this outfit?"
                                        >
                                            {(handleDelete) => (
                                                <DangerButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(outfit.id);
                                                    }}
                                                >
                                                    Remove Outfit
                                                </DangerButton>
                                            )}
                                        </DeleteHandler>
                                    )}
                                    {!isOwner && (
                                        <LikeOutfitHandler
                                            outfit={outfit}
                                            currentUserId={user?.uid}
                                            title={'Save Outfit'}
                                            className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl transition-all"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </GlassModal>
    );
};