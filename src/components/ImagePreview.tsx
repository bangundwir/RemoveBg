import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { FiZoomIn, FiZoomOut, FiRotateCcw, FiMaximize, FiMinimize } from 'react-icons/fi';

interface ImagePreviewProps {
  src: string;
  onClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

const ZoomControls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute top-2 left-2 z-10 flex space-x-2">
      <motion.button
        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
        onClick={() => zoomIn()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiZoomIn />
      </motion.button>
      <motion.button
        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
        onClick={() => zoomOut()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiZoomOut />
      </motion.button>
      <motion.button
        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
        onClick={() => resetTransform()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiRotateCcw />
      </motion.button>
    </div>
  );
};

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, onClose, onCopy, onDownload }) => {
  const [fileSize, setFileSize] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const getFileSize = async () => {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const size = blob.size;
        const formattedSize = size < 1024 * 1024
          ? `${(size / 1024).toFixed(2)} KB`
          : `${(size / (1024 * 1024)).toFixed(2)} MB`;
        setFileSize(formattedSize);
      } catch (error) {
        console.error('Error fetching file size:', error);
        setFileSize('Unknown');
      }
    };

    getFileSize();
  }, [src]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-lg overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={(e) => e.stopPropagation()}
    >
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={3}
        centerOnInit={true}
      >
        {() => (
          <>
            <ZoomControls />
            <TransformComponent wrapperClass="!w-full !h-[calc(90vh-150px)]" contentClass="!w-full !h-full">
              <img
                src={src}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
      <motion.div 
        className="p-4 flex justify-between items-center flex-wrap gap-2 bg-gray-900 bg-opacity-50"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-sm text-gray-300">File size: {fileSize}</div>
        <div className="flex space-x-2">
          <motion.button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={onCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Copy Image
          </motion.button>
          <motion.button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            onClick={onDownload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download Image
          </motion.button>
          <motion.button
            className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-colors"
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isFullscreen ? <FiMinimize /> : <FiMaximize />}
          </motion.button>
        </div>
        <motion.button
          className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          X
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ImagePreview;