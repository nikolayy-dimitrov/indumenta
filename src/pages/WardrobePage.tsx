import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import {faUserTie, faX} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { OutfitFilter, ClothingItem, SortOption, ViewMode } from "../types/wardrobe.ts";
import { useClothes, useOutfits } from "../hooks/useWardrobe.ts";
import {faShirt} from "@fortawesome/free-solid-svg-icons/faShirt";

export const WardrobePage = () => {
    const { user } = useContext(AuthContext);
    const [viewMode, setViewMode] = useState<ViewMode>('clothes');
    const [selectedImage, setSelectedImage] = useState<ClothingItem | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [outfitFilter, setOutfitFilter] = useState<OutfitFilter>("owned");

    const { clothes, isLoading: isClothesLoading, setClothes } = useClothes(user?.uid);
    const { outfits, isLoading: isOutfitsLoading } = useOutfits(user?.uid, outfitFilter);

    useEffect(() => {
        setViewMode('clothes');
    }, []);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSelectedImage(null);
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    const handleToggleView = (mode: ViewMode) => {
        setViewMode(mode);
    };

    const deleteClothingItem = async (itemId: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, "clothes", itemId));
            setClothes((prev) => prev.filter((item) => item.id !== itemId));
            setSelectedImage(null);
            toast.success("Item successfully removed.", {
                position: "top-center",
                closeOnClick: true,
                theme: "dark",
            });
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item. Please try again.", {
                position: "top-center",
                closeOnClick: true,
                theme: "dark",
            });
        }
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
                    (a.dominantColor || '').localeCompare(b.dominantColor || '')
                );
            default:
                return items;
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen font-Josefin">
                <Link to="/login">Please log in to view your wardrobe.</Link>
            </div>
        );
    }

    if (isOutfitsLoading || isClothesLoading) {
        return (
            <div className="flex justify-center items-center h-screen font-Josefin">
                Loading your wardrobe...
            </div>
        );
    }

    const renderControls = () => (
        <div className="flex max-md:flex-col justify-between items-center mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-wider">
                {viewMode === 'clothes' ? 'Clothes Collection' : 'Outfit Collection'}
            </h1>
            <div
                className="relative w-20 h-10 bg-primary/70 rounded-full flex items-center p-1 cursor-pointer max-md:my-2"
                onClick={() => handleToggleView(viewMode === "clothes" ? "outfits" : "clothes")}
            >
                <motion.div
                    className="absolute w-8 h-8 bg-primary rounded-full shadow-md"
                    layout
                    initial={{x: viewMode === "clothes" ? 2 : 37}}
                    animate={{x: viewMode === "clothes" ? 2 : 37}}
                    transition={{type: "spring", stiffness: 200, damping: 30}}
                />
                <div className="flex justify-between items-center w-full px-3">
                    <span className={`text-sm font-medium ${viewMode === "clothes" ? "text-primary/80" : "text-secondary"}`}>
                        <FontAwesomeIcon icon={faShirt} />
                    </span>
                    <span className={`text-sm font-medium ${viewMode === "outfits" ? "text-primary/80" : "text-secondary"}`}>
                        <FontAwesomeIcon icon={faUserTie} />
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <label htmlFor={viewMode === "clothes" ? "sort" : "filter"}>
                    {viewMode === "clothes" ? "Sort by:" : "Filter:"}
                </label>
                {viewMode === "clothes" ? (
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="border rounded-md px-2 w-[150px] py-1 text-secondary"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="color">Color</option>
                    </select>
                ) : (
                    <select
                        id="filter"
                        value={outfitFilter}
                        onChange={(e) => setOutfitFilter(e.target.value as OutfitFilter)}
                        className="border rounded-md px-2 w-[150px] py-1 text-secondary"
                    >
                        <option value="owned">Owned</option>
                        <option value="saved">Saved</option>
                    </select>
                )}
            </div>
        </div>
    );

    const renderClothesGrid = () => (
        clothes.length === 0 ? (
            <div className="flex justify-center items-center text-center h-[500px] font-Josefin">
                <p className="text-primary/90">
                    Your wardrobe is empty. <br />
                    <Link to="/stylist" className="font-semibold">Start by adding some clothes!</Link>
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {sortClothes(clothes).map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="relative group rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedImage(item)}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, ease: "easeOut", delay: index * 0.2}}
                    >
                        <img
                            src={item.imageUrl}
                            alt="Clothing item"
                            className="w-full h-64 object-cover"
                        />
                        <div
                            className="flex items-start absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div
                                className="w-4 h-4 rounded-full inline-block mr-2"
                                style={{backgroundColor: item.dominantColor}}
                            />
                            <span className="text-sm">{item.uploadedAt.toDate().toLocaleDateString()}</span>
                        </div>
                        <button
                            onClick={() => deleteClothingItem(item.id)}
                            className="absolute top-0 right-0 py-2 px-3 transition duration-400 text-red-800 hover:text-red-600"
                        >
                            <FontAwesomeIcon icon={faX} />
                        </button>
                    </motion.div>
                ))}
            </div>
        )
    );

    const renderOutfitsGrid = () => (
        outfits.length === 0 ? (
            <div className="flex justify-center items-center text-center h-[500px] font-Josefin">
                <p className="text-primary/90">
                    You have no saved outfits. <br/>
                    <Link to="/stylist" className="font-semibold">Start by creating an outfit!</Link>
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {outfits.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="relative group rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, ease: "easeOut", delay: index * 0.2}}
                    >
                        <div className="w-full h-full flex gap-1 overflow-hidden">
                            <div className="w-1/3 h-full">
                                <img
                                    src={item.outfitPieces.Top}
                                    alt="Clothing item"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="w-2/3 h-full flex-col gap-1">
                                <div className="w-full h-1/2">
                                    <img
                                        src={item.outfitPieces.Bottom}
                                        alt="Clothing item"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="w-full h-1/2">
                                    <img
                                        src={item.outfitPieces.Shoes}
                                        alt="Clothing item"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        )
    );

    const renderImageModal = () => (
        selectedImage && (
            <div
                className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center"
                onClick={() => setSelectedImage(null)}
            >
                <button
                    className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                    onClick={() => setSelectedImage(null)}
                >
                    <FontAwesomeIcon icon={faX} size="1x"/>
                </button>
                <div
                    className="relative max-w-[90vw] max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={selectedImage.imageUrl}
                        alt="Clothing item full view"
                        className="max-w-full max-h-[90vh] object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{backgroundColor: selectedImage.dominantColor}}
                            />
                            <span>{selectedImage.category}</span>
                            <span className="ml-auto">
                                {selectedImage.uploadedAt.toDate().toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    );

    return (
        <section className="container mx-auto px-4 py-8 font-Josefin">
            {renderControls()}
            {viewMode === 'clothes' ? renderClothesGrid() : renderOutfitsGrid()}
            {renderImageModal()}
        </section>
    );
};