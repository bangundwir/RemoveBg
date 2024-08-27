import React, { useState, useMemo } from 'react';
import ProcessedImage from './ProcessedImage';
import ImageSkeleton from './ImageSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ImageGridProps {
  images: Array<{src: string, date: Date, fileName: string}>;
  processingCount: number;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, processingCount }) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [gridSize, setGridSize] = useState('md');
  const [groupBy, setGroupBy] = useState<'none' | 'date'>('none');

  const filteredAndSortedImages = useMemo(() => {
    return images
      .filter(image => 
        image.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.date.toLocaleDateString().includes(searchTerm)
      )
      .sort((a, b) => {
        return sortOrder === 'asc' ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime();
      });
  }, [images, sortOrder, searchTerm]);

  const groupedImages = useMemo(() => {
    if (groupBy === 'date') {
      const groups: {[key: string]: typeof filteredAndSortedImages} = {};
      filteredAndSortedImages.forEach(image => {
        const dateKey = image.date.toLocaleDateString();
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(image);
      });
      return groups;
    }
    return { 'All Images': filteredAndSortedImages };
  }, [filteredAndSortedImages, groupBy]);

  const gridSizeClass = {
    sm: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8",
    md: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
    lg: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  }[gridSize];

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-semibold">Processed Images</h2>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Oldest first</SelectItem>
              <SelectItem value="desc">Newest first</SelectItem>
            </SelectContent>
          </Select>
          <Select value={gridSize} onValueChange={(value: 'sm' | 'md' | 'lg') => setGridSize(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Grid size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groupBy} onValueChange={(value: 'none' | 'date') => setGroupBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No grouping</SelectItem>
              <SelectItem value="date">Group by date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {Object.entries(groupedImages).map(([group, images]) => (
        <div key={group}>
          {groupBy === 'date' && <h3 className="text-xl font-semibold mt-4 mb-2">{group}</h3>}
          <motion.div 
            className={`grid ${gridSizeClass} gap-4`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProcessedImage src={image.src} date={image.date} fileName={image.fileName} />
                </motion.div>
              ))}
              {processingCount > 0 && group === 'All Images' && [...Array(processingCount)].map((_, index) => (
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
        </div>
      ))}
    </>
  );
};

export default ImageGrid;