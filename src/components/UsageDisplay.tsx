import { useFetchUsageData } from "../hooks/useFetchUsageData.ts";
import {CircleMeter} from "./CircleProgressMeter.tsx";

export const UsageDisplay = () => {
    const { usageStats, loading, error } = useFetchUsageData();

    if (loading) {
        return (
            <section id="usage-status-indicator" className="p-6 rounded-lg shadow-sm">
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t border-primary"></div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="usage-status-indicator" className="p-6 rounded-lg shadow-sm">
                <div className="text-red-600 text-center">
                    <h3 className="font-semibold mb-2">Error Loading Usage Data</h3>
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    if (!usageStats) {
        return (
            <section id="usage-status-indicator" className="p-6 rounded-lg shadow-sm">
                <div className="text-primary-blue text-center">
                    <p>No usage data available</p>
                </div>
            </section>
        );
    }

    return (
        <section id="usage-status-indicator">
            <div className="flex flex-col justify-center items-center">
                <span className="font-medium capitalize bg-primary text-secondary px-3 py-1 rounded-lg">
                    {usageStats.subscriptionTier}
                </span>
                <p className="flex justify-between items-center text-sm mt-4">
                    <span className="text-gray-600">Resets on:&nbsp;</span>
                    <span className="font-medium">{usageStats.resetsOn}</span>
                </p>
            </div>

            <div className="flex max-md:flex-col gap-6 items-center justify-center py-4">
                {/* Image Uploads Meter */}
                <CircleMeter
                    used={usageStats.imageUploads.used}
                    total={usageStats.imageUploads.total}
                    title='Clothes'
                />

                {/* Outfit Generations Meter */}
                <CircleMeter
                    used={usageStats.outfitGenerations.used}
                    total={usageStats.outfitGenerations.total}
                    title='Outfits'
                />
            </div>

            {usageStats.subscriptionTier === 'free' && (
                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-600">
                        Need more generations?{' '}
                        <a href="/pricing" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                            Upgrade your plan
                        </a>
                    </p>
                </div>
            )}
        </section>
    );
};