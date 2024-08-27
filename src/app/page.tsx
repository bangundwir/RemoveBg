'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import ImageGrid from '../components/ImageGrid';
import { removeBackground } from '../utils/api';
import { motion } from 'framer-motion';

export default function Home() {
  const [processedImages, setProcessedImages] = useState<Array<{src: string, date: Date}>>([]);
  const [processingCount, setProcessingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: File[]) => {
    setProcessingCount(prev => prev + files.length);

    for (const file of files) {
      try {
        const processedImage = await removeBackground(file, () => {});
        setProcessedImages(prev => [...prev, { src: processedImage, date: new Date() }]);
      } catch (error) {
        console.error('Error processing image:', error);
      } finally {
        setProcessingCount(prev => prev - 1);
      }
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    processFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      processFiles(Array.from(event.target.files));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <motion.main
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-bold mb-8 text-center text-white"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Background Removal Tool
        </motion.h1>
        <motion.button
          className="btn mb-4 w-full"
          onClick={handleFileSelect}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Select Files
        </motion.button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInputChange}
          multiple
        />
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-8 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
        <ImageGrid 
          images={processedImages}
          processingCount={processingCount}
        />
      </motion.main>
    </div>
  );
}