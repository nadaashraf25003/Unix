import { useState, useEffect } from "react";
import useCampus from "@/Hooks/useCampus";
import useRoomNavigation from "@/Hooks/useRoomNavigation";
import BuildingSelector from "../components/BuildingSelector";
import RoomSelector from "../components/RoomSelector";
import PathResult from "../components/PathResult";
// import { FaMapMarkedAlt, FaExchangeAlt, FaWalking } from "react-icons/fa6";

const CampusNavigation = () => {
  const { buildingsQuery } = useCampus();
  const { generatePathMutation } = useRoomNavigation();

  const [fromBuilding, setFromBuilding] = useState(null);
  const [toBuilding, setToBuilding] = useState(null);
  const [fromRoom, setFromRoom] = useState(null);
  const [toRoom, setToRoom] = useState(null);
  const [swapLocations, setSwapLocations] = useState(false);

  // Handle location swap
  const handleSwap = () => {
    setSwapLocations(!swapLocations);
    const tempBuilding = fromBuilding;
    const tempRoom = fromRoom;
    setFromBuilding(toBuilding);
    setFromRoom(toRoom);
    setToBuilding(tempBuilding);
    setToRoom(tempRoom);
  };

  // Generate path automatically when rooms are selected
  useEffect(() => {
    if (fromRoom?.id && toRoom?.id) {
      generatePathMutation.mutate({
        fromRoomId: fromRoom.id,
        toRoomId: toRoom.id,
      });
    }
  }, [fromRoom, toRoom]);

  console.log("From:", fromBuilding, fromRoom);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            {/* <div className="p-3 bg-primary/10 dark:bg-dark-primary/20 rounded-2xl">
              <FaMapMarkedAlt className="text-3xl text-primary dark:text-dark-primary" />
            </div> */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Campus Navigation
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto md:mx-0">
            Select
            your starting point and destination below.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selection Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Card */}
              <div className="card animate-slideDown">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Starting Point
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Where you are now
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Building
                    </label>
                    <BuildingSelector
                      buildings={buildingsQuery.data}
                      onSelect={setFromBuilding}
                      placeholder="Choose starting building..."
                    />
                  </div>

                  {fromBuilding && (
                    <div className="animate-slideDown">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Room
                      </label>
                      <RoomSelector
                        buildingId={fromBuilding.id}
                        onSelect={setFromRoom}
                        placeholder="Choose room..."
                      />
                      {fromRoom && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Selected:{" "}
                            <span className="font-semibold">
                              {fromRoom.roomCode}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* To Card */}
              <div className="card animate-slideDown">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Destination
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Where you want to go
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Building
                    </label>
                    <BuildingSelector
                      buildings={buildingsQuery.data}
                      onSelect={setToBuilding}
                      placeholder="Choose destination building..."
                    />
                  </div>

                  {toBuilding && (
                    <div className="animate-slideDown">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Room
                      </label>
                      <RoomSelector
                        buildingId={toBuilding.id}
                        onSelect={setToRoom}
                        placeholder="Choose room..."
                      />
                      {toRoom && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Selected:{" "}
                            <span className="font-semibold">{toRoom.roomCode}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Swap Button */}
            {/* <div className="flex justify-center">
              <button
                onClick={handleSwap}
                className="btn-secondary flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:scale-105"
                disabled={!fromBuilding || !toBuilding}
              >
                <FaExchangeAlt />
                Swap Locations
              </button>
            </div> */}

            {/* Path Result Section */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                {/* <div className="p-2 bg-primary/10 dark:bg-dark-primary/20 rounded-xl">
                  <FaWalking className="text-xl text-primary dark:text-dark-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Navigation Path
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {fromRoom && toRoom
                      ? `Route from ${fromRoom.name} to ${toRoom.name}`
                      : "Select both locations to see the route"}
                  </p>
                </div> */}
              </div>

              <PathResult
                loading={generatePathMutation.isLoading}
                path={generatePathMutation.data}
                error={generatePathMutation.isError}
              />
            </div>
          </div>

          {/* Side Panel - Stats & Tips */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Navigation Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-300">
                    Buildings Available
                  </span>
                  <span className="font-bold text-primary dark:text-dark-primary">
                    {buildingsQuery.data?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-300">
                    Path Generated
                  </span>
                  <span className="font-bold text-success dark:text-dark-success">
                    {generatePathMutation.data ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-300">
                    Current Status
                  </span>
                  <span
                    className={`font-bold ${generatePathMutation.isLoading ? "text-warning dark:text-dark-warning" : "text-success dark:text-dark-success"}`}
                  >
                    {generatePathMutation.isLoading
                      ? "Calculating..."
                      : "Ready"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                💡 Quick Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-success dark:text-dark-success">✓</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Select buildings first, then choose specific rooms
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success dark:text-dark-success">✓</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Use the swap button to reverse your route
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success dark:text-dark-success">✓</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Paths are generated automatically when both rooms are
                    selected
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success dark:text-dark-success">✓</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Click on path steps for detailed instructions
                  </span>
                </li>
              </ul>
            </div>

            {/* Recent Searches (Optional - can be implemented later) */}
            {/* <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                🔍 Recent Searches
              </h3>
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Your recent searches will appear here
                </p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help finding a specific location? Contact campus support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampusNavigation;
