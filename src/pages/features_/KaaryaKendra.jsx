/* eslint-disable no-undef */
 
 
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import {
  FaRegSquare,
  FaCircle,
  FaPen,
  FaTextHeight,
  FaEraser,
  FaUndo,
  FaRedo,
  FaDownload,
  FaTrash,
  FaSave,
  FaGripLines,
  FaArrowRight,
  FaShareAlt,
} from "react-icons/fa";

const TOOLS = {
  RECTANGLE: "Rectangle",
  CIRCLE: "Circle",
  PEN: "Pen",
  TEXT: "Text",
  SELECT: "Select",
  ERASER: "Eraser",
  ARROW: "Arrow",
  CURVED_ARROW: "CurvedArrow",
};

const KaaryaKendra = () => {
  const canvasRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [tool, setTool] = useState(TOOLS.RECTANGLE);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [selectedElementIndex, setSelectedElementIndex] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [textInputVisible, setTextInputVisible] = useState(false);
  const [textInputPos, setTextInputPos] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [showGrid, setShowGrid] = useState(false);
  const [fontSize, setFontSize] = useState(20);

  // Redraw canvas when elements or grid toggle changes
  useEffect(() => {
    redraw();
  }, [elements, showGrid]);

  // Setup canvas size and scaling for high DPI screens
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = (window.innerHeight - 150) * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = (window.innerHeight - 150) + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const handleResize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = (window.innerHeight - 150) * devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = (window.innerHeight - 150) + "px";
      const ctx = canvas.getContext("2d");
      ctx.scale(devicePixelRatio, devicePixelRatio);
      redraw();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const isInsideElement = (el, pos) => {
    if (el.tool === TOOLS.TEXT) {
      return (
        pos.x >= el.x &&
        pos.x <= el.x + (el.text.length * (el.fontSize || 20) * 0.6) &&
        pos.y >= el.y - (el.fontSize || 20) &&
        pos.y <= el.y
      );
    }
    const { x, y, endX, endY } = el;
    const minX = Math.min(x, endX);
    const maxX = Math.max(x, endX);
    const minY = Math.min(y, endY);
    const maxY = Math.max(y, endY);
    return pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY;
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);

    if (tool === TOOLS.SELECT) {
      for (let i = elements.length - 1; i >= 0; i--) {
        if (isInsideElement(elements[i], pos)) {
          setSelectedElementIndex(i);
          setStartPos(pos);
          setDrawing(true);
          return;
        }
      }
      setSelectedElementIndex(null);
      return;
    }

    setStartPos(pos);
    setDrawing(true);
    setRedoStack([]);

    if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
      setElements((prev) => [
        ...prev,
        {
          tool,
          points: [pos],
          color: tool === TOOLS.ERASER ? "#ffffff" : color,
          lineWidth,
        },
      ]);
    } else if (tool === TOOLS.TEXT) {
      setTextInputPos({ x: pos.x, y: pos.y });
      setTextInputVisible(true);
      setTextInput("");
      setDrawing(false);
    } else if (tool === TOOLS.ARROW || tool === TOOLS.CURVED_ARROW) {
      setElements((prev) => [
        ...prev,
        {
          tool,
          x: pos.x,
          y: pos.y,
          endX: pos.x,
          endY: pos.y,
          color,
          lineWidth,
          rotation: 0,
          controlX: pos.x,
          controlY: pos.y,
        },
      ]);
    } else {
      setElements((prev) => [
        ...prev,
        {
          tool,
          x: pos.x,
          y: pos.y,
          endX: pos.x,
          endY: pos.y,
          color,
          lineWidth,
          rotation: 0,
          fontSize: tool === TOOLS.TEXT ? fontSize : undefined,
        },
      ]);
    }
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const pos = getMousePos(e);

    if (tool === TOOLS.SELECT && selectedElementIndex !== null) {
      const dx = pos.x - startPos.x;
      const dy = pos.y - startPos.y;
      setElements((prev) =>
        prev.map((el, i) => {
          if (i !== selectedElementIndex) return el;
          return {
            ...el,
            x: el.x + dx,
            y: el.y + dy,
            endX: el.endX + dx,
            endY: el.endY + dy,
            points: el.points?.map((p) => ({ x: p.x + dx, y: p.y + dy })),
            controlX: el.controlX !== undefined ? el.controlX + dx : el.controlX,
            controlY: el.controlY !== undefined ? el.controlY + dy : el.controlY,
          };
        })
      );
      setStartPos(pos);
    } else if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
      setElements((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].points.push(pos);
        return updated;
      });
    } else if (tool === TOOLS.CURVED_ARROW) {
      setElements((prev) => {
        const updated = [...prev];
        const el = updated[updated.length - 1];
        el.endX = pos.x;
        el.endY = pos.y;

        const midX = (el.x + pos.x) / 2;
        const midY = (el.y + pos.y) / 2;

        const dx = pos.x - el.x;
        const dy = pos.y - el.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) {
          el.controlX = midX;
          el.controlY = midY;
        } else {
          const offset = 40;
          el.controlX = midX - (dy / len) * offset;
          el.controlY = midY + (dx / len) * offset;
        }

        return updated;
      });
    } else {
      setElements((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          endX: pos.x,
          endY: pos.y,
        };
        return updated;
      });
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setSelectedElementIndex(null);
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      setElements((prev) => [
        ...prev,
        {
          tool: TOOLS.TEXT,
          x: textInputPos.x,
          y: textInputPos.y,
          text: textInput,
          color,
          fontSize,
        },
      ]);
    }
    setTextInput("");
    setTextInputVisible(false);
  };

  const drawArrowhead = (ctx, fromX, fromY, toX, toY, color, size = 10) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - size * Math.cos(angle - Math.PI / 6),
      toY - size * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - size * Math.cos(angle + Math.PI / 6),
      toY - size * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (showGrid) {
      const gridSize = 20;
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width / devicePixelRatio; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height / devicePixelRatio);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height / devicePixelRatio; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width / devicePixelRatio, y);
        ctx.stroke();
      }
    }

    elements.forEach((el, index) => {
      ctx.strokeStyle = el.color || "#000000";
      ctx.fillStyle = el.color || "#000000";
      ctx.lineWidth = el.lineWidth || 2;

      switch (el.tool) {
        case TOOLS.RECTANGLE:
          {
            const x = Math.min(el.x, el.endX);
            const y = Math.min(el.y, el.endY);
            const w = Math.abs(el.endX - el.x);
            const h = Math.abs(el.endY - el.y);
            ctx.strokeRect(x, y, w, h);
          }
          break;

        case TOOLS.CIRCLE:
          {
            const centerX = (el.x + el.endX) / 2;
            const centerY = (el.y + el.endY) / 2;
            const radiusX = Math.abs(el.endX - el.x) / 2;
            const radiusY = Math.abs(el.endY - el.y) / 2;
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
            ctx.stroke();
          }
          break;

        case TOOLS.PEN:
        case TOOLS.ERASER:
          {
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.beginPath();
            el.points.forEach((point, i) => {
              if (i === 0) ctx.moveTo(point.x, point.y);
              else ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
          }
          break;

        case TOOLS.TEXT:
          {
            ctx.font = `${el.fontSize || 20}px Arial`;
            ctx.fillStyle = el.color || "#000000";
            ctx.fillText(el.text, el.x, el.y);
          }
          break;

        case TOOLS.ARROW:
          {
            const { x, y, endX, endY, color, lineWidth } = el;
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            drawArrowhead(ctx, x, y, endX, endY, color, 12);
          }
          break;

        case TOOLS.CURVED_ARROW:
          {
            const { x, y, endX, endY, controlX, controlY, color, lineWidth } = el;
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(controlX, controlY, endX, endY);
            ctx.stroke();
            // Draw arrowhead at end
            // Calculate arrowhead angle on curve
            const t = 0.95; // near end of curve
            const dx =
              (1 - t) * (controlX - x) * 2 +
              t * (endX - controlX) * 2;
            const dy =
              (1 - t) * (controlY - y) * 2 +
              t * (endY - controlY) * 2;
            const angle = Math.atan2(dy, dx);

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - 12 * Math.cos(angle - Math.PI / 6),
              endY - 12 * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              endX - 12 * Math.cos(angle + Math.PI / 6),
              endY - 12 * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fill();
          }
          break;

        default:
          break;
      }
    });
  };

  const undo = () => {
    if (elements.length === 0) return;
    const newRedo = [...redoStack, elements[elements.length - 1]];
    setRedoStack(newRedo);
    setElements((prev) => prev.slice(0, prev.length - 1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const lastRedo = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setElements((prev) => [...prev, lastRedo]);
  };

  const clearCanvas = () => {
    setElements([]);
    setRedoStack([]);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "kaarya_kendra_drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
 const [messages, setMessages] = useState([
    { message: 'Hello, welcome to the team!', sender: 'Admin', sentTime: 'just now' },
  ]);
  const [email, setEmail] = useState('');
  const [task, setTask] = useState('');
  const [assignee, setAssignee] = useState('');
  const [tasks, setTasks] = useState([]);
  const form = useRef();

  const handleSend = (message) => {
    setMessages([...messages, { message, sender: 'You', sentTime: 'just now' }]);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const templateParams = {
      to_email: email,
      subject: 'Invitation to Join Our Team',
      message: 'Click here to join: [link]',
    };
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY')
      .then(() => alert('Invitation sent!'))
      .catch(() => alert('Failed to send invitation.'));
  };

  const addTask = () => {
    setTasks([...tasks, { task, assignee, completed: false }]);
    setTask('');
    setAssignee('');
  };

  const toggleCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  return (
     <div className="font-sans   rounded-3xl overflow-hidden">
      {/* Top Section with Poster and Description */}
      <section className="relative w-full bg-cover bg-center h-96 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px]" style={{ backgroundImage: 'url("https://i.pinimg.com/736x/e9/d7/8b/e9d78bb7b60d07fc58ade74d494aa672.jpg")' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 sm:px-8 md:px-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Welcome to  Kaarya Kendra  </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
           Kaarya Kendra is a professional networking and collaboration platform designed to connect individuals across various industries. The dashboard facilitates the creation of projects, team collaborations, and knowledge sharing. Users can join discussions, contribute to ongoing projects, and expand their professional network, making it an essential tool for career development.




          </p>
        </div>
      </section>

    <div className="w-full min-h-screen    text-white flex flex-col items-center p-4">
    
     
     
      <h1 className="text-2xl font-bold mb-4">Kaarya Kendra Whiteboard</h1>

      {/* Toolbar */}
      <nav className="flex bg-black rounded-3xl   flex-wrap gap-3 mb-3 items-center justify-center">
        <button
          onClick={() => setTool(TOOLS.RECTANGLE)}
          title="Rectangle"
          className={`p-2 rounded ${
            tool === TOOLS.RECTANGLE ? "bg-blue-600" : "bg-[#161616]"
          }`}
        >
          <FaRegSquare size={20} />
        </button>
        <button
          onClick={() => setTool(TOOLS.CIRCLE)}
          title="Circle"
          className={`p-2 rounded ${
            tool === TOOLS.CIRCLE ? "bg-blue-600" : "bg-[#161616]"
          }`}
        >
          <FaCircle size={20} />
        </button>
        <button
          onClick={() => setTool(TOOLS.PEN)}
          title="Pen"
          className={`p-2 rounded ${
            tool === TOOLS.PEN ? "bg-blue-600" : "bg-[#161616]"
          }`}
        >
          <FaPen size={20} />
        </button>
        <button
          onClick={() => setTool(TOOLS.ARROW)}
          title="Arrow"
          className={`p-2 rounded ${
            tool === TOOLS.ARROW ? "bg-blue-600" : "bg-[#161616]"
          }`}
        >
          <FaArrowRight size={20} />
        </button>
        <button
          onClick={() => setTool(TOOLS.CURVED_ARROW)}
          title="Curved Arrow"
          className={`p-2 rounded ${
            tool === TOOLS.CURVED_ARROW ? "bg-blue-600" : "bg-[#161616]"
          }`}
        >
          <FaShareAlt size={20} />
        </button>
        <button
          onClick={() => setTool(TOOLS.TEXT)}
          title="Text"
          className={`p-2 rounded ${
            tool === TOOLS.TEXT ? "bg-blue-600" : "bg-[#161616]"
          }`}
        >
          <FaTextHeight size={20} />
        </button>
        <button
          onClick={() => setTool(TOOLS.ERASER)}
          title="Eraser"
          className={`p-2 rounded ${
            tool === TOOLS.ERASER ? "bg-blue-600" : "bg-[#161616]"
          }`}
        >
          <FaEraser size={20} />
        </button>
        <button
          onClick={() => setTool(TOOLS.SELECT)}
          title="Select/Move"
          className={`p-2 rounded ${
            tool === TOOLS.SELECT ? "bg-blue-600" : "bg-[#161616]"
          }`}
        >
          <FaGripLines size={20} />
        </button>

        <button
          onClick={undo}
          title="Undo"
          className="p-2 rounded bg-[#161616]"
        >
          <FaUndo size={20} />
        </button>
        <button
          onClick={redo}
          title="Redo"
          className="p-2 rounded bg-[#161616]"
        >
          <FaRedo size={20} />
        </button>
        <button
          onClick={clearCanvas}
          title="Clear Canvas"
          className="p-2 rounded bg-[#161616]"
        >
          <FaTrash size={20} />
        </button>
        <button
          onClick={saveImage}
          title="Save as PNG"
          className="p-2 rounded bg-[#161616]"
        >
          <FaSave size={20} />
        </button>

        {/* Color Picker */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="Select Color"
          className="w-8 h-8 cursor-pointer rounded border border-gray-400 ml-3"
        />

        {/* Line Width Selector */}
        <select
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          className="ml-2 p-1 rounded bg-[#161616] text-white"
          title="Select Line Width"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>

        {/* Font Size Selector for Text Tool */}
        {tool === TOOLS.TEXT && (
          <select
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="ml-2 p-1 rounded bg-[#161616] text-white"
            title="Select Font Size"
          >
            {[12, 16, 20, 24, 28, 32, 36].map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        )}

        <button
          onClick={() => setShowGrid((prev) => !prev)}
          title="Toggle Grid"
          className={`p-2 rounded ${
            showGrid ? "bg-blue-600" : "bg-[#161616]"
          }`}
        >
          <FaGripLines size={20} />
        </button>
      </nav>

      {/* Canvas */}
<div
  style={{
    width: "100%",
    maxWidth: "100vw",
    overflowX: "auto",
    boxSizing: "border-box",
    padding: "1rem",
  }}
>
        <canvas
          ref={canvasRef}
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            cursor: tool === TOOLS.PEN ? "crosshair" : "default",
            userSelect: "none",
          
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Text Input Overlay */}
        {textInputVisible && (
          <input
            type="text"
            autoFocus
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onBlur={handleTextSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTextSubmit();
            }}
            style={{
              position: "absolute",
              left: textInputPos.x,
              top: textInputPos.y - fontSize,
              fontSize: fontSize,
              color: color,
              border: `1px solid ${color}`,
              background: "transparent",
              outline: "none",
              padding: "0 2px",
              maxWidth: 200,
            }}
          />
        )}
      </div>
    </div>

    </div>

  );
};

export default KaaryaKendra;
