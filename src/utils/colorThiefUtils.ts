import ColorThief from "colorthief";

export const getDominantColorFromImage = async (
    file: File,
    setDominantColors: React.Dispatch<React.SetStateAction<string[]>>
) => {
    try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const tempImg = document.createElement("img");
            tempImg.crossOrigin = "Anonymous";

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const centerX = Math.floor(img.width / 4);
            const centerY = Math.floor(img.height / 4);
            const centerWidth = Math.floor(img.width / 2);
            const centerHeight = Math.floor(img.height / 2);

            const centerCanvas = document.createElement("canvas");
            centerCanvas.width = centerWidth;
            centerCanvas.height = centerHeight;
            const centerCtx = centerCanvas.getContext("2d");
            if (!centerCtx) return;

            centerCtx.drawImage(
                canvas,
                centerX,
                centerY,
                centerWidth,
                centerHeight,
                0,
                0,
                centerWidth,
                centerHeight
            );

            centerCanvas.toBlob((blob) => {
                if (blob) {
                    tempImg.src = URL.createObjectURL(blob);
                    tempImg.onload = () => {
                        const colorThief = new ColorThief();
                        const dominantColorRGB = colorThief.getColor(tempImg);
                        const dominantColorHex = rgbToHex(
                            dominantColorRGB[0],
                            dominantColorRGB[1],
                            dominantColorRGB[2]
                        );
                        setDominantColors((prevColors) => [...prevColors, dominantColorHex]);
                        URL.revokeObjectURL(tempImg.src);
                    };
                }
            }, "image/png");
        };
    } catch (error) {
        console.error("Error getting dominant color:", error);
    }
};

export const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
