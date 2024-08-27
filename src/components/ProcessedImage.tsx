import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImagePreview from './ImagePreview';

interface ProcessedImageProps {
  src: string;
  date: Date;
}

const ProcessedImage: React.FC<ProcessedImageProps> = ({ src, date }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleCopy = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      alert('Image copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy image: ', err);
      navigator.clipboard.writeText(src)
        .then(() => alert('Image URL copied to clipboard (image copy not supported in this browser)'))
        .catch(err => console.error('Failed to copy URL: ', err));
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `processed_image_${date.getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <motion.div
        className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsPreviewOpen(true)}
      >
        <img
          src={src}
          alt="Processed image"
          className="w-full h-full object-contain rounded-lg"
        />
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {date.toLocaleString()}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPreviewOpen(false)}
          >
            <ImagePreview
              src={src}
              onClose={() => setIsPreviewOpen(false)}
              onCopy={handleCopy}
              onDownload={handleDownload}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProcessedImage;