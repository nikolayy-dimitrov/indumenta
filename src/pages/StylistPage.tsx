import { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { StyleSelectionScreen } from "../screens/StyleSelectionScreen";
import { Upload } from "../screens/UploadScreen";
import { OutfitDisplayScreen } from "../screens/OutfitDisplayScreen";

import OpenAI from "openai";

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
    const {user} = useContext(AuthContext);
    const [step, setStep] = useState<'upload' | 'style' | 'outfit'>('upload');
    const [stylePreferences, setStylePreferences] = useState<StylePreferences>({
        color: '',
        occasion: ''
    });
    const [hasClothes, setHasClothes] = useState(false);
    const [outfit, setOutfit] = useState<OutfitRecommendation[]>([]);

    useEffect(() => {
        const checkExistingClothes = async () => {
            if (!user) return;

            const clothesRef = collection(db, "clothes");
            const q = query(clothesRef, where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            setHasClothes(!querySnapshot.empty);
        };

        checkExistingClothes();
    }, [user]);

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

        const openai = new OpenAI({
            apiKey: import.meta.env.VITE_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true
        });

        // Filter the top 3 suggestions from each item category
        const prefilterPrompt = `
            You are an assistant that helps generate outfits in JSON format from wardrobe items based on user preferences and metadata.
            
            ### User Preferences:
            ${stylePreferences.color ? `- **Color Preference:** ${stylePreferences.color}` : ''}
            ${stylePreferences.occasion ? `- **Occasion:** ${stylePreferences.occasion}` : ''}
            
            ### Wardrobe Metadata:
            Each item in the wardrobe is represented as follows:
            
            - Category: The type of item ("Top" - Shirt, Jacket, T-shirt, Top, Blouse, etc.; "Bottom" - Pants, Joggers, Skirt, Trousers, etc; "Shoes").
            - Vibe: The item's style or mood (e.g., "Casual", "Formal").
            - Season: The item's suitability for a season ("Winter", "Summer", "Autumn"/"Fall", "Spring", "Seasonless").
            - Color: The dominant color of the item.
            - ImageURL: A URL pointing to the item's image.
            
            ### Wardrobe Items:
            ${wardrobe.map((item) =>
                        `- Item ${item.id}: { Category: ${item.category}, ${item.vibe ? `Vibe: ${item.vibe},` : ''} Season: ${item.season ? item.season : `Seasonless`} , Color: ${item.dominantColor}, ImageURL: ${item.imageUrl} }`
                    ).join("\n")}
            
            ### Task:
            Select and recommend the top 3 outfits based on the user's preferences. Each outfit must contain:
            - 1 "Top"
            - 1 "Bottom"
            - 1 "Shoes"
            
            Outfits should be ranked based on their match percentage, considering both color preference and occasion.
            Output only the following JSON format:
            
            \`\`\`json
            {
                "outfits": [
                    {
                        "outfit_id": "Outfit 1",
                        "outfit_pieces": {
                            "Top": "item.id",
                            "Bottom": "item.id",
                            "Shoes": "item.id"
                        },
                        "match": 100
                    },
                    {
                        "outfit_id": "Outfit 2",
                        "outfit_pieces": {
                            "Top": "item.id",
                            "Bottom": "item.id",
                            "Shoes": "item.id"
                        },
                        "match": 85
                    },
                    {
                        "outfit_id": "Outfit 3",
                        "outfit_pieces": {
                            "Top": "item.id",
                            "Bottom": "item.id",
                            "Shoes": "item.id"
                        },
                        "match": 70
                    }
                ]
            }
            \`\`\`
`;

        console.log(prefilterPrompt);

        const prefilterResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "You are a helpful wardrobe assistant."},
                {role: "user", content: prefilterPrompt},
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const responseText = prefilterResponse.choices[0]?.message?.content;
        console.log(responseText);

        if (!responseText) {
            throw new Error("OpenAI response content is missing");
        }

        try {
            // Extract JSON content using regex
            const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
            if (!jsonMatch) throw new Error("JSON format not found");

            const filteredItems = JSON.parse(jsonMatch[1]) as { outfits: OutfitRecommendation[] };
            console.log(filteredItems);

            const { outfits } = filteredItems;

            const mappedOutfits = outfits.map(outfit => ({
                ...outfit,
                outfit_pieces: {
                    Top: wardrobeMap.get(outfit.outfit_pieces.Top)?.imageUrl,
                    Bottom: wardrobeMap.get(outfit.outfit_pieces.Bottom)?.imageUrl,
                    Shoes: wardrobeMap.get(outfit.outfit_pieces.Shoes)?.imageUrl,
                }
            }));

            setOutfit(mappedOutfits);
            setStep('outfit');
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    };

    return (
        <section id="stylist" className="mt-4">
            {step === 'upload' ? (
                <Upload hasClothes={hasClothes} onNext={() => setStep('style')} />
            ) : step === 'style' ? (
                <StyleSelectionScreen
                    stylePreferences={stylePreferences}
                    onStyleChange={handleStylePreferenceChange}
                    onBack={() => setStep('upload')}
                    onSubmit={generateOutfit}
                />
            ) : (
                <OutfitDisplayScreen outfit={outfit} onBack={() => setStep('style')} />
            )}
        </section>
    );
}