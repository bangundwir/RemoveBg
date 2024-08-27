import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { FiZoomIn, FiZoomOut, FiRotateCcw, FiMaximize, FiMinimize, FiX } from 'react-icons/fi';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

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
      <Button variant="outline" size="icon" onClick={() => zoomIn()}>
        <FiZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => zoomOut()}>
        <FiZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => resetTransform()}>
        <FiRotateCcw className="h-4 w-4" />
      </Button>
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
    <Card
      className="bg-gray-800 bg-opacity-90 backdrop-blur-md w-full max-w-4xl max-h-[90vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <CardContent className="p-0 flex-grow relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={onClose}
        >
          <FiX className="h-6 w-6" />
        </Button>
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
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center flex-wrap gap-2 bg-gray-900 bg-opacity-50">
        <div className="text-sm text-gray-300">File size: {fileSize}</div>
        <div className="flex space-x-2">
          <Button onClick={onCopy}>Copy Image</Button>
          <Button onClick={onDownload}>Download Image</Button>
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <FiMinimize className="h-4 w-4" /> : <FiMaximize className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ImagePreview;