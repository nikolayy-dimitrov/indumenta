import { faListUl, faTableCells, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { faShirt } from "@fortawesome/free-solid-svg-icons/faShirt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

import {ActiveCollection, OutfitFilter, SortOption, ViewMode} from "../types/wardrobe.ts";

interface WardrobeControlsProps {
    activeCollection: ActiveCollection;
    viewMode: ViewMode;
    sortBy: SortOption;
    outfitFilter: OutfitFilter;
    onToggleCollection: (mode: ActiveCollection) => void;
    onToggleView: (mode: ViewMode) => void;
    onSortChange?: (sort: SortOption) => void;
    onFilterChange?: (filter: OutfitFilter) => void;
}

export const WardrobeControls = ({
                                     activeCollection,
                                     viewMode,
                                     onToggleCollection,
                                     onToggleView
                                 }: WardrobeControlsProps) => {
    return (
        <div className="flex max-md:flex-col items-center justify-between gap-x-40 max-lg:gap-x-8 gap-y-1 mb-8">
            <h1 className="text-2xl font-bold lowercase tracking-wider text-primary">
                My Wardrobe
            </h1>

            {/* Toggles */}
            <div className="flex max-md:flex-col items-center gap-4">
                <div
                    className="relative w-16 h-8 bg-secondary border-2 border-primary/70 rounded-full flex items-center p-1 cursor-pointer max-md:my-2"
                    onClick={() => onToggleCollection(activeCollection === "clothes" ? "outfits" : "clothes")}
                >
                    <motion.div
                        className="absolute w-5 h-5 bg-primary/70 rounded-full shadow-sm"
                        layout
                        initial={{ x: activeCollection === "clothes" ? 2 : 30 }}
                        animate={{ x: activeCollection === "clothes" ? 2 : 30 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <div className="flex justify-between items-center h-full my-auto w-full px-2">
            <span
                className={`max-h-3 text-xs font-medium ${
                    activeCollection === "clothes" ? "text-secondary" : "text-primary"
                }`}
            >
              <FontAwesomeIcon icon={faShirt} />
            </span>
                        <span
                            className={`max-h-3 text-xs font-medium ${
                                activeCollection === "outfits" ? "text-secondary" : "text-primary"
                            }`}
                        >
              <FontAwesomeIcon icon={faUserTie} />
            </span>
                    </div>
                </div>

                <div className="flex items-center border border-primary/20 rounded-md">
                    <div
                        onClick={() => onToggleView("grid")}
                        className={`cursor-pointer h-10 w-10 items-center flex justify-center
              transition duration-200 hover:bg-primary/20 rounded-s-md
              ${viewMode === "grid" && "bg-primary/20"}`}
                    >
                        <FontAwesomeIcon icon={faTableCells} />
                    </div>
                    <div
                        onClick={() => onToggleView("list")}
                        className={`cursor-pointer h-10 w-10 items-center flex justify-center
              transition duration-200 hover:bg-primary/20 rounded-e-md
              ${viewMode === "list" && "bg-primary/20"}`}
                    >
                        <FontAwesomeIcon icon={faListUl} />
                    </div>
                </div>
            </div>

            {/* Sort/Filter options - Commented out for now as in original code */}
            {/*<div className="flex items-center gap-4">*/}
            {/*    <label htmlFor={activeCollection === "clothes" ? "sort" : "filter"}>*/}
            {/*        {activeCollection === "clothes" ? "Sort by:" : "Filter:"}*/}
            {/*    </label>*/}
            {/*    {activeCollection === "clothes" ? (*/}
            {/*        <select*/}
            {/*            id="sort"*/}
            {/*            value={sortBy}*/}
            {/*            onChange={(e) => setSortBy(e.target.value as SortOption)}*/}
            {/*            className="border rounded-md px-2 w-[150px] py-1 text-secondary"*/}
            {/*        >*/}
            {/*            <option value="newest">Newest First</option>*/}
            {/*            <option value="oldest">Oldest First</option>*/}
            {/*            <option value="color">Color</option>*/}
            {/*        </select>*/}
            {/*    ) : (*/}
            {/*        <select*/}
            {/*            id="filter"*/}
            {/*            value={outfitFilter}*/}
            {/*            onChange={(e) => setOutfitFilter(e.target.value as OutfitFilter)}*/}
            {/*            className="border rounded-md px-2 w-[150px] py-1 text-secondary"*/}
            {/*        >*/}
            {/*            <option value="owned">Owned</option>*/}
            {/*            <option value="saved">Saved</option>*/}
            {/*        </select>*/}
            {/*    )}*/}
            {/*</div>*/}
        </div>
    );
};