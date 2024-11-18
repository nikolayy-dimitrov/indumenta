import { useContext, useEffect, useState } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import {faX} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface ClothingItem {
    id: string;
    imageUrl: string;
    dominantColor: string;
    uploadedAt: Timestamp;
    userId: string;
    clothingType: string;
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
                        clothingType: data.clothingType
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
                Please log in to view your wardrobe.
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
                    <label htmlFor="sort" className="text-sm">
                        Sort by:
                    </label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="border rounded-md px-2 py-1"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="color">Color</option>
                    </select>
                </div>
            </div>

            {clothes.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        Your wardrobe is empty. Start by adding some clothes!
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
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <FontAwesomeIcon icon={faX} size="1x" />
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
                                    style={{ backgroundColor: selectedImage.dominantColor }}
                                />
                                <span>{selectedImage.clothingType}</span>
                                <span className="ml-auto">
                                    {selectedImage.uploadedAt.toDate().toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};