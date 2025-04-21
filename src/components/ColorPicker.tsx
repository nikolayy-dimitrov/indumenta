import { useState } from "react";
import { ChromePicker, ColorResult } from "react-color";
import { updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../config/firebaseConfig";

type ColorPickerProps = {
    itemId: string;
    initialColor: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
                                                            itemId,
                                                            initialColor,
                                                            isOpen,
                                                            setIsOpen }) => {
    const [tempColor, setTempColor] = useState<string>(initialColor);
    const [color, setColor] = useState<string>(initialColor);

    const handleColorChange = (colorResult: ColorResult) => {
        setTempColor(colorResult.hex);
    };

    const handleColorChangeComplete = async (colorResult: ColorResult) => {
        const newColor = colorResult.hex;
        try {
            const itemDoc = doc(db, "clothes", itemId);
            await updateDoc(itemDoc, { dominantColor: newColor });
            setColor(newColor);
        } catch (error) {
            console.error("Error updating color: ", error);
            toast.error("Error updating color!", {
                position: "top-center",
                closeOnClick: true,
                theme: "dark",
            });
        }
        setIsOpen(false);
    };

    const toggleColorPicker = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(true);
    };

    return (
        <div className="z-30">
            <div
                className={`w-4 h-4 mx-1 rounded-full border cursor-pointer ${isOpen && "hidden"}`}
                style={{ backgroundColor: color }}
                onClick={toggleColorPicker}
            />

            {isOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                    <ChromePicker
                        color={tempColor}
                        onChange={handleColorChange}
                        onChangeComplete={handleColorChangeComplete}
                        disableAlpha={true}
                    />
                </div>
            )}
        </div>
    );
};
