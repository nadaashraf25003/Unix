import useSections from "@/Hooks/useSections";

const SectionSelector = ({ onSelect }) => {
  const { sectionsQuery } = useSections();
  const { data: sections, isLoading, isError } = sectionsQuery;

  if (isLoading) return <p>Loading sections...</p>;
  if (isError) return <p>Failed to load sections</p>;

  return (
    <div>
      <h2>Select Section</h2>

      <select defaultValue="" onChange={(e) => onSelect(Number(e.target.value))}>
        <option value="">-- Select Section --</option>

        {sections?.map((section) => (
          <option key={section.id} value={section.id}>
            {section.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SectionSelector;
