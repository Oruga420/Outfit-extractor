
import React from 'react';
import { GeneratedImage } from '../types';

interface GeneratedImageViewerProps {
  images: GeneratedImage[];
  mainTitle?: string;
}

export const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ images, mainTitle = "The Treasure I Found!" }) => {

  const handleDownload = (src: string, title: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    images.forEach((image, index) => {
      setTimeout(() => {
        handleDownload(image.src, image.title);
      }, index * 300); // Stagger downloads to avoid browser blocking
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg border-2 border-slate-200">
      <h3 className="font-permanent-marker text-3xl text-blue-600 mb-6 text-center">{mainTitle}</h3>
      <div className="space-y-6">
        {images.map((image) => (
          <div key={image.title} className="p-4 border border-amber-200 rounded-md bg-amber-50">
            <h4 className="font-bold text-lg mb-2 text-slate-700">{image.title}</h4>
            <img src={image.src} alt={image.title} className="rounded-md w-full h-auto mb-3" />
            <button
              onClick={() => handleDownload(image.src, image.title)}
              className="w-full bg-yellow-500 text-slate-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Download
            </button>
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="mt-8">
          <button
            onClick={handleDownloadAll}
            className="w-full bg-red-600 text-white font-bold text-xl py-4 px-6 rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
          >
            Download All Treasure
          </button>
        </div>
      )}
    </div>
  );
};
