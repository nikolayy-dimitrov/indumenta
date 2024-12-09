import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { collection, query, where, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

import { AuthContext } from "../context/AuthContext";

import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {toast} from "react-toastify";

interface ClothingItem {
    id: string;
    imageUrl: string;
    dominantColor: string;
    uploadedAt: Timestamp;
    userId: string;
    category: string;
}

type SortOption = "newest" | "oldest" | "color";

export const WardrobePage = () => {
    const { user } = useContext(AuthContext);
    const [clothes, setClothes] = useState<ClothingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [selectedImage, setSelectedImage] = useState<ClothingItem | null>(null);

    useEffect(() => {
        const fetchClothes = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const clothesRef = collection(db, "clothes");
                const q = query(
                    clothesRef,
                    where("userId", "==", user.uid)
                );

                const querySnapshot = await getDocs(q);

                const clothesData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        imageUrl: data.imageUrl,
                        dominantColor: data.dominantColor,
                        uploadedAt: data.uploadedAt,
                        userId: data.userId,
                        category: data.category
                    };
                });

                setClothes(clothesData);
            } catch (error) {
                console.error("Error fetching clothes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClothes();
    }, [user]);

    const deleteClothingItem = async (itemId: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, "clothes", itemId));
            setClothes((prev) => prev.filter((item) => item.id !== itemId)); // Update the state
            setSelectedImage(null); // Close the modal
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

    // Handle escape key press to close modal
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

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen font-Josefin">
                <Link to="/login">Please log in to view your wardrobe.</Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen font-Josefin">
                Loading your wardrobe...
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 font-Josefin">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Your Wardrobe</h1>
                <div className="flex items-center gap-4">
                    <label htmlFor="sort">
                        Sort by:
                    </label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="border rounded-md px-2 py-1 text-secondary"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="color">Color</option>
                    </select>
                </div>
            </div>

            {clothes.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-primary/90">
                        Your wardrobe is empty. <br />
                        <Link to="/stylist" className="font-semibold">Start by adding some clothes!</Link>
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sortClothes(clothes).map((item) => (
                        <div
                            key={item.id}
                            className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => setSelectedImage(item)}
                        >
                            <img
                                src={item.imageUrl}
                                alt="Clothing item"
                                className="w-full h-64 object-cover"
                            />

                            <div className="flex items-start absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div
                                    className="w-4 h-4 rounded-full inline-block mr-2"
                                    style={{ backgroundColor: item.dominantColor }}
                                />
                                    <span className="text-sm">{item.uploadedAt.toDate().toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Full-screen Image Modal */}
            {selectedImage && (
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
                    <button
                        onClick={() => deleteClothingItem(selectedImage.id)}
                        className="mt-2 w-1/3 rounded-md text-primary bg-secondary/90 hover:opacity-80 py-1 px-2"
                    >
                        Remove Item
                    </button>
                </div>
            )}
        </div>
    );
};