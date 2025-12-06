import { GoogleGenAI } from "@google/genai";
import { Meeting } from "../types";

const getAIClient = () => {
  // Use a fallback key or handling if environment variable is missing for the demo
  // In a real app, this MUST be process.env.API_KEY
  const apiKey = process.env.API_KEY; 
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSmartAgenda = async (topic: string, duration: number): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI services unavailable. Please check API Key configuration.";

  try {
    const prompt = `Create a concise, professional meeting agenda for a ${duration}-minute meeting about "${topic}". Return only the agenda items as a bulleted list. Do not include markdown block ticks.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate agenda.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating agenda. Please try again.";
  }
};

export const analyzeSchedule = async (meetings: Meeting[]): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI services unavailable.";

  // Filter for upcoming meetings to save context
  const upcoming = meetings.filter(m => new Date(m.startTime) > new Date()).slice(0, 10);
  const dataSummary = upcoming.map(m => `${m.startTime}: ${m.title} with ${m.guestName}`).join('\n');

  try {
    const prompt = `Here is a list of my upcoming meetings:\n${dataSummary}\n\nProvide a 2-sentence summary of my upcoming workload and suggest one tip for preparation. Keep it friendly and professional.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not analyze schedule.";
  }
};
