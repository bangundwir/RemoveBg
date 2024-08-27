import React, { useState } from 'react';
import ProcessedImage from './ProcessedImage';
import ImageSkeleton from './ImageSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface ImageGridProps {
  images: Array<{src: string, date: Date}>;
  processingCount: number;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, processingCount }) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedImages = [...images].sort((a, b) => {
    return sortOrder === 'asc' ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime();
  });

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Processed Images</h2>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          Sort {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </div>
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {sortedImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProcessedImage src={image.src} date={image.date} />
            </motion.div>
          ))}
          {[...Array(processingCount)].map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ImageSkeleton />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ImageGrid;