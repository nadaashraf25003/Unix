import { useState } from "react";
import useCampus from "@/Hooks/useCampus";
import { FaDoorClosed, FaChevronDown, FaSpinner } from "react-icons/fa6";
const RoomSelector = ({ buildingId, onSelect, placeholder = "Select Room..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { roomsByBuildingQuery } = useCampus();
  const { data: rooms, isLoading, isError } = roomsByBuildingQuery(buildingId);

  const handleSelect = (room) => {
    setSelectedRoom(room);
    onSelect(room);
    setIsOpen(false);
    setSearchTerm("");
  };

  const filteredRooms = rooms?.filter(room =>
    room.roomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.roomType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Rooms for building", buildingId, rooms);
  if (isError) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
        Failed to load rooms. Please try again.
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Select Trigger */}
      <button
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-left hover:border-primary dark:hover:border-dark-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          {isLoading ? (
            <FaSpinner className="text-gray-400 dark:text-gray-500 animate-spin" />
          ) : (
            <FaDoorClosed className="text-gray-400 dark:text-gray-500" />
          )}
          <span className={selectedRoom ? "text-gray-800 dark:text-white" : "text-gray-400 dark:text-gray-500"}>
            {isLoading ? 'Loading rooms...' : selectedRoom ? `${selectedRoom.roomCode} – ${selectedRoom.roomType}` : placeholder}
          </span>
        </div>
        {!isLoading && (
          <FaChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && !isLoading && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-card dark:shadow-card-dark overflow-hidden animate-slideDown">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search rooms by code or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
              autoFocus
            />
          </div>

          {/* Rooms List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredRooms?.length > 0 ? (
              filteredRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleSelect(room)}
                  className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedRoom?.id === room.id ? 'bg-primary/10 dark:bg-dark-primary/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {room.roomCode}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {room.roomType} • Floor {room.floor.floorNumber}
                      </div>
                    </div>
                    {selectedRoom?.id === room.id && (
                      <span className="text-primary dark:text-dark-primary text-sm font-medium ml-4">
                        ✓ Selected
                      </span>
                    )}
                  </div>
                  {room.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                      {room.description}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {rooms?.length === 0 ? 'No rooms available in this building' : 'No matching rooms found'}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
            <span>{filteredRooms?.length || 0} room(s) found</span>
            {rooms && rooms.length > 0 && (
              <span className="text-primary dark:text-dark-primary">
                {rooms.length} total rooms
              </span>
            )}
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

export default RoomSelector;