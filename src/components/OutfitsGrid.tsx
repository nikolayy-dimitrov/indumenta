import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

import { OutfitFilter, OutfitItem, ViewMode } from "../types/wardrobe.ts";
import { AuthContext } from "../context/AuthContext.tsx";
import { DeleteHandler } from "./UI/DeleteHandler.tsx";
import { LikeOutfitHandler } from "./UI/LikeOutfitHandler.tsx";
import { useUserPhotos } from "../hooks/useWardrobe.ts";

interface OutfitsGridProps {
    outfits: OutfitItem[];
    viewMode: ViewMode;
    outfitFilter: OutfitFilter;
    setOutfits: React.Dispatch<React.SetStateAction<OutfitItem[]>>;
    onSelectOutfit: (outfit: OutfitItem) => void;
}

export const OutfitsGrid = ({
                                outfits,
                                viewMode,
                                outfitFilter,
                                setOutfits,
                                onSelectOutfit
                            }: OutfitsGridProps) => {
    const { user } = useContext(AuthContext);

    // Extract all user IDs from outfits
    const userIds = useMemo(() => {
        return outfits.map(outfit => outfit.userId).filter(Boolean) as string[]
    }, [outfits]);

    // Fetch user photos for all outfit creators
    const { userPhotos } = useUserPhotos(outfitFilter !== 'owned' ? userIds : []);

    const handleSuccessfulDelete = (outfitId: string) => {
        setOutfits((prev) => prev.filter((item) => item.id !== outfitId));
    };

    if (outfits.length === 0) {
        return (
            <div className="flex justify-center items-center text-center h-[500px] font-Josefin">
                <p className="text-primary/90">
                    You have no saved outfits. <br />
                    <Link to="/stylist" className="font-semibold">
                        Start by creating an outfit!
                    </Link>
                </p>
            </div>
        );
    }

    return viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {outfits.map((item, index) => (
                <motion.div
                    key={item.id}
                    onClick={() => onSelectOutfit(item)}
                    className="overflow-hidden cursor-pointer rounded-lg border border-gray-200 hover:border-primary/50 transition-all shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, transition: { stiffness: 300, damping: 20 } }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.2 }}
                >
                    {/* Outfit Images Layout */}
                    <div className="relative aspect-square">
                        <div className="w-full h-full flex gap-1 overflow-hidden">
                            <div className="w-1/3 h-full">
                                <img
                                    src={item.outfitPieces.Top}
                                    alt="Top"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="w-2/3 h-full flex flex-col gap-1">
                                <div className="w-full h-1/2">
                                    <img
                                        src={item.outfitPieces.Bottom}
                                        alt="Bottom"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="w-full h-1/2">
                                    <img
                                        src={item.outfitPieces.Shoes}
                                        alt="Shoes"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {outfitFilter === 'owned' ? (
                            <>
                                {/* Delete Button */}
                                <DeleteHandler
                                    itemId={item.id}
                                    collectionName="outfits"
                                    onSuccessfulDelete={handleSuccessfulDelete}
                                    confirmMessage="Are you sure you want to delete this outfit?"
                                >
                                    {(handleDelete) => (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item.id);
                                            }}
                                            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-red-600 hover:bg-white/70 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faX} className="h-3 w-3" />
                                        </button>
                                    )}
                                </DeleteHandler>
                            </>
                        ) : (
                            <>
                                {/* Like/Save button */}
                                <div className="absolute right-2 top-2">
                                    <LikeOutfitHandler outfit={item} currentUserId={user?.uid} />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Outfit Info */}
                    <div className="p-4">
                        <h3 className="text-lg font-medium">{item.label || "Untitled Outfit"}</h3>

                        {/* Tags */}
                        <div className="mt-1 flex flex-wrap gap-1">
                            {item.match && (
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
                                    {item.match}
                                </span>
                            )}
                            {item.stylePreferences.occasion && (
                                <span className="px-2 py-1 text-xs capitalize rounded-full bg-gray-100 text-gray-800 font-medium">
                                    {item.stylePreferences.occasion}
                                </span>
                            )}
                            {item.stylePreferences.color && (
                                <span className="px-2 py-1 text-xs capitalize rounded-full bg-gray-100 text-gray-800 font-medium">
                                    {item.stylePreferences.color}
                                </span>
                            )}
                        </div>

                        <div className="mt-3 flex -space-x-2">
                            {outfitFilter === 'owned' ? (
                                <>
                                    {/* Item Thumbnails Circle Display */}
                                    {Object.entries(item.outfitPieces).map(
                                        ([pieceType, imageUrl]) =>
                                            imageUrl && (
                                                <div
                                                    key={`${item.id}-${pieceType}`}
                                                    className="h-10 w-10 overflow-hidden rounded-full border-2 border-white"
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={pieceType}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden mr-2">
                                        {item.userId && userPhotos[item.userId] ? (
                                            <img
                                                src={userPhotos[item.userId]}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-300"/>
                                        )}
                                    </div>
                                    <span
                                        className="text-sm text-gray-600">{item.userId?.slice(0, 8) || "User"}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    ) : (
        <div className="space-y-2">
            {outfits.map((item, index) => (
                <motion.div
                    key={item.id}
                    onClick={() => onSelectOutfit(item)}
                    className="overflow-hidden cursor-pointer rounded-lg border border-gray-200 hover:border-primary/50 transition-all shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                >
                    <div className="flex">
                        {/* Left side outfit preview */}
                        <div className="h-24 w-24 flex-shrink-0 relative">
                            <div className="w-full h-full flex gap-0.5 overflow-hidden">
                                <div className="w-1/3 h-full">
                                    <img
                                        src={item.outfitPieces.Top}
                                        alt="Top"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="w-2/3 h-full flex flex-col gap-0.5">
                                    <div className="w-full h-1/2">
                                        <img
                                            src={item.outfitPieces.Bottom}
                                            alt="Bottom"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="w-full h-1/2">
                                        <img
                                            src={item.outfitPieces.Shoes}
                                            alt="Shoes"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side content */}
                        <div className="flex flex-1 items-center p-4">
                            <div className="flex-1">
                                <h3 className="font-medium">{item.label || "Untitled Outfit"}</h3>
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {item.match && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
                                            {item.match}
                                        </span>
                                    )}
                                    {item.stylePreferences.occasion && (
                                        <span className="px-2 py-1 text-xs capitalize rounded-full bg-gray-100 text-gray-800 font-medium">
                                            {item.stylePreferences.occasion}
                                        </span>
                                    )}
                                    {item.stylePreferences.color && (
                                        <span className="px-2 py-1 text-xs capitalize rounded-full bg-gray-100 text-gray-800 font-medium">
                                            {item.stylePreferences.color}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="max-md:hidden md:flex items-center gap-2">
                                {outfitFilter === 'owned' ? (
                                    <>
                                        {/* Item circles display */}
                                        <div className="flex -space-x-2">
                                            {Object.entries(item.outfitPieces)
                                                .slice(0, 3)
                                                .map(
                                                    ([pieceType, imageUrl]) =>
                                                        imageUrl && (
                                                            <div
                                                                key={`${item.id}-${pieceType}`}
                                                                className="h-8 w-8 overflow-hidden rounded-full border-2 border-white"
                                                            >
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={pieceType}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                        )
                                                )}
                                            {Object.keys(item.outfitPieces).length > 3 && (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs">
                                                    +{Object.keys(item.outfitPieces).length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="text-sm text-gray-600">{item.userId?.slice(0, 8) || "User"}</span>
                                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden mr-2">
                                            {item.userId && userPhotos[item.userId] ? (
                                                <img
                                                    src={userPhotos[item.userId]}
                                                    alt="User"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-300"/>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {outfitFilter === 'owned' ? (
                                    <>
                                        {/* Delete button */}
                                        <DeleteHandler
                                            itemId={item.id}
                                            collectionName="outfits"
                                            onSuccessfulDelete={handleSuccessfulDelete}
                                            confirmMessage="Are you sure you want to delete this outfit?"
                                        >
                                            {(handleDelete) => (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(item.id);
                                                    }}
                                                    className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-red-600 transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faX} className="h-3 w-3" />
                                                </button>
                                            )}
                                        </DeleteHandler>
                                    </>
                                ) : (
                                    <>
                                        {/* Like/Save button */}
                                        <LikeOutfitHandler outfit={item} currentUserId={user?.uid} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};