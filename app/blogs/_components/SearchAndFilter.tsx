import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
  sortBy: "recent" | "popular";
  onSortChange: (sort: "recent" | "popular") => void;
  handleSubmit : (event : React.FormEvent) => void
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagToggle,
  availableTags,
  sortBy,
  onSortChange,
  handleSubmit
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4 w-full">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative border flex overflow-hidden border-border-secondary rounded-md">
        <button type="submit" className="hover:bg-card w-16 flex items-center justify-center">
          <Search className="w-5 h-5 text-subtext" />
        </button>
        <input
          type="text"
          placeholder="Search blogs by title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full border-none p-2 outline-none text-black bg-transparent"
        />
      </form>

      {/* Filter Controls */}
      <div className="flex flex-col w-full sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center max-w-[calc(100%_-160px)] space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-card-bg border border-border-secondary rounded-md hover:bg-card transition-colors"
          >
            <Filter className="w-4 h-4 text-black" />
            <span className="text-black">Filters</span>
            {selectedTags.length > 0 && (
              <span className="bg-card text-black text-xs size-5 flex items-center justify-center rounded-full">
                {selectedTags.length}
              </span>
            )}
          </button>

          {selectedTags.length > 0 && (
            <div className="flex flex-nowrap overflow-x-scroll scrollbar-hidden gap-2">
              {selectedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className="flex whitespace-nowrap flex-nowrap items-center space-x-1 bg-accent text-black px-3 py-1 rounded-full text-sm hover:bg-accent/80 transition-colors"
                >
                  <span>{tag}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="flex bg-gray-200 border border-border rounded-md">
            <button
              onClick={() => onSortChange("recent")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                sortBy === "recent"
                  ? "bg-card text-black"
                  : "text-subtext hover:text-black"
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => onSortChange("popular")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                sortBy === "popular"
                  ? "bg-card text-black"
                  : "text-subtext hover:text-black"
              }`}
            >
              Popular
            </button>
          </div>
        </div>
      </div>

      {/* Tag Filters */}
      {showFilters && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-black mb-3">
            Filter by tags:
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-card border bg-gray-200 text-black"
                    : "bg-bg text-subtext border border-border-secondary hover:bg-card hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
