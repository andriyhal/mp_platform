import { useState } from "react";
import { Slider } from "@mui/material";

const FilterSidebar = () => {
    const [selectedTags, setSelectedTags] = useState(["Heart health", "Metabolic support"]);
    const [selectedTypes, setSelectedTypes] = useState(["Supplements"]);
    const [priceRange, setPriceRange] = useState([0, 100]);

    const tags = [
        { label: "Heart health", color: "bg-purple-100 text-purple-600" },
        { label: "Metabolic support", color: "bg-blue-100 text-blue-600" },
        { label: "Bones support", color: "bg-yellow-100 text-yellow-600" },
        { label: "Mental Support", color: "bg-pink-100 text-pink-600" },
        { label: "General support", color: "bg-green-100 text-green-600" },
        { label: "Women health", color: "bg-red-100 text-red-600" },
        { label: "Weight loss", color: "bg-blue-100 text-blue-600" },
    ];

    const types = [
        "Medications", "Devices", "Supplements", "Accesories", "Cosmetics", "Vitamins", "Equipment", "Special clothing"
    ];

    return (
        <div className="w-100 p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="font-semibold text-lg">Filters</h3>
            <p className="text-sm text-gray-500">Apply filters to table data.</p>

            {/* Tags Section */}
            <div className="mt-4">
                <h4 className="font-medium text-sm">Tags</h4>
                {tags.map((tag) => (
                    <div key={tag.label} className="flex items-center space-x-2 my-1">
                        <input
                            type="checkbox"
                            checked={selectedTags.includes(tag.label)}
                            onChange={() =>
                                setSelectedTags((prev) =>
                                    prev.includes(tag.label)
                                        ? prev.filter((t) => t !== tag.label)
                                        : [...prev, tag.label]
                                )
                            }
                        />
                        <span className={`px-2 py-1 text-xs rounded-full ${tag.color} border`}>{tag.label}</span>
                    </div>
                ))}
            </div>

            {/* Type Section */}
            <div className="mt-4">
                <h4 className="font-medium text-sm">Type</h4>
                {types.map((type) => (
                    <div key={type} className="flex items-center space-x-2 my-1">
                        <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() =>
                                setSelectedTypes((prev) =>
                                    prev.includes(type)
                                        ? prev.filter((t) => t !== type)
                                        : [...prev, type]
                                )
                            }
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                    </div>
                ))}
            </div>

            {/* Price Slider */}
            <div className="mt-4">
                <h4 className="font-medium text-sm">Price</h4>
                <Slider
                    value={priceRange}
                    onChange={(_: Event, newValue: number[]) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={200}
                    className="mt-2"
                />
            </div>
        </div>
    );
};

export default FilterSidebar;
