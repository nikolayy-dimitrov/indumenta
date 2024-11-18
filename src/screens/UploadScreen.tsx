import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';

import {db, storage} from "../config/firebaseConfig";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {addDoc, collection} from "firebase/firestore";

import ColorThief from "colorthief";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShirt} from "@fortawesome/free-solid-svg-icons/faShirt";

import Wardrobe from "../assets/wardrobe-empty-comic.jpeg";

interface PredictionResult {
    className: string;
    probability: number;
}

interface CategoryDetails {
    name: string;
    keywords: string[];
}

interface ModelWrapper {
    mobilenet: mobilenet.MobileNet | null;
    fashion: tf.LayersModel | null;
}

const CLOTHING_CATEGORIES: Record<string, CategoryDetails> = {
    UPPER: {
        name: 'Upper Body',
        keywords: ['shirt', 'jersey', 'sweater', 'jacket', 'coat', 'blazer', 'hoodie', 't-shirt', 'blouse', 'top', 'pullover']
    },
    LOWER: {
        name: 'Lower Body',
        keywords: ['pants', 'jeans', 'Trouser', 'shorts', 'skirt', 'leggings', 'dress']
    },
    SHOES: {
        name: 'Shoes',
        keywords: ['shoe', 'sneaker', 'boot', 'sandal', 'slipper', 'footwear']
    },
    ACCESORIES: {
        name: 'Accessories',
        keywords: ['Bag'],
    }
};

const classNames = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
    'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot'];

export const Upload: React.FC<{ hasClothes: boolean; onNext: () => void }> = ({
    hasClothes,
    onNext
                                                                              }) => {
    const [images, setImages] = useState<File[]>([]);
    const [dominantColors, setDominantColors] = useState<string[]>([]);
    const [clothingTypes, setClothingTypes] = useState<string[]>([]);
    const [subTypes, setSubTypes] = useState<string[]>([]);
    const [models, setModels] = useState<ModelWrapper>({ mobilenet: null, fashion: null });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { user } = useContext(AuthContext);


    useEffect(() => {
        const initModels = async () => {
            try {
                await tf.setBackend('webgl');
                await tf.ready();

                // Create a new Sequential model with proper input shape
                const reconstructFashionModel = async (modelPath: string) => {
                    const model = await tf.loadLayersModel(modelPath);

                    // Create a new model with explicit input shape
                    const newModel = tf.sequential({
                        layers: [
                            tf.layers.inputLayer({inputShape: [28, 28, 1]}),
                            ...model.layers.slice(1) // Skip the original input layer
                        ]
                    });

                    // Copy weights from the original model
                    for (let i = 0; i < model.layers.length - 1; i++) {
                        const weights = model.layers[i + 1].getWeights();
                        newModel.layers[i].setWeights(weights);
                    }

                    return newModel;
                };

                // Load the models in parallel
                const [mobilenetModel, fashionModel] = await Promise.all([
                    mobilenet.load(),
                    reconstructFashionModel('exported_model_converted/model.json')
                ]);

                setModels({
                    mobilenet: mobilenetModel,
                    fashion: fashionModel
                });

                setIsLoading(false);
            } catch (error) {
                console.error("Failed to initialize models:", error);

                // Fallback initialization
                try {
                    const fallbackModel = tf.sequential({
                        layers: [
                            tf.layers.inputLayer({inputShape: [28, 28, 1]}),
                            tf.layers.conv2d({
                                filters: 32,
                                kernelSize: 3,
                                activation: 'relu'
                            }),
                            tf.layers.flatten(),
                            tf.layers.dense({units: 10, activation: 'softmax'})
                        ]
                    });

                    setModels(prev => ({
                        ...prev,
                        fashion: fallbackModel
                    }));
                } catch (fallbackError) {
                    console.error("Fallback model initialization failed:", fallbackError);
                }

                setIsLoading(false);
            }
        };

        initModels();

        return () => {
            // Cleanup
            if (models.fashion) {
                models.fashion.dispose();
            }
            if (models.mobilenet) {
                tf.dispose();
            }
        };
    }, []);

    const makeFashionPrediction = async (imageData: number[][]): Promise<PredictionResult> => {
        if (!models.fashion) throw new Error("Fashion model not loaded");

        try {
            // Reshape the input to match the model's expected shape [batch, height, width, channels]
            const input = tf.tensor(imageData)
                .expandDims(-1)  // Add channel dimension
                .expandDims(0);  // Add batch dimension

            // Get predictions
            const logits = models.fashion.predict(input) as tf.Tensor;
            const probabilities = tf.softmax(logits);

            const predictionArray = await probabilities.array() as number[][];
            const predictedClass = await tf.argMax(probabilities, 1).array() as number[];

            // Cleanup tensors
            input.dispose();
            logits.dispose();
            probabilities.dispose();

            return {
                className: classNames[predictedClass[0]],
                probability: predictionArray[0][predictedClass[0]]
            };
        } catch (error) {
            console.error("Prediction error:", error);
            throw error;
        }
    };

    const classifyImage = async (file: File): Promise<{ category: string, subtype: string }> => {
        if (!models.fashion) return { category: "Unknown", subtype: "Unknown" };

        try {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            await new Promise((resolve) => (img.onload = resolve));

            // Get predictions from FashionMNIST model
            const imageArray = await imageToArray(img);
            const fashionPrediction = await makeFashionPrediction(imageArray);
            console.log('Fashion prediction:', fashionPrediction);
            // Convert to PredictionResult format
            const predictions: PredictionResult[] = [{
                className: fashionPrediction.className,
                probability: fashionPrediction.probability
            }];

            URL.revokeObjectURL(img.src);

            const { category, subtype } = determineClothingCategory(predictions);

            return { category, subtype };
        } catch (error) {
            console.error("Error classifying image:", error);
            return { category: "Unknown", subtype: "Unknown" };
        }
    };

    const imageToArray = async (img: HTMLImageElement): Promise<number[][]> => {
        const canvas = document.createElement('canvas');
        canvas.width = 28;
        canvas.height = 28;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Draw image in grayscale
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 28, 28);

        const scale = Math.min(28 / img.width, 28 / img.height);
        const x = (28 - img.width * scale) / 2;
        const y = (28 - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // Get image data
        const imageData = ctx.getImageData(0, 0, 28, 28).data;

        // Convert to grayscale and normalize to match training data
        const imageArray: number[][] = [];
        for (let i = 0; i < 28; i++) {
            imageArray[i] = [];
            for (let j = 0; j < 28; j++) {
                const pixel = (i * 28 + j) * 4;
                // Convert to grayscale and normalize to [0,1] range
                imageArray[i][j] = (imageData[pixel] + imageData[pixel + 1] + imageData[pixel + 2]) / (3 * 255);
            }
        }
        console.assert(imageArray.length === 28 && imageArray[0].length === 28, "Image array dimensions mismatch");

        return imageArray;
    };

    const determineClothingCategory = (predictions: PredictionResult[]): { category: string, subtype: string } => {
        let category = "Unknown";
        let subtype = "Unknown";

        for (const prediction of predictions) {
            const lowerCasePrediction = prediction.className.toLowerCase();

            for (const [, details] of Object.entries(CLOTHING_CATEGORIES)) {
                if (details.keywords.some(keyword =>
                    lowerCasePrediction.includes(keyword.toLowerCase())
                )) {
                    category = details.name;

                    subtype = lowerCasePrediction;
                    break;
                }
            }
            if (category !== "Unknown" && subtype !== "Unknown") break;
        }
        return { category, subtype };
    };

    const getDominantColorFromImage = async (file: File) => {
        try {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const tempImg = document.createElement('img');
                tempImg.crossOrigin = "Anonymous";

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const centerX = Math.floor(img.width / 4);
                const centerY = Math.floor(img.height / 4);
                const centerWidth = Math.floor(img.width / 2);
                const centerHeight = Math.floor(img.height / 2);

                const centerCanvas = document.createElement('canvas');
                centerCanvas.width = centerWidth;
                centerCanvas.height = centerHeight;
                const centerCtx = centerCanvas.getContext('2d');
                if (!centerCtx) return;

                centerCtx.drawImage(canvas,
                    centerX, centerY, centerWidth, centerHeight,
                    0, 0, centerWidth, centerHeight
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
                            setDominantColors(prevColors => [...prevColors, dominantColorHex]);
                            URL.revokeObjectURL(tempImg.src);
                        };
                    }
                }, 'image/png');
            };
        } catch (error) {
            console.error("Error getting dominant color:", error);
        }
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(prevImages => [...prevImages, ...newFiles]);

            for (const file of newFiles) {
                const { category, subtype } = await classifyImage(file);
                setClothingTypes(prevTypes => [...prevTypes, category]);
                setSubTypes(prevTypes => [...prevTypes, subtype]);
                await getDominantColorFromImage(file);
            }
        }
    };

    const handleUpload = async () => {
        if (!images.length || !user) {
            alert("You must be logged in and select at least one image to upload.");
            return;
        }

        try {
            for (let i = 0; i < images.length; i++) {
                const file = images[i];
                const storageRef = ref(storage, `clothes/${user.uid}/${file.name}`);
                await uploadBytes(storageRef, file);
                const imageUrl = await getDownloadURL(storageRef);

                await addDoc(collection(db, "clothes"), {
                    userId: user.uid,
                    imageUrl,
                    dominantColor: dominantColors[i],
                    clothingType: clothingTypes[i],
                    clothingSubtype: subTypes[i],
                    uploadedAt: new Date(),
                });
            }

            alert("Images uploaded successfully!");
            setImages([]);
            setDominantColors([]);
            setClothingTypes([]);
            setSubTypes([]);
            onNext();
        } catch (error) {
            console.error("Error uploading images:", error);
            alert("Error uploading images. Please try again.");
        }
    };

    return (
        <section id="upload" className="relative flex items-center justify-center md:w-10/12 mx-auto font-Josefin">
            <img src={Wardrobe} alt="wardrobe" className="w-full h-auto rounded-xl" />

            <div className="absolute inset-0 flex flex-col items-center justify-center md:mb-2">
                {isLoading ? (
                    <div className="text-gray-600">Loading model...</div>
                ) : (
                    <>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="hidden"
                            id="file-upload"
                            multiple
                            accept="image/*"
                        />

                        <label htmlFor="file-upload" className="cursor-pointer">
                            {images.length > 0 ? (
                                <div className={`grid ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 gap-4'}`}>
                                    {images.slice(-4).map((image, index) => (
                                        <div key={images.length > 4 ? index + (images.length - 4) : index} className="relative">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Uploaded file ${index + 1}`}
                                                className="lg:w-40 lg:h-40 max-lg:w-24 max-lg:h-24 object-contain p-2 rounded-lg border-2 border-gray-400"
                                            />
                                            {dominantColors[index] && (
                                                <div
                                                    className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-black bg-opacity-50 text-white p-1"
                                                >
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{backgroundColor: dominantColors[index]}}
                                                    />
                                                    <span className="text-xs">{clothingTypes[index]}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <FontAwesomeIcon icon={faShirt} className="text-gray-400" size="4x" />
                            )}
                        </label>

                        <div className="mt-2 text-sm text-gray-600">
                            {images.length} file(s) selected
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={!images.length}
                            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Upload
                        </button>
                    </>
                )}

                {hasClothes && (
                    <button
                        onClick={onNext}
                        className="mt-6 bg-primary/90 hover:bg-primary/95 text-white font-bold py-3 px-8 rounded"
                    >
                        Select Style Preferences
                    </button>
                )}
            </div>
        </section>
    );
};