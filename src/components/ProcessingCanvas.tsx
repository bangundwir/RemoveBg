import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProcessingCanvasProps {
  src: string;
  onSave: (editedImageData: string) => void;
}

const ProcessingCanvas: React.FC<ProcessingCanvasProps> = ({ src, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      setCtx(context);

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context?.drawImage(img, 0, 0);
      };
      img.src = src;
    }
  }, [src]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEditMode) return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !isEditMode) return;

    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    const x = e.clientX - (rect?.left ?? 0);
    const y = e.clientY - (rect?.top ?? 0);

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const editedImageData = canvas.toDataURL('image/png');
      onSave(editedImageData);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <motion.div
      className="relative bg-gray-800 p-4 rounded-lg max-w-4xl max-h-[90vh] w-full h-full flex flex-col items-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <div className="mb-4 flex space-x-2">
        <button
          className={`px-4 py-2 rounded transition-colors ${
            isEditMode ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-300'
          }`}
          onClick={toggleEditMode}
        >
          {isEditMode ? 'Editing' : 'Edit'}
        </button>
        {isEditMode && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={handleSave}
          >
            Save
          </button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        className={`border border-gray-600 rounded ${isEditMode ? 'cursor-crosshair' : 'cursor-default'}`}
      />
    </motion.div>
  );
};

export default ProcessingCanvas;