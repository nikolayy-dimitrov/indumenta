import React, { useState } from 'react';
import { fetchPredictionData, PredictionResponse } from '../utils/dragoneyeUtils.ts';

const DragoneyeAPIRequest: React.FC = () => {
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchPrediction = async () => {
        const apiUrl = import.meta.env.VITE_BACKEND_URL + "/api/predict";
        const fileUrl =
            'https://firebasestorage.googleapis.com/v0/b/indumenta-be.firebasestorage.app/o/clothes%2FFbAZdeZo0jWaC74xgzKKfIfwmcY2%2F47SMA0060_5T9_01.jpeg?alt=media&token=2e8571dd-d4ff-4b7a-9762-45758abb41e7';
        const modelName = 'dragoneye/fashion';

        try {
            const data: PredictionResponse[] = await fetchPredictionData(apiUrl, fileUrl, modelName);
            setResult(JSON.stringify(data, null, 2));
            setError(null);
        } catch (err) {
            setResult(null);
            setError((err as Error).message);
        }
    };

    return (
        <div className="dragoneye-api-request">
            <h2>Dragoneye API Prediction</h2>
            <button
                className="fetch-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={fetchPrediction}
            >
                Fetch Prediction
            </button>
            {result && (
                <div className="result mt-4">
                    <h3>Result:</h3>
                    <pre className="bg-gray-100 p-4 rounded">{result}</pre>
                </div>
            )}
            {error && (
                <div className="error mt-4 text-red-500">
                    <h3>Error:</h3>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default DragoneyeAPIRequest;
