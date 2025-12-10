import { GoogleGenAI } from "@google/genai";
import { AppData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateInviteText = async (guestName: string, eventName: string, language: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Please configure.";
  
  try {
    const prompt = `Write a short, warm wedding invitation message for ${eventName} specifically for a guest named ${guestName}. 
    Language: ${language === 'ur' ? 'Urdu (in Urdu script)' : 'English'}. 
    Keep it under 50 words. Format it for WhatsApp.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate invite.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating invite.";
  }
};

export const analyzeBudget = async (data: AppData): Promise<string> => {
  if (!apiKey) return "API Key missing.";

  try {
    const totalBudget = data.events.reduce((sum, e) => sum + e.budget, 0);
    const vendorCosts = data.vendors.reduce((sum, v) => sum + v.cost, 0);
    const vendorPaid = data.vendors.reduce((sum, v) => sum + v.paidAmount, 0);

    const context = `
      Total Event Budget: ${totalBudget}
      Total Vendor Contracts: ${vendorCosts}
      Total Paid to Vendors: ${vendorPaid}
      Number of Guests: ${data.guests.length}
      Pending Tasks: ${data.tasks.filter(t => !t.completed).length}
    `;

    const prompt = `Analyze this wedding budget and status. Give 3 short, bullet-point insights or warnings. 
    If over budget, suggest cuts. 
    Context: ${context}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis available.";
  } catch (error) {
    return "Error analyzing budget.";
  }
};

export const chatWithAssistant = async (message: string, contextData: string): Promise<string> => {
  if (!apiKey) return "Please set your API Key.";

  try {
    const systemInstruction = `You are a helpful Wedding Planner Assistant. 
    You have access to the following current wedding data summary: ${contextData}.
    Answer questions based on this data. Be concise and helpful.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I didn't understand that.";
  } catch (error) {
    return "Sorry, I'm having trouble connecting right now.";
  }
};