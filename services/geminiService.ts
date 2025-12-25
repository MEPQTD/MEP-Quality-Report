
import { GoogleGenAI, Type } from "@google/genai";
import { Discipline, Severity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalyzedObservation {
  discipline: Discipline;
  description: string;
  correctiveAction: string;
  severity: Severity;
}

export const analyzeObservation = async (photoBase64?: string, rawText?: string): Promise<AnalyzedObservation> => {
  const contents: any[] = [];
  
  if (photoBase64) {
    contents.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: photoBase64.split(',')[1] || photoBase64
      }
    });
  }

  const prompt = `
    Act as a senior MEP (Mechanical, Electrical, Plumbing) QA/QC Engineer. 
    Analyze the provided image and/or text observation.
    Provide a professional, technical description and a recommended corrective action.
    ${rawText ? `Original observation: "${rawText}"` : "Analyze the photo for common construction defects or compliance issues."}
  `;

  contents.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: contents },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          discipline: { 
            type: Type.STRING, 
            enum: Object.values(Discipline),
            description: "The MEP discipline this observation belongs to."
          },
          description: { 
            type: Type.STRING,
            description: "Professional technical description of the observation."
          },
          correctiveAction: { 
            type: Type.STRING,
            description: "Clear instructions for correction."
          },
          severity: { 
            type: Type.STRING,
            enum: Object.values(Severity),
            description: "Severity level based on safety and compliance."
          }
        },
        required: ["discipline", "description", "correctiveAction", "severity"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const summarizeReport = async (projectName: string, observations: any[]): Promise<string> => {
  const obsText = observations.map((o, i) => `${i+1}. [${o.discipline}] ${o.description}`).join('\n');
  const prompt = `Summarize the following MEP inspection for project "${projectName}". Focus on major trends and critical risks.\n\nObservations:\n${obsText}`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return response.text || "No summary available.";
};
