import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImagePreview from './ImagePreview';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiCopy, FiDownload, FiMaximize2, FiEdit } from 'react-icons/fi';
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ProcessedImageProps {
  src: string;
  date: Date;
}

const ProcessedImage: React.FC<ProcessedImageProps> = ({ src, date }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const imageWithBackground = await createImageWithBackground();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': imageWithBackground
        })
      ]);
      toast({
        title: "Image copied",
        description: "Image with background has been copied to clipboard.",
      })
    } catch (err) {
      console.error('Failed to copy image: ', err);
      toast({
        title: "Copy failed",
        description: "Failed to copy image.",
        variant: "destructive",
      })
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const imageWithBackground = await createImageWithBackground();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(imageWithBackground);
      link.download = `processed_image_${date.getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download image: ', err);
      toast({
        title: "Download failed",
        description: "Failed to download image.",
        variant: "destructive",
      })
    }
  };

  const createImageWithBackground = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create blob'));
            }, 'image/png');
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        } else {
          reject(new Error('Canvas not found'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  };

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
  }, []);

  const handleBackgroundChange = (color: string) => {
    setBackgroundColor(color);
  };

  const colors = [
    'transparent', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className="relative aspect-square overflow-hidden cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors group"
          onClick={() => setIsPreviewOpen(true)}
        >
          <CardContent className="p-0 h-full" style={{ backgroundColor }}>
            <img
              src={src}
              alt="Processed image"
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
              <div className="flex justify-end space-x-2">
                <Button size="icon" variant="ghost" onClick={handleCopy}>
                  <FiCopy className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleDownload}>
                  <FiDownload className="h-4 w-4" />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <FiEdit className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid grid-cols-5 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                          style={{ backgroundColor: color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBackgroundChange(color);
                          }}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white">{date.toLocaleString()}</span>
                <Button size="icon" variant="ghost" onClick={() => setIsPreviewOpen(true)}>
                  <FiMaximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreview}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <ImagePreview
                src={src}
                onClose={closePreview}
                onCopy={handleCopy}
                onDownload={handleDownload}
                backgroundColor={backgroundColor}
                onBackgroundChange={handleBackgroundChange}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
};

export default ProcessedImage;