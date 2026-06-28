// @ts-ignore - colorthief v3 exports getColor but TS doesn't resolve it properly here
import { getColor } from "colorthief";

export const getDominantColorFromImage = async (
    file: File,
    setDominantColors: React.Dispatch<React.SetStateAction<string[]>>
): Promise<void> => {
    try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = URL.createObjectURL(file);

        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => {
                console.error("Error loading image for color extraction");
                reject(new Error("Image load failed"));
            };
        });

        const color = await getColor(img);
        if (color) {
            setDominantColors((prevColors) => [...prevColors, color.hex()]);
        }
        
        URL.revokeObjectURL(img.src);
    } catch (error) {
        console.error("Error getting dominant color:", error);
    }
};

export const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
