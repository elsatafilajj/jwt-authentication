import { useRef } from "react";
import { useDrag } from "react-dnd";
import { StickyNote } from "lucide-react";

const Sidebar = () => {
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "NEW_NOTE",
    item: { type: "NEW_NOTE" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(dragRef);

  return (
    <div
      style={{
        width: "80px",
        height: "400px",
        background: "#f3f3f3",
        borderRight: "1px solid #ccc",
        padding: "10px",
        position: "absolute",
        left: 0,
        // top: 150,
        bottom: 0,
        zIndex: 999,
      }}
    >
      <div
        ref={dragRef}
        style={{
          background: "#5CE65C",
          padding: "10px",
          borderRadius: "5px",
          cursor: "grab",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          opacity: isDragging ? 0.4 : 1,
          textAlign: "center",
          objectFit: "contain",
        }}
      >
        <div>
          {" "}
          <StickyNote />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
