import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getKisanAdvisorResponse,
  analyzeCropDiseaseImage,
  compareCropRotationWithAI,
  checkSoilRiskWithAI,
} from './src/server/geminiService.ts';
import { fetchNasaSatelliteEvidence } from './src/utils/nasaData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '25mb' }));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'CropRotation Pakistan API',
      region: 'Faisalabad, Punjab',
      timestamp: new Date().toISOString(),
    });
  });

  // Page 1: Rotation Simulator Compare with AI Endpoint
  app.post('/api/gemini/rotation-compare', async (req, res) => {
    try {
      const { crops } = req.body || {};
      if (!Array.isArray(crops) || crops.length === 0) {
        return res.status(400).json({ error: 'Option A crops are required' });
      }
      const result = await compareCropRotationWithAI(crops);
      if ('error' in result && result.error) {
        return res.status(400).json({ error: result.error });
      }
      res.json(result);
    } catch (error: any) {
      console.error('Rotation compare API route error:', error);
      res.status(500).json({ error: error.message || 'Failed to compare crop rotation' });
    }
  });

  // Page 3: Kisan Voice / Chat Assistant Endpoint
  app.post('/api/gemini/advisor', async (req, res) => {
    try {
      const { query, language, farmContext, mode } = req.body || {};
      if (!query) {
        return res.status(400).json({ error: 'Query prompt is required' });
      }
      const result = await getKisanAdvisorResponse(query, language, farmContext, mode);
      if ('error' in result && result.error) {
        return res.status(400).json({ error: result.error });
      }
      res.json(result);
    } catch (error: any) {
      console.error('Advisor API route error:', error);
      res.status(500).json({ error: error.message || 'Failed to process AI advisor request' });
    }
  });

  // Page 2: Leaf / Plant Disease Detection Endpoint (Multimodal Gemini 3.8 Flash)
  app.post('/api/gemini/disease', async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body || {};
      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ error: 'Photo upload karo aur Check dabao' });
      }

      let cleanBase64 = '';
      let resolvedMimeType = mimeType || 'image/jpeg';

      if (imageBase64.startsWith('http://') || imageBase64.startsWith('https://')) {
        const imgRes = await fetch(imageBase64);
        if (!imgRes.ok) {
          return res.status(400).json({ error: 'Failed to load sample image' });
        }
        resolvedMimeType = imgRes.headers.get('content-type') || 'image/jpeg';
        const arrayBuf = await imgRes.arrayBuffer();
        cleanBase64 = Buffer.from(arrayBuf).toString('base64');
      } else {
        const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
        if (match) {
          resolvedMimeType = match[1];
        }
        cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      }

      const result = await analyzeCropDiseaseImage(cleanBase64, resolvedMimeType);
      if ('error' in result && result.error) {
        return res.status(400).json({ error: result.error });
      }
      res.json(result);
    } catch (error: any) {
      console.error('Disease detection API error:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze crop image' });
    }
  });

  // Page 4: Soil Intelligence & Satellite Telemetry AI Risk Check Endpoint
  app.post('/api/gemini/soil-check', async (req, res) => {
    try {
      const { city, soilType, acres } = req.body || {};
      const result = await checkSoilRiskWithAI(
        city || 'Faisalabad',
        soilType || 'Clay',
        acres ?? 5
      );
      if ('error' in result && result.error) {
        return res.status(400).json({ error: result.error });
      }
      res.json(result);
    } catch (error: any) {
      console.error('Soil check API error:', error);
      res.status(500).json({ error: error.message || 'Failed to evaluate soil risk with AI' });
    }
  });

  // NASA Earth Observation Satellite Data Endpoint
  app.get('/api/nasa/earth-data', async (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string) || 31.4504;
      const lng = parseFloat(req.query.lng as string) || 73.1350;
      const data = await fetchNasaSatelliteEvidence({ lat, lng });
      res.json(data);
    } catch (error: any) {
      console.error('NASA data route error:', error);
      res.status(500).json({ error: error.message || 'Failed to retrieve NASA Earth observation data' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vitePromise = import('vite').then(({ createServer }) =>
      createServer({
        server: { middlewareMode: true },
        appType: 'spa',
      })
    );

    app.use(async (req, res, next) => {
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Bind port 3000 immediately so dev server readiness checks succeed right away
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CropRotation server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
