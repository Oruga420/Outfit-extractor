
import { GoogleGenAI, GenerateContentResponse, Part, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function analyzeOutfit(imagePart: Part): Promise<string> {
  const model = 'gemini-2.5-flash-image';
  const prompt = `Analyze the provided image and describe the outfit worn by the person. Your description should be extremely detailed, focusing on clothing items, colors, fabrics, patterns, and accessories. CRITICALLY, describe ONLY the clothing and accessories, not the person wearing them. The description will be used to generate new images of the outfit without a person. Output only the description. For example, if you see a person in a red shirt and blue jeans, describe 'A red crew-neck t-shirt and classic-fit blue denim jeans.'`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: { parts: [imagePart, { text: prompt }] },
  });

  return response.text;
}

export async function generateImage(prompt: string): Promise<string> {
    const model = 'gemini-2.5-flash-image';
    
    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error('Image generation failed or did not return an image.');
}


export async function editImage(imagePart: Part, prompt: string): Promise<string> {
    const model = 'gemini-2.5-flash-image';
    
    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [imagePart, { text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error('Image editing failed or did not return an image.');
}
