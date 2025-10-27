
import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImageViewer } from './components/GeneratedImageViewer';
import { Loader } from './components/Loader';
import { analyzeOutfit, generateImage, editImage } from './services/geminiService';
import { GeneratedImage } from './types';
import { fileToGenerativePart } from './utils/fileUtils';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [editedImage, setEditedImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  const handleImageUpload = (file: File) => {
    setIsLoading(false);
    setError(null);
    setGeneratedImages([]);
    setEditedImage(null);
    setIsEditing(false);
    setEditPrompt('');
    setOriginalImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleExtractOutfit = async () => {
    if (!originalImageFile) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setEditedImage(null);

    try {
      setLoadingMessage('Analyzing outfit... This might take a moment!');
      const imagePart = await fileToGenerativePart(originalImageFile);
      const outfitDescription = await analyzeOutfit(imagePart);

      if (!outfitDescription) {
        throw new Error('Could not analyze the outfit from the image.');
      }
      
      setLoadingMessage('Generating new images... The Grand Line wasn\'t built in a day!');
      const prompts = [
        {
          title: 'Technical Sheet',
          prompt: `Generate a 'ficha tecnica' or technical flat sketch of this outfit: ${outfitDescription}. The image should be on a white background and include annotations pointing to key details like stitching, fabric type, buttons, and cut lines. The style should be clean and professional, like a fashion designer's sketch.`,
        },
        {
          title: 'On a Mannequin',
          prompt: `Generate a photorealistic image of this outfit on a featureless, neutral grey mannequin in a well-lit studio setting: ${outfitDescription}.`,
        },
        {
          title: 'Front and Back View',
          prompt: `Generate a single image showing two views of this outfit for an e-commerce product listing on a plain white background. The outfit should be presented as a 'flat lay' or as if floating, with absolutely no visible mannequin or human form. One view must be the front, and the other must be the back, placed side-by-side. The presentation should be clean and professional. Ensure NO human person is visible in the image: ${outfitDescription}.`,
        },
      ];

      const generationPromises = prompts.map(p => 
        generateImage(p.prompt).then(imageData => ({
          title: p.title,
          src: `data:image/png;base64,${imageData}`,
        }))
      );

      const newImages = await Promise.all(generationPromises);
      setGeneratedImages(newImages);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. The treasure might be lost at sea!');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const handleApplyEdit = async () => {
    if (!originalImageFile || !editPrompt.trim()) return;

    setIsLoading(true);
    setLoadingMessage('Applying your edit... like a Devil Fruit power!');
    setError(null);
    setGeneratedImages([]);
    setEditedImage(null);

    try {
        const imagePart = await fileToGenerativePart(originalImageFile);
        const editedImageData = await editImage(imagePart, editPrompt);
        setEditedImage({
            title: 'Edited Image',
            src: `data:image/png;base64,${editedImageData}`,
        });
    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Your edit might be lost at sea!');
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-8 text-lg text-gray-700">
            Upload a picture of an outfit, and I'll use my Gum-Gum powers to extract it, edit it, or show it off in new ways! Just like finding the One Piece, it's a grand adventure!
          </p>
          <ImageUploader onImageUpload={handleImageUpload} disabled={isLoading} />
        </div>

        {isLoading && <Loader message={loadingMessage} />}
        
        {error && (
          <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p className="font-bold">Aw, shucks! An error!</p>
            <p>{error}</p>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {originalImage && (
            <div className="p-4 bg-white rounded-lg shadow-lg border-2 border-slate-200">
              <h3 className="font-permanent-marker text-2xl text-blue-600 mb-4 text-center">Your Treasure Map (Original)</h3>
              <img src={originalImage} alt="Uploaded outfit" className="rounded-md w-full h-auto object-contain" />
               <div className="mt-4 border-t-2 border-amber-200 pt-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={handleExtractOutfit} disabled={isLoading} className="flex-1 bg-red-600 text-white font-bold text-lg py-3 px-5 rounded-full shadow-md hover:bg-red-700 transition-transform transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none">
                      Extract Outfit
                    </button>
                    <button onClick={() => setIsEditing(!isEditing)} disabled={isLoading} className="flex-1 bg-blue-600 text-white font-bold text-lg py-3 px-5 rounded-full shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none">
                      {isEditing ? 'Cancel Edit' : 'Edit Image'}
                    </button>
                  </div>
                  {isEditing && (
                    <div className="mt-4 space-y-2">
                      <textarea
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="e.g., 'Add a retro filter' or 'Make the background a pirate ship'"
                        className="w-full p-2 border-2 border-amber-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                        rows={3}
                        disabled={isLoading}
                      />
                      <button onClick={handleApplyEdit} disabled={isLoading || !editPrompt.trim()} className="w-full bg-yellow-500 text-slate-900 font-bold py-3 px-4 rounded-md hover:bg-yellow-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Apply Edit
                      </button>
                    </div>
                  )}
                </div>
            </div>
          )}

          {(generatedImages.length > 0 || editedImage) && (
            <div className="md:col-span-1 md:row-start-1">
              <GeneratedImageViewer 
                images={editedImage ? [editedImage] : generatedImages} 
                mainTitle={editedImage ? "Your Edited Treasure!" : "The Treasure I Found!"}
              />
            </div>
          )}
        </div>
        
        {!isLoading && !originalImage && (
             <div className="mt-16 flex justify-center">
                <img src="https://picsum.photos/800/600?random=1" alt="Placeholder pirate fashion" className="rounded-lg shadow-2xl max-w-lg w-full border-4 border-yellow-500"/>
             </div>
        )}
      </main>
    </div>
  );
};

export default App;
