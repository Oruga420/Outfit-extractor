
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50">
      <div className="w-24 h-24 border-8 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-6 text-white text-xl font-permanent-marker tracking-wider">{message}</p>
    </div>
  );
};
