import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, productDesc, tone, audience, videoFormat } = body;

    if (!productName) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an elite Shopify Marketing & Video Ads Director.
Your task is to craft a highly persuasive, conversion-focused short video ad script (15-30 seconds) for a smart tech product from the store ai-market.online.
The video format is: ${videoFormat || "9:16 portrait (Vertical TikTok/Shorts)"}.
The tone of the campaign must be: ${tone || "Futuristic Hype"}.
The target audience is: ${audience || "Tech Enthusiasts & Innovators"}.

Structure the video script into exactly 5 narrative scenes:
1. Hook: A disruptive visual and audio attention hook (0-4s).
2. Problem: Address the core relatable friction point or desire (4-8s).
3. Solution: Introduce the product as the ultimate smart tech answer (8-13s).
4. Features: Show off the major product benefit/features in action (13-20s).
5. Call to Action (CTA): Relentless urge to buy now at ai-market.online (20-25s).

For each scene, output:
- Voiceover dialogue (natural, punchy spoken text)
- Kinetic visual text overlay (3-6 words, high-contrast typography, extremely punchy)
- Duration in seconds (3 to 5 seconds)
- Sugested visual effect (zoom-in, slide-left, bounce-in, panic-shake, pulsate, glow-flash)
- Scene layout description.`;

    const userPrompt = `Develop a video ad campaign script for:
Product Name: "${productName}"
Product Description/Concept: "${productDesc || "A smart high-tech product sold at ai-market.online"}"
Tone: "${tone}"
Audience: "${audience}"
Format: "${videoFormat}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            campaignName: {
              type: Type.STRING,
              description: "A flashy marketing name for this video project.",
            },
            productName: {
              type: Type.STRING,
              description: "The name of the target product.",
            },
            tagline: {
              type: Type.STRING,
              description: "A super punchy one-liner tagline for the campaign.",
            },
            tone: {
              type: Type.STRING,
              description: "The tone used.",
            },
            audience: {
              type: Type.STRING,
              description: "The targeted demographic.",
            },
            musicVibe: {
              type: Type.STRING,
              description: "Recommended music genre or style (e.g. Cyberpunk Synth, Skincare Ambient).",
            },
            slides: {
              type: Type.ARRAY,
              description: "The list of exactly 5 sequential video scenes.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: {
                    type: Type.INTEGER,
                    description: "Sequential scene layout frame ID (1-5).",
                  },
                  sceneType: {
                    type: Type.STRING,
                    description: "Hook, Problem, Solution, Features, or CTA.",
                  },
                  dialogue: {
                    type: Type.STRING,
                    description: "The exact voiceover script text to read out.",
                  },
                  visualText: {
                    type: Type.STRING,
                    description: "3 to 6 words maximum in all caps to be flashed on the screen.",
                  },
                  durationSec: {
                    type: Type.INTEGER,
                    description: "The scene length in seconds (3, 4, or 5).",
                  },
                  visualEffect: {
                    type: Type.STRING,
                    description: "The transition effect (e.g. zoom-in, move-up, shake, pulse-glow).",
                  },
                  colorPreset: {
                    type: Type.STRING,
                    description: "Tailwind background gradient preset (e.g. from-violet-950 to-black).",
                  },
                  description: {
                    type: Type.STRING,
                    description: "Detailed prompt-like description of the visual scene frame content.",
                  },
                },
                required: [
                  "id",
                  "sceneType",
                  "dialogue",
                  "visualText",
                  "durationSec",
                  "visualEffect",
                  "colorPreset",
                  "description",
                ],
              },
            },
          },
          required: [
            "campaignName",
            "productName",
            "tagline",
            "tone",
            "audience",
            "musicVibe",
            "slides",
          ],
        },
      },
    });

    if (!response.text) {
      throw new Error("Empty text response received from Gemini model.");
    }
    const parsedResult = JSON.parse(response.text.trim());
    return NextResponse.json(parsedResult);
  } catch (err: any) {
    console.error("Campaign generator API Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate video script campaign" },
      { status: 500 }
    );
  }
}
