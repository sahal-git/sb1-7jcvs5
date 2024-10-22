import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageEditor from './components/ImageEditor';
import { Image, CropArea } from './types';

function App() {
  const [sourceImage, setSourceImage] = useState<Image | null>(null);
  const [frameImage, setFrameImage] = useState<Image | null>(null);
  const [croppedArea, setCroppedArea] = useState<CropArea | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader
            title="Upload Source Image"
            onImageUpload={setSourceImage}
          />
          <ImageUploader
            title="Upload Frame Image"
            onImageUpload={setFrameImage}
          />
        </div>
        {sourceImage && frameImage && (
          <ImageEditor
            sourceImage={sourceImage}
            frameImage={frameImage}
            croppedArea={croppedArea}
            setCroppedArea={setCroppedArea}
          />
        )}
      </main>
    </div>
  );
}

export default App;