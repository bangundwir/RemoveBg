'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import ImageGrid from '../components/ImageGrid';
import { removeBackground } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
    <div className="min-h-screen bg-gray-900 bg-opacity-90 bg-grid-pattern">
      <AnimatePresence>
        <motion.main
          className="container mx-auto px-4 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-5xl font-bold mb-12 text-center text-white"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Background Removal Tool
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button className="w-full mb-6 text-lg py-6" onClick={handleFileSelect}>
              Select Files
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileInputChange}
              multiple
            />
            <Card {...getRootProps()} className="mb-8 cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
              <CardContent className="p-8 text-center">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-blue-500">Drop the files here ...</p>
                ) : (
                  <p className="text-gray-300">Drag 'n' drop some files here, or click to select files</p>
                )}
              </CardContent>
            </Card>
            <ImageGrid 
              images={processedImages}
              processingCount={processingCount}
            />
          </motion.div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}