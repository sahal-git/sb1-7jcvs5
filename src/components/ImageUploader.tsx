import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { Image } from '../types';

interface ImageUploaderProps {
  title: string;
  onImageUpload: (image: Image) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          onImageUpload({
            file,
            dataUrl: e.target?.result as string,
            width: img.width,
            height: img.height,
          });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDropRejected: () => {
      toast.error('Please upload a valid image file');
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600">
          {isDragActive
            ? 'Drop the image here'
            : 'Drag and drop an image here, or click to select'}
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;