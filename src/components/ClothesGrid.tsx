import React, { useState } from "react";
import { Link } from "react-router-dom";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

import { ClothingItem, SortOption, ViewMode } from "../types/wardrobe.ts";
import { ColorPicker } from "./UI/ColorPicker.tsx";
import { DeleteHandler } from "./UI/DeleteHandler.tsx";

interface ClothesGridProps {
    clothes: ClothingItem[];
    viewMode: ViewMode;
    setClothes: React.Dispatch<React.SetStateAction<ClothingItem[]>>;
    sortBy: SortOption;
    onSelectItem: (item: ClothingItem) => void;
}

export const ClothesGrid = ({
                                clothes,
                                viewMode,
                                setClothes,
                                sortBy,
                                onSelectItem
                            }: ClothesGridProps) => {
    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);

    const handleSuccessfulDelete = (itemId: string) => {
        setClothes((prev) => prev.filter((item) => item.id !== itemId));
    };

    const sortClothes = (items: ClothingItem[]): ClothingItem[] => {
        switch (sortBy) {
            case "newest":
                return [...items].sort(
                    (a, b) => b.uploadedAt.toMillis() - a.uploadedAt.toMillis()
                );
            case "oldest":
                return [...items].sort(
                    (a, b) => a.uploadedAt.toMillis() - b.uploadedAt.toMillis()
                );
            case "color":
                return [...items].sort((a, b) =>
                    (a.dominantColor || "").localeCompare(b.dominantColor || "")
                );
            default:
                return items;
        }
    };

    if (clothes.length === 0) {
        return (
            <div className="flex justify-center items-center text-center h-[500px] font-Josefin">
                <p className="text-primary/90">
                    Your wardrobe is empty. <br />
                    <Link to="/stylist" className="font-semibold">
                        Start by adding some clothes!
                    </Link>
                </p>
            </div>
        );
    }

    return viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {sortClothes(clothes).map((item, index) => (
                <motion.div
                    key={item.id}
                    className="overflow-hidden cursor-pointer rounded-lg border border-gray-200 hover:border-primary/50 transition-all shadow-sm"
                    onClick={() => onSelectItem(item)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.2 }}
                >
                    <div className="relative aspect-square">
                        <img
                            src={item.imageUrl}
                            alt="Clothing item"
                            className="w-full h-full object-cover"
                        />
                        <DeleteHandler
                            itemId={item.id}
                            collectionName="clothes"
                            onSuccessfulDelete={handleSuccessfulDelete}
                            confirmMessage="Are you sure you want to delete this item?"
                        >
                            {(handleDelete) => (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item.id);
                                    }}
                                    className="absolute right-1 top-1 h-8 w-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-red-600 hover:bg-white/70 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faX} className="h-3 w-3" />
                                </button>
                            )}
                        </DeleteHandler>

                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <ColorPicker
                                itemId={item.id}
                                initialColor={item.dominantColor}
                                isOpen={isColorPickerOpen}
                                setIsOpen={setIsColorPickerOpen}
                            />
                            <span className={`text-xs ${isColorPickerOpen && "hidden"}`}>
                                {item.uploadedAt.toDate().toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="p-3">
                        <h3 className="truncate text-sm font-medium">
                            {item.category || "Untitled Item"}
                        </h3>
                        {item.subCategory && (
                            <div className="mt-1 flex flex-wrap gap-1">
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
                                    {item.subCategory}
                                </span>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    ) : (
        <div className="space-y-2">
            {sortClothes(clothes).map((item, index) => (
                <motion.div
                    key={item.id}
                    className="overflow-hidden cursor-pointer rounded-lg border border-gray-200 hover:border-primary/50 transition-all shadow-sm"
                    onClick={() => onSelectItem(item)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                >
                    <div className="flex">
                        <div className="h-24 w-24 flex-shrink-0 relative">
                            <img
                                src={item.imageUrl}
                                alt="Clothing item"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="flex flex-1 items-center justify-between p-4">
                            <div>
                                <h3 className="font-medium">{item.category || "Untitled Item"}</h3>
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {item.subCategory && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
                                            {item.subCategory}
                                        </span>
                                    )}
                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
                                            {item.uploadedAt.toDate().toLocaleDateString()}
                                        </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <DeleteHandler
                                    itemId={item.id}
                                    collectionName="clothes"
                                    onSuccessfulDelete={handleSuccessfulDelete}
                                    confirmMessage="Are you sure you want to delete this item?"
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
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};