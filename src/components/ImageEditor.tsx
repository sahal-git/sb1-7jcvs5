import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Download } from 'lucide-react';
import { Image, CropArea } from '../types';
import { getCroppedImg } from '../utils/imageProcessing';

interface ImageEditorProps {
  sourceImage: Image;
  frameImage: Image;
  croppedArea: CropArea | null;
  setCroppedArea: (area: CropArea) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  sourceImage,
  frameImage,
  croppedArea,
  setCroppedArea,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback(
    (croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedArea(croppedAreaPixels);
    },
    [setCroppedArea]
  );

  const handleDownload = async () => {
    if (croppedArea) {
      const croppedImage = await getCroppedImg(sourceImage.dataUrl, croppedArea);
      const mergedImage = await mergeImages(croppedImage, frameImage.dataUrl);
      
      const link = document.createElement('a');
      link.download = 'merged-image.png';
      link.href = mergedImage;
      link.click();
    }
  };

  const mergeImages = (croppedImage: string, frameImage: string): Promise<string> => {
    return new Promise((resolve) => {
      const img1 = new Image();
      const img2 = new Image();

      img1.onload = () => {
        img2.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = frameImage.width;
          canvas.height = frameImage.height;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.drawImage(img1, 0, 0, frameImage.width, frameImage.height);
            ctx.drawImage(img2, 0, 0, frameImage.width, frameImage.height);
            resolve(canvas.toDataURL('image/png'));
          }
        };
        img2.src = frameImage;
      };
      img1.src = croppedImage;
    });
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit and Merge Images</h2>
      <div className="relative h-96 mb-4">
        <Cropper
          image={sourceImage.dataUrl}
          crop={crop}
          zoom={zoom}
          aspect={frameImage.width / frameImage.height}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="w-1/2">
          <label htmlFor="zoom" className="block text-sm font-medium text-gray-700 mb-1">
            Zoom
          </label>
          <input
            type="range"
            id="zoom"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Merged Image
        </button>
      </div>
    </div>
  );
};

export default ImageEditor;