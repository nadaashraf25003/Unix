const BuildingSelector = ({ buildings, onSelect }) => {
  return (
    <select onChange={(e) => onSelect(buildings.find(b => b.id == e.target.value))}>
      <option value="">Select Building</option>
      {buildings?.map(b => (
        <option key={b.id} value={b.id}>
          {b.name}
        </option>
      ))}
    </select>
  );
};

export default BuildingSelector;
