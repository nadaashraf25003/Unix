const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => setActiveTab("schedule")}
        style={{ fontWeight: activeTab === "schedule" ? "bold" : "normal" }}
      >
        Schedule
      </button>

      <button
        onClick={() => setActiveTab("exams")}
        style={{ fontWeight: activeTab === "exams" ? "bold" : "normal" }}
      >
        Exams
      </button>
    </div>
  );
};

export default Tabs;
