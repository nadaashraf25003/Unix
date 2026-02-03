import { useState, useEffect } from "react";
import useCampus from "@/Hooks/useCampus";
import useRoomNavigation from "@/Hooks/useRoomNavigation";
import BuildingSelector from "../components/BuildingSelector";
import RoomSelector from "../components/RoomSelector";
import PathResult from "../components/PathResult";

const CampusNavigation = () => {
  const { buildingsQuery } = useCampus();
  const { generatePathMutation } = useRoomNavigation();

  const [fromBuilding, setFromBuilding] = useState(null);
  const [toBuilding, setToBuilding] = useState(null);
  const [fromRoom, setFromRoom] = useState(null);
  const [toRoom, setToRoom] = useState(null);

  // Generate path automatically when rooms are selected
  useEffect(() => {
    if (fromRoom?.id && toRoom?.id) {
      generatePathMutation.mutate({
        fromRoomId: fromRoom.id,
        toRoomId: toRoom.id,
      });
    }
  }, [fromRoom, toRoom]);

  return (
    <div className="campus-nav">
      <h1>🧭 Campus Navigation</h1>
      <p>Choose your current location and destination</p>

      {/* FROM */}
      <div className="nav-section">
        <h3>📍 From</h3>
        <BuildingSelector
          buildings={buildingsQuery.data}
          onSelect={setFromBuilding}
        />
        {fromBuilding && (
          <RoomSelector
            buildingId={fromBuilding.id}
            onSelect={setFromRoom}
          />
        )}
      </div>

      {/* TO */}
      <div className="nav-section">
        <h3>🎯 To</h3>
        <BuildingSelector
          buildings={buildingsQuery.data}
          onSelect={setToBuilding}
        />
        {toBuilding && (
          <RoomSelector
            buildingId={toBuilding.id}
            onSelect={setToRoom}
          />
        )}
      </div>

      {/* RESULT */}
      <PathResult
        loading={generatePathMutation.isLoading}
        path={generatePathMutation.data}
        error={generatePathMutation.isError}
      />
    </div>
  );
};

export default CampusNavigation;
