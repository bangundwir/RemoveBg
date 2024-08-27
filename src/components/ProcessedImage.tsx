import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImagePreview from './ImagePreview';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiCopy, FiDownload, FiMaximize2 } from 'react-icons/fi';
import { useToast } from "@/components/ui/use-toast";

interface ProcessedImageProps {
  src: string;
  date: Date;
}

const ProcessedImage: React.FC<ProcessedImageProps> = ({ src, date }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      toast({
        title: "Image copied",
        description: "Image has been copied to clipboard.",
      })
    } catch (err) {
      console.error('Failed to copy image: ', err);
      navigator.clipboard.writeText(src)
        .then(() => toast({
          title: "URL copied",
          description: "Image URL has been copied to clipboard.",
        }))
        .catch(err => {
          console.error('Failed to copy URL: ', err);
          toast({
            title: "Copy failed",
            description: "Failed to copy image or URL.",
            variant: "destructive",
          })
        });
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = src;
    link.download = `processed_image_${date.getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
  }, []);

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
          <CardContent className="p-0 h-full">
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
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProcessedImage;