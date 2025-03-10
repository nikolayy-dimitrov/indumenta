import { useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { WardrobeContext } from "../context/WardrobeContext.tsx";

import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

import { Upload } from "../screens/UploadScreen";
import { StyleSelectionScreen } from "../screens/StyleSelectionScreen";
import { OutfitDisplayScreen } from "../screens/OutfitDisplayScreen";
import InteractiveWardrobe from "../components/InteractiveWardrobe.tsx";

interface StylePreferences {
    color: string;
    occasion: string;
}

interface OutfitRecommendation {
    outfit_id: string;
    outfit_pieces: {
        Top: string;
        Bottom: string;
        Shoes: string;
    };
    match: number;
}

export const StylistPage = () => {
    const { user } = useContext(AuthContext);
    const { isLoading , setIsLoading } = useContext(WardrobeContext);

    const [step, setStep] = useState<'upload' | 'style' | 'outfit'>('upload');
    const [stylePreferences, setStylePreferences] = useState<StylePreferences>({
        color: '',
        occasion: ''
    });
    const [outfit, setOutfit] = useState<OutfitRecommendation[]>([]);

    const apiUrl = import.meta.env.VITE_BACKEND_URL + '/api/generate-outfit';

    const handleStylePreferenceChange = (
        field: keyof StylePreferences,
        value: string
    ) => {
        setStylePreferences(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const generateOutfit = async () => {
        if (!user) return;

        setIsLoading(true);

        const clothesRef = collection(db, "clothes");
        const q = query(clothesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const wardrobeMap = new Map();
        querySnapshot.docs.forEach(doc => {
            wardrobeMap.set(doc.id, {
                id: doc.id,
                imageUrl: doc.data().imageUrl,
                dominantColor: doc.data().dominantColor,
                category: doc.data().category || "Unknown",
                vibe: doc.data().vibe || "Unknown",
                season: doc.data().season || "Unknown",
            });
        });

        const wardrobe = Array.from(wardrobeMap.values());

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wardrobe, stylePreferences }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch outfits');
            }

            const { outfits } = await response.json();

            const mappedOutfits = outfits.map((outfit: OutfitRecommendation) => ({
                ...outfit,
                outfit_pieces: {
                    Top: wardrobeMap.get(outfit.outfit_pieces.Top)?.imageUrl,
                    Bottom: wardrobeMap.get(outfit.outfit_pieces.Bottom)?.imageUrl,
                    Shoes: wardrobeMap.get(outfit.outfit_pieces.Shoes)?.imageUrl,
                },
            }));

            setOutfit(mappedOutfits);
            setStep('outfit');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Check whether the outfit is already in the firebase collection
    const checkIfOutfitSaved = async (outfitId: string) => {
        if (!user) return false;

        try {
            const outfitsRef = collection(db, "outfits");
            const q = query(
                outfitsRef,
                where("userId", "==", user.uid),
                where("outfit_id", "==", outfitId)
            );
            const querySnapshot = await getDocs(q);

            return !querySnapshot.empty;
        } catch (error) {
            console.error("Error checking saved outfit:", error);
            return false;
        }
    };

    // Save generate outfit function
    const saveOutfit = async (outfitToSave: OutfitRecommendation) => {
        if (!user) return;

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];

        try {
            const outfitsRef = collection(db, "outfits");
            const outfitData = {
                userId: user.uid,
                createdAt: new Date(),
                outfit_id: formattedDate + stylePreferences.color + '-' + stylePreferences.occasion,
                outfit_pieces: outfitToSave.outfit_pieces,
                match: outfitToSave.match,
                stylePreferences: {
                    color: stylePreferences.color,
                    occasion: stylePreferences.occasion,
                }
            };

            await addDoc(outfitsRef, outfitData);
        } catch (error) {
            console.error("Error saving outfit:", error);
            throw error;
        }
    };

    return (
        <section id="stylist" className="relative">
            <div className="absolute w-full h-full">
                <InteractiveWardrobe />
            </div>
            <div className={`z-20 relative ${isLoading ? 'hidden' : ''}`}>
                {step === 'upload' ? (
                    <Upload onNext={() => setStep('style')} />
                ) : step === 'style' ? (
                    <StyleSelectionScreen
                        stylePreferences={stylePreferences}
                        onStyleChange={handleStylePreferenceChange}
                        onBack={() => setStep('upload')}
                        onSubmit={generateOutfit}
                    />
                ) : (
                    <OutfitDisplayScreen
                        outfit={outfit}
                        onSaveOutfit={saveOutfit}
                        checkIfOutfitSaved={checkIfOutfitSaved}
                        onBack={() => setStep('style')}
                    />
                )}
            </div>
        </section>
    );
}