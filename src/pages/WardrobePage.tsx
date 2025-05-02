import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { faUserTie, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShirt } from "@fortawesome/free-solid-svg-icons/faShirt";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import { OutfitFilter, OutfitItem, ClothingItem, SortOption, ViewMode } from "../types/wardrobe.ts";
import { useClothes, useOutfits } from "../hooks/useWardrobe.ts";
import { db } from "../config/firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import { ColorPicker } from "../components/UI/ColorPicker.tsx";
import { ConfirmModal } from "../components/UI/ConfirmModal.tsx";
import { LoadingIndicator } from "../components/UI/LoadingIndicator.tsx";
import { OutfitModal } from "../components/UI/OutfitModal.tsx";
import { ClothesModal } from "../components/UI/ClothesModal.tsx";
import { useEscapeKey } from "../hooks/useEscapeKey.ts";

// TODO: Add total outfits and clothes count
export const WardrobePage = () => {
    const { user } = useContext(AuthContext);
    const [viewMode, setViewMode] = useState<ViewMode>('clothes');
    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);

    const [selectedImage, setSelectedImage] = useState<ClothingItem | null>(null);
    const [selectedOutfit, setSelectedOutfit] = useState<OutfitItem | null>(null);

    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [outfitToDelete, setOutfitToDelete] = useState<string | null>(null);

    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [outfitFilter, setOutfitFilter] = useState<OutfitFilter>("owned");

    const { clothes, isLoading: isClothesLoading, setClothes } = useClothes(user?.uid);
    const { outfits, isLoading: isOutfitsLoading, setOutfits } = useOutfits(user?.uid, outfitFilter);

    const isOwner = user?.uid === selectedOutfit?.userId;

    useEffect(() => {
        setViewMode('clothes');
    }, []);

    // Callback function to reset all modal/popup states
    const handleResetStates = useCallback(() => {
        setSelectedImage(null);
        setSelectedOutfit(null);
        setIsColorPickerOpen(false);
        setShowConfirm(false);
    }, []);

    useEscapeKey(handleResetStates);

    const handleToggleView = (mode: ViewMode) => {
        setViewMode(mode);
    };

    const handleDeleteItem = (itemId: string) => {
        setItemToDelete(itemId);
        setShowConfirm(true);
    };

    const confirmDeleteItem = async () => {
        if (!itemToDelete) return;

        try {
            await deleteDoc(doc(db, "clothes", itemToDelete));
            setClothes((prev) => prev.filter((item) => item.id !== itemToDelete));
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
        setShowConfirm(false);
        setItemToDelete(null);
    };

    const cancelDeleteItem = () => {
        setShowConfirm(false);
        setItemToDelete(null);
    };

    const handleDeleteOutfit = (itemId: string) => {
        setOutfitToDelete(itemId);
        setShowConfirm(true);
    };

    const confirmDeleteOutfit = async () => {
        if (!outfitToDelete) return;

        try {
            await deleteDoc(doc(db, "outfits", outfitToDelete));
            setOutfits((prev) => prev.filter((item) => item.id !== outfitToDelete));
            setSelectedImage(null);
            toast.success("Outfit successfully removed.", {
                position: "top-center",
                closeOnClick: true,
                theme: "dark",
            });
        } catch (error) {
            console.error("Error deleting outfit: ", error);
            toast.error("Failed to delete outfit. Please try again.", {
                position: "top-center",
                closeOnClick: true,
                theme: "dark",
            });
        }
        setShowConfirm(false);
        setOutfitToDelete(null);
    };

    const cancelDeleteOutfit = () => {
        setShowConfirm(false);
        setOutfitToDelete(null);
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
                <Link to="/sign-in">Please log in to view your wardrobe.</Link>
            </div>
        );
    }

    if (isOutfitsLoading || isClothesLoading) {
        return <LoadingIndicator />
    }

    const renderControls = () => (
        <div className="grid md:grid-cols-3 gap-x-40 max-lg:gap-x-8 gap-y-1 justify-items-center items-center mb-8">
            <h1
                className="text-2xl font-bold uppercase tracking-wider text-secondary [-webkit-text-stroke:0.8px_#F8E9D5]"
            >
                {viewMode === 'clothes' ? 'Clothes Collection' : 'Outfit Collection'}
            </h1>
            <div
                className="relative w-20 h-10 bg-secondary border-2 border-primary rounded-full flex items-center p-1 cursor-pointer max-md:my-2"
                onClick={() => handleToggleView(viewMode === "clothes" ? "outfits" : "clothes")}
            >
                <motion.div
                    className="absolute w-7 h-7 bg-secondary border-2 border-primary rounded-full shadow-md"
                    layout
                    initial={{x: viewMode === "clothes" ? 2 : 37}}
                    animate={{x: viewMode === "clothes" ? 2 : 37}}
                    transition={{type: "spring", stiffness: 200, damping: 30}}
                />
                <div className="flex justify-between items-center h-full my-auto w-full px-3">
                    <span className={`max-h-4 text-sm font-medium ${viewMode === "clothes" ? "text-secondary" : "text-primary"}`}>
                        <FontAwesomeIcon icon={faShirt} />
                    </span>
                    <span className={`max-h-4 text-sm font-medium ${viewMode === "outfits" ? "text-secondary" : "text-primary"}`}>
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
                            className="flex items-center justify-start absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ColorPicker
                                itemId={item.id}
                                initialColor={item.dominantColor}
                                isOpen={isColorPickerOpen}
                                setIsOpen={setIsColorPickerOpen}
                            />
                            <span className={`text-sm ${isColorPickerOpen && 'hidden'}`}>{item.uploadedAt.toDate().toLocaleDateString()}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(item.id);
                            }}
                            className="absolute top-0 right-0 py-2 px-3 transition duration-400 text-red-800 hover:text-red-600"
                        >
                            <FontAwesomeIcon icon={faX} />
                        </button>
                        {showConfirm && (
                            <ConfirmModal
                                message="Are you sure you want to delete this item?"
                                onConfirm={confirmDeleteItem}
                                onCancel={cancelDeleteItem}
                            />
                        )}
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
                        onClick={() => setSelectedOutfit(item)}
                        className="relative group rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.04, y: -10, transition: {stiffness: 300, damping: 20} }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.2 }}
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
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOutfit(item.id);
                            }}
                            className="absolute top-0 right-0 py-2 px-3 transition duration-400 text-red-800 hover:text-red-600"
                        >
                            <FontAwesomeIcon icon={faX}/>
                        </button>
                        {showConfirm && (
                            <ConfirmModal
                                message="Are you sure you want to delete this outfit?"
                                onConfirm={confirmDeleteOutfit}
                                onCancel={cancelDeleteOutfit}
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        )
    );

    const renderImageModal = () => (
        <ClothesModal
            selectedImage={selectedImage}
            onClose={() => setSelectedImage(null)} />
    );

    const renderOutfitModal = () => (
        <OutfitModal
            outfit={selectedOutfit}
            onClose={() => setSelectedOutfit(null)}
            isOwner={isOwner}
        />
    );

    return (
        <section className="container mx-auto px-4 py-8 font-Josefin">
            {renderControls()}
            {viewMode === 'clothes' ? renderClothesGrid() : renderOutfitsGrid()}
            {renderImageModal()}
            {renderOutfitModal()}
        </section>
    );
};