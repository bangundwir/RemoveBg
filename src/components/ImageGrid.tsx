import React from 'react';
import ProcessedImage from './ProcessedImage';
import ImageSkeleton from './ImageSkeleton';
import { motion } from 'framer-motion';

interface ImageGridProps {
  images: Array<{src: string, date: Date}>;
  processingCount: number;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, processingCount }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {images.map((image, index) => (
        <motion.div
          key={image.src}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ProcessedImage src={image.src} date={image.date} />
        </motion.div>
      ))}
      {[...Array(processingCount)].map((_, index) => (
        <motion.div
          key={`skeleton-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ImageSkeleton />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ImageGrid;