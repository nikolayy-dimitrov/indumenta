export interface PredictionResponse {
    category: string | null;
    vibe: string | null;
    season: string | null;
}

/**
 * Fetch predictions from the Dragoneye API.
 * @param apiUrl - The URL of the API endpoint.
 * @param fileUrl - The Firebase storage file URL to process.
 * @param modelName - The Dragoneye model name to use.
 * @returns An array of prediction results or throws an error.
 */
export const fetchPredictionData = async (
    apiUrl: string,
    fileUrl: string,
    modelName: string
): Promise<PredictionResponse[]> => {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl, modelName }),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};
