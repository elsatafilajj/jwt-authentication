import { useRef, useState } from "react";

const StickyNotes = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    setScale((prev) => Math.max(0.1, prev - e.deltaY * zoomSpeed));
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-gray-200"
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div
        className="w-full h-full"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "top left",
          width: "5000px",
          height: "5000px",
        }}
      >
        {/* Example content */}
        <div className="w-40 h-40 bg-green-500 absolute top-0 left-0">Box</div>
        <div className="w-40 h-40 bg-blue-500 absolute top-[300px] left-[500px]">
          Another Box
        </div>
      </div>
    </div>
  );
};

export default StickyNotes;
