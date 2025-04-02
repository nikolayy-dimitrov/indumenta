export interface RekognitionResponse {
    success: boolean;
    category: string;
    subCategory: string | null;
    vibe: string;
    season: string;
    color: string;
    allLabels: string[];
}

/**
 * Analyze an image using AWS Rekognition via the backend.
 * @param apiUrl - The URL of the API endpoint.
 * @param file - The image file to analyze.
 * @returns Analysis results or throws an error.
 */
export const analyzeImageWithRekognition = async (
    apiUrl: string,
    file: File
): Promise<RekognitionResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};