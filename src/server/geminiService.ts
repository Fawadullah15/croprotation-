import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const MISSING_API_KEY_MSG = 'API Key lagao phir AI chalegi';

// Initialize Gemini client on server side only
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (
    !apiKey ||
    apiKey === 'PASTE_YOUR_KEY_HERE' ||
    apiKey === 'MY_GEMINI_API_KEY'
  ) {
    return null;
  }
  return new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
};

// Candidate models prioritized by live responsiveness and availability
const CANDIDATE_MODELS = Array.from(
  new Set(
    [
      process.env.GEMINI_MODEL?.trim(),
      'gemini-3-flash-preview',
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-4-hydrogen',
      'gemini-3.8-flash',
    ].filter(Boolean) as string[]
  )
);

async function generateWithFallback(
  ai: GoogleGenAI,
  contents: any,
  extraConfig: Record<string, any> = {},
  timeoutMs: number = 8000
) {
  let lastError: any = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const generatePromise = ai.models.generateContent({
        model,
        contents,
        config: extraConfig,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`Timeout: Model "${model}" did not respond in ${timeoutMs}ms`)),
          timeoutMs
        )
      );

      const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
      if (response && (response.text !== undefined || response.candidates?.length)) {
        return response;
      }
    } catch (err: any) {
      console.warn(`[Gemini] Model "${model}" failed/timed out:`, err?.message || err);
      lastError = err;
    }
  }

  console.error('[Gemini] All candidate models failed. Last error:', lastError);
  throw new Error(
    lastError?.message || 'AI server abhi masroof hai ya request fail ho gayi, dobara koshish karein.'
  );
}

/**
 * Page 1: Rotation Simulator — Compare Option A crops with Gemini AI
 */
export async function compareCropRotationWithAI(crops: string[]) {
  const ai = getGeminiClient();
  if (!ai) {
    return { error: MISSING_API_KEY_MSG };
  }

  const prompt = `Farmer in Faisalabad, Pakistan, 5 Acres, Clay Soil, Rainwater. Current rotation is ${crops.join(', ')}. Suggest better 3-year rotation to increase profit in PKR and improve soil health. Give reason in simple Urdu.`;

  const response = await generateWithFallback(ai, prompt);

  return {
    answer: (response.text ?? '').trim(),
  };
}

/**
 * Page 3: Voice & Chat Advisor for Pakistani Farmers
 * Answers ANY farming question (crop, fertilizer, water, weather, mandi rate, pest, soil)
 * in a short, simple, helpful reply in the SAME language (Urdu, Roman Urdu, Punjabi, or English).
 */
export async function getKisanAdvisorResponse(
  query: string,
  language: string = 'en',
  farmContext?: any,
  mode?: string
) {
  const ai = getGeminiClient();
  if (!ai) {
    return { error: MISSING_API_KEY_MSG };
  }

  const prompt = `You are a helpful, experienced Kisan Assistant (زرعی مشیر) for farmers in Pakistan (especially Punjab / Faisalabad).

Farmer Question: "${query}"
Farm Context (use only if relevant): ${JSON.stringify(farmContext || {})}
Input Mode: ${mode === 'simple_voice' ? 'Voice question' : `Text question (UI language hint: ${language})`}

STRICT RULES:
1. Answer ANY farming question — including any crop, fertilizer (khad/Urea/DAP/organic), irrigation/water, weather/mausam, mandi rate/crop prices, pests/diseases, or soil health.
2. Reply in the EXACT SAME language and script as the Farmer Question:
   - If the question is in Urdu script (اردو), reply in simple Urdu script.
   - If in Roman Urdu, reply in simple Roman Urdu.
   - If in Punjabi (Shahmukhi or Roman Punjabi), reply in simple Punjabi.
   - If in English, reply in simple English.
3. Keep the answer SHORT and SIMPLE: 2 to 4 brief, practical sentences like talking warmly to a farmer.
4. NEVER say "I don't know", "Mujhe nahi pata", "I cannot check", or refuse. If the user asks about mandi rates or weather, give typical current Punjab/Pakistan market price ranges or seasonal weather guidance plus a practical next step so the farmer always gets useful advice.`;

  const response = await generateWithFallback(ai, prompt);

  const outputText = (response.text ?? '').trim();
  return {
    text: outputText,
    urduText: '',
  };
}

/**
 * Page 2: Plant & Leaf Disease Detection using Multimodal Gemini AI
 */
export async function analyzeCropDiseaseImage(base64Data: string, mimeType: string = 'image/jpeg') {
  const ai = getGeminiClient();
  if (!ai) {
    return { error: MISSING_API_KEY_MSG };
  }

  const prompt = `You are a crop doctor in Pakistan. Look at this leaf photo. Tell disease name in Urdu and English, how serious, and give 3 cheap desi ilaj in simple Urdu for farmer in Faisalabad.`;

  const response = await generateWithFallback(ai, {
    parts: [
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
      { text: prompt },
    ],
  });

  return {
    answer: (response.text ?? '').trim(),
  };
}

/**
 * Page 4: Soil Intelligence & Satellite Telemetry AI Risk + 3-Year Recovery Check
 */
export async function checkSoilRiskWithAI(city: string, soilType: string, acres: number | string) {
  const ai = getGeminiClient();
  if (!ai) {
    return { error: MISSING_API_KEY_MSG };
  }

  const prompt = `Farmer in ${city}, Pakistan, Soil ${soilType}, Land ${acres} Acres. Tell Water Shortage Risk, Soil Degradation Risk, Heat Stress Risk as High, Medium or Low with 1 line reason in simple Urdu. Also give 3-year soil recovery plan.`;

  const response = await generateWithFallback(ai, prompt, {
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        waterShortageRisk: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            reasonUrdu: { type: Type.STRING },
          },
          required: ['level', 'reasonUrdu'],
        },
        soilDegradationRisk: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            reasonUrdu: { type: Type.STRING },
          },
          required: ['level', 'reasonUrdu'],
        },
        heatStressRisk: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            reasonUrdu: { type: Type.STRING },
          },
          required: ['level', 'reasonUrdu'],
        },
        recoveryPlan: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.STRING },
              title: { type: Type.STRING },
              detailUrdu: { type: Type.STRING },
            },
            required: ['year', 'title', 'detailUrdu'],
          },
        },
      },
      required: [
        'waterShortageRisk',
        'soilDegradationRisk',
        'heatStressRisk',
        'recoveryPlan',
      ],
    },
  });

  const jsonText = (response.text ?? '{}').trim();
  return JSON.parse(jsonText);
}

