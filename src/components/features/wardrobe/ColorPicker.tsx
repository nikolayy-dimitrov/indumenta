import { useState } from "react";
import { ChromePicker, ColorResult } from "react-color";
import { updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../../lib/config/firebaseConfig.ts";

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

    const handleSaveColor = async () => {
        try {
            const itemDoc = doc(db, "clothes", itemId);
            // Keep original behavior but apply it only on Save
            await updateDoc(itemDoc, { dominantColor: tempColor, "analysis.color": tempColor });
            setColor(tempColor);
            toast.success("Color updated!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                theme: "dark",
            });
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
        setTempColor(color); // Reset temp to current before opening
        setIsOpen(true);
    };

    return (
        <>
            <div
                className={`w-6 h-6 rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform`}
                style={{ backgroundColor: color, border: '1px solid rgba(255,255,255,0.2)' }}
                onClick={toggleColorPicker}
                title="Change Color"
            />

            {isOpen && (
                <div 
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm" 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                    }}
                >
                    <div 
                        className="flex flex-col gap-4 p-6 bg-secondary border border-white/10 rounded-3xl shadow-2xl" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-light text-primary mb-2 text-center tracking-wider">Adjust Color</h3>
                        <div className="bg-white rounded-xl overflow-hidden shadow-inner">
                            <ChromePicker
                                color={tempColor}
                                onChange={handleColorChange}
                                disableAlpha={true}
                                styles={{ default: { picker: { boxShadow: 'none', background: 'transparent' } } }}
                            />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-2 text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveColor}
                                className="flex-1 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold transition-all"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
