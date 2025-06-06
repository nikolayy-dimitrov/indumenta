import { auth } from "../config/firebaseConfig.ts";

interface RekognitionResponse {
    category: string;
    subCategory: string | null;
    vibe: string;
    season: string;
    color: string;
    allLabels: string[];
    confidence: {
        category: number;
        subCategory: number | null;
        vibe: number;
        season: number;
        color: number;
    };
}

/**
 * Analyze an image using AWS Rekognition via the backend.
 * @param apiUrl - The URL of the API endpoint.
 * @param file - The image file to analyze.
 * @returns Analysis results or throws an error.
 */
export const analyzeImageWithRekognition = async (
    apiUrl: string,
    file: File,
): Promise<RekognitionResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const user = auth.currentUser;

    const token = await user?.getIdToken();

    const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};