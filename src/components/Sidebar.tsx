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
    <div className="w-20 h-[100vh] bg-green-600 border-r border-green-700 p-4 fixed top-16 left-0 z-50">
      <div
        ref={dragRef}
        className={`p-4 rounded-md cursor-grab shadow-md ${
          isDragging ? "opacity-40 " : "opacity-100"
        } text-center text-white`}
      >
        <StickyNote />
      </div>
    </div>
  );
};

export default Sidebar;
