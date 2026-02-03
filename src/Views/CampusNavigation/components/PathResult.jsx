const PathResult = ({ loading, path, error }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 w-3/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <span className="text-xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Unable to find path</h3>
            <p className="text-sm text-red-600 dark:text-red-400">No valid route could be calculated</p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          This might be because:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
          <li>• The locations are in disconnected buildings</li>
          <li>• There's construction blocking the route</li>
          <li>• Temporary accessibility restrictions</li>
        </ul>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="text-center py-8">
        <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
          <span className="text-3xl">🗺️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Ready for Navigation
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Select both starting point and destination to see the route
        </p>
      </div>
    );
  }

  // Parse path description into steps
  const steps = path.pathDescription
    .split('. ')
    .map(step => step.trim())
    .filter(step => step && step.length > 0);

  // Determine path type for styling
  const isSameBuilding = !path.pathDescription.includes("Exit the building");
  const isMultiBuilding = path.pathDescription.includes("Exit the building");

 return (
  <div className="space-y-6">

    {/* Route Summary */}
    <div className="rounded-2xl bg-primary/10 dark:bg-dark-primary/20 p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🧭</span>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Navigation Steps
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isSameBuilding ? "Same Building" : "Multiple Buildings"} • {steps.length} steps
          </p>
        </div>
      </div>
    </div>

    {/* Stepper */}
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
      <ol className="relative border-l border-gray-300 dark:border-gray-600 ml-4 space-y-6">

        {steps.map((step, index) => {
          let emoji = "🚶";
          let color = "bg-blue-500";

          const text = step.toLowerCase();

          if (text.includes("start")) {
            emoji = "📍";
            color = "bg-green-500";
          } else if (text.includes("stair") || text.includes("floor")) {
            emoji = "🪜";
            color = "bg-orange-500";
          } else if (text.includes("exit") || text.includes("enter") || text.includes("building")) {
            emoji = "🏢";
            color = "bg-purple-500";
          }

          return (
            <li key={index} className="ml-6">
              <span
                className={`absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full text-white ${color}`}
              >
                {emoji}
              </span>

              <div className="text-gray-800 dark:text-gray-200">
                <p className="font-medium">
                  Step {index + 1}
                </p>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                  {step.endsWith(".") ? step : `${step}.`}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>

    {/* Quick Info */}
    {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
        <span>🏢</span>
        <span className="text-gray-700 dark:text-gray-300">
          {isMultiBuilding ? "Multiple Buildings" : "Single Building"}
        </span>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
        <span>{path.usesStairs ? "🪜" : "📐"}</span>
        <span className="text-gray-700 dark:text-gray-300">
          {path.usesStairs ? "Stairs Required" : "Same Level"}
        </span>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
        <span>📏</span>
        <span className="text-gray-700 dark:text-gray-300">
          {path.distance > 0 ? `${path.distance.toFixed(1)} m` : "Distance N/A"}
        </span>
      </div>
    </div> */}

  </div>
);

};

export default PathResult;