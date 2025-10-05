export default function Card({ title, description }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        margin: "10px",
        borderRadius: "8px",
        transition: "transform 0.2s",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
