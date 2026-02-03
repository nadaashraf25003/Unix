const PathResult = ({ loading, path, error }) => {
  if (loading) return <p>🔄 Calculating path...</p>;
  if (error) return <p>❌ No path found</p>;
  if (!path) return null;

  const steps = path.pathDescription
    .split('. ')
    .map(step => step.trim())
    .filter(step => step);

  return (
    <div className="path-result p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-semibold mb-3">🧭 Directions</h3>

      <ol className="list-decimal list-inside mb-3">
        {steps.map((step, index) => (
          <li key={index} className="mb-1 text-gray-800">
            {step
              // Highlight room codes (e.g., L1-1, R2-5)
              .replace(/\b([LR]\d+-\d+)\b/g, (match) => (
                <span className="font-bold text-blue-600">{match}</span>
              ))
            }
            {step.endsWith('.') ? '' : '.'}
          </li>
        ))}
      </ol>

      {path.usesStairs && (
        <p className="text-yellow-700 font-medium mb-2">
          ⚠️ This path uses stairs. Please be careful!
        </p>
      )}

      {path.distance && (
        <p className="text-gray-600 font-medium">
          📏 Estimated distance: {path.distance.toFixed(1)} meters
        </p>
      )}
    </div>
  );
};

export default PathResult;
