import React from 'react';
import { motion } from 'framer-motion';

const ImageSkeleton: React.FC = () => {
  return (
    <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default ImageSkeleton;