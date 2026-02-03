import useCampus from "@/hooks/useCampus";

const RoomSelector = ({ buildingId, onSelect }) => {
  const { roomsByBuildingQuery } = useCampus();
  const { data: rooms, isLoading } = roomsByBuildingQuery(buildingId);

  if (isLoading) return <p>Loading rooms...</p>;

  return (
    <select onChange={(e) => onSelect(rooms.find(r => r.id == e.target.value))}>
      <option value="">Select Room</option>
      {rooms?.map(r => (
        <option key={r.id} value={r.id}>
          {r.roomCode} – {r.roomType}
        </option>
      ))}
    </select>
  );
};

export default RoomSelector;
