import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuiz = async (topic: string): Promise<QuizQuestion | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a multiple-choice quiz question about the cyber attack: "${topic}". 
      Return valid JSON. 
      The question should test understanding of how the attack works or how to prevent it.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
            explanation: { type: Type.STRING, description: "Short explanation of why the answer is correct." }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion;
    }
    return null;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return null;
  }
};

export const generateDeepDive = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a short, 2-sentence "Deep Dive" fact about ${topic} that is interesting and educational for a beginner in cybersecurity. Do not use markdown.`
    });
    return response.text || "Could not retrieve info.";
  } catch (error) {
    console.error("Error generating deep dive:", error);
    return "AI Service temporarily unavailable.";
  }
};
