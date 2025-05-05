import { useCallback, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl, faSearch, faTableCells } from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../context/AuthContext";
import { OutfitItem, ShowMode, ViewMode } from "../types/wardrobe.ts";
import { useOutfits, useTrendingOutfits } from "../hooks/useWardrobe.ts";
import { useEscapeKey } from "../hooks/useEscapeKey.ts";
import { LoadingIndicator } from "../components/UI/LoadingIndicator.tsx";
import { OutfitModal } from "../components/UI/OutfitModal.tsx";
import { OutfitsGrid } from "../components/OutfitsGrid.tsx";

export const ShowroomPage = () => {
    const { user } = useContext(AuthContext);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [showMode, setShowMode] = useState<ShowMode>("trending");
    const [selectedOutfit, setSelectedOutfit] = useState<OutfitItem | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Get trending outfits
    const { trendingOutfits, isLoading: isTrendingLoading } = useTrendingOutfits(12);
    // Get community outfits (all outfits)
    const { outfits: communityOutfits, isLoading: isCommunityLoading } = useOutfits(undefined, "all");

    const isOwner = user?.uid === selectedOutfit?.userId;

    // Reset state on escape key
    const handleResetStates = useCallback(() => {
        setSelectedOutfit(null);
    }, []);

    useEscapeKey(handleResetStates);

    // Handler for toggling view mode
    const handleToggleView = (mode: ViewMode) => {
        setViewMode(mode);
    };

    // Handler for selecting an outfit
    const handleSelectOutfit = (outfit: OutfitItem) => {
        setSelectedOutfit(outfit);
    };

    // Filter outfits based on search query
    const filteredOutfits = (outfits: OutfitItem[]) => {
        if (!searchQuery.trim()) return outfits;

        return outfits.filter(outfit =>
            outfit.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            outfit.stylePreferences?.occasion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            outfit.stylePreferences?.color?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // Get the outfits to display based on show mode
    const displayOutfits = () => {
        switch (showMode) {
            case "trending":
                return filteredOutfits(trendingOutfits);
            case "community":
                return filteredOutfits(communityOutfits);
            case "following":
                // placeholder
                return filteredOutfits(communityOutfits.slice(0, 5));
            default:
                return [];
        }
    };

    const outfits = displayOutfits();

    if (isTrendingLoading || isCommunityLoading) {
        return <LoadingIndicator />;
    }

    return (
        <section className="w-11/12 mx-auto px-6 py-8 font-Josefin">
            {/* Page Title */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">Style Showroom</h1>
                <p className="text-gray-600 mt-2">
                    Discover trending outfits and get inspired by the community's style creations
                </p>
            </div>

            {/* View Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowMode("trending")}
                        className={`px-4 py-2 rounded-md ${
                            showMode === "trending"
                                ? "bg-primary text-secondary"
                                : "border border-primary/40 bg-black/20 hover:bg-black/10 text-primary"
                        }`}
                    >
                        Trending
                    </button>
                    <button
                        onClick={() => setShowMode("community")}
                        className={`px-4 py-2 rounded-md ${
                            showMode === "community"
                                ? "bg-primary text-secondary"
                                : "border border-primary/40 bg-black/20 hover:bg-black/10 text-primary"
                        }`}
                    >
                        Community
                    </button>
                    {/* TODO: Properly implement a follow functionality */}
                    {/*<button*/}
                    {/*    onClick={() => setShowMode("following")}*/}
                    {/*    className={`px-4 py-2 rounded-md transition-colors duration-200 ${*/}
                    {/*        showMode === "following"*/}
                    {/*            ? "bg-primary text-secondary"*/}
                    {/*            : "border border-primary/40 bg-black/20 hover:bg-black/10 text-primary"*/}
                    {/*    }`}*/}
                    {/*>*/}
                    {/*    Following*/}
                    {/*</button>*/}
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/70"
                        />
                        <input
                            type="text"
                            placeholder="Search outfits..."
                            className="pl-10 pr-4 py-2
                            border border-primary/20 bg-secondary placeholder:text-primary/70 rounded-md w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center border border-primary/20 rounded-md">
                        <div
                            onClick={() => handleToggleView("grid")}
                            className={`cursor-pointer h-10 w-10 items-center flex justify-center
                                  transition duration-200 hover:bg-primary/20 rounded-s-md
                                  ${viewMode === "grid" && "bg-primary/20"}`}
                        >
                            <FontAwesomeIcon icon={faTableCells}/>
                        </div>
                        <div
                            onClick={() => handleToggleView("list")}
                            className={`cursor-pointer h-10 w-10 items-center flex justify-center
                                  transition duration-200 hover:bg-primary/20 rounded-e-md
                                  ${viewMode === "list" && "bg-primary/20"}`}
                        >
                            <FontAwesomeIcon icon={faListUl}/>
                        </div>
                    </div>
                </div>
            </div>

            <OutfitsGrid
                outfits={outfits}
                viewMode={viewMode}
                outfitFilter={'all'}
                setOutfits={displayOutfits}
                onSelectOutfit={handleSelectOutfit}
            />

            {/* Empty state */}
            {displayOutfits().length === 0 && (
                <div className="flex justify-center items-center text-center h-[500px] font-Josefin">
                    <p className="text-primary/90">
                        No outfits found. <br />
                        {searchQuery ? (
                            "Try adjusting your search criteria."
                        ) : (
                            <Link to="/stylist" className="font-semibold">
                                Start by creating an outfit!
                            </Link>
                        )}
                    </p>
                </div>
            )}

            {/* Outfit Modal */}
            {selectedOutfit && (
                <OutfitModal
                    outfit={selectedOutfit}
                    onClose={() => setSelectedOutfit(null)}
                    isOwner={isOwner}
                    onDelete={() => {}}
                />
            )}
        </section>
    );
};