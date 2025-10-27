
import React from 'react';
import { StrawHatIcon } from './icons/StrawHatIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-red-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <StrawHatIcon className="h-12 w-12 text-yellow-300" />
        <h1 className="text-4xl md:text-5xl font-permanent-marker tracking-wide text-shadow">
          Gum-Gum Outfit Extractor
        </h1>
      </div>
    </header>
  );
};
