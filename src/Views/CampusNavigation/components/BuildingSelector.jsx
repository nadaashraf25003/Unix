import { useState } from "react";
import { FaBuilding, FaChevronDown } from "react-icons/fa6";
const BuildingSelector = ({ buildings, onSelect, placeholder = "Select Building..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (building) => {
    setSelectedBuilding(building);
    onSelect(building);
    setIsOpen(false);
    setSearchTerm("");
  };

  const filteredBuildings = buildings?.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div className="relative w-full">
      {/* Select Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-left hover:border-primary dark:hover:border-dark-primary transition-colors"
      >
        <div className="flex items-center gap-3">
          <FaBuilding className="text-gray-400 dark:text-gray-500" />
          <span className={selectedBuilding ? "text-gray-800 dark:text-white" : "text-gray-400 dark:text-gray-500"}>
            {selectedBuilding?.name || placeholder}
          </span>
        </div>
        <FaChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-card dark:shadow-card-dark overflow-hidden animate-slideDown">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search buildings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
              autoFocus
            />
          </div>

          {/* Buildings List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredBuildings?.length > 0 ? (
              filteredBuildings.map((building) => (
                <button
                  key={building.id}
                  onClick={() => handleSelect(building)}
                  className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                    selectedBuilding?.id === building.id ? 'bg-primary/10 dark:bg-dark-primary/20' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 dark:text-white">
                      {building.name}
                    </div>
                    {building.code && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Code: {building.code}
                      </div>
                    )}
                  </div>
                  {selectedBuilding?.id === building.id && (
                    <span className="text-primary dark:text-dark-primary text-sm font-medium">
                      ✓ Selected
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {buildings?.length === 0 ? 'No buildings available' : 'No matching buildings found'}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            {filteredBuildings?.length || 0} building(s) found
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default BuildingSelector;