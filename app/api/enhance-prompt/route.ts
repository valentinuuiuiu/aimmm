import { GoogleGenAI } from "@google/genai";
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
    const { description, category, stylePreset } = body;

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 450 }
      );
    }

    const systemInstruction = `You are a visual engineering specialist and elite art director for high-end commerce campaigns.
Your goal is to transform a basic scene description into a masterfully detailed, visually stunning artwork prompt optimized for FLUX/Stable Diffusion text-to-image models.

Structure your final output to focus on:
- High-fidelity textures (e.g. brushed metal, micro-etched titanium, glowing fibers, translucent matte silicone, premium glass).
- Professional cinematography & camera perspective (e.g. macro shot, close-up, dramatic side view, low angle depth of field, 85mm lens, F/1.4 zoom).
- Premium atmospheric lighting (e.g. soft amber studio bounce, volumetric neon beams, dynamic rim lighting, high-contrast chiaroscuro, cool cybernetic glows).
- Render or medium characteristics matching the chosen visual style preset: "${stylePreset || "Cinematic Photorealism"}".

Style Guide Rules:
1. If stylePreset is "Cinematic Photorealism": use terms like 'editorial hyperrealistic product photography, Hasselblad 100mp, sharp focus, natural volumetric shadows'.
2. If stylePreset is "Cyberpunk Noir": use terms like 'neon-drenched darkness, moody reflections in wet asphalt, dark rainy future cyber studio, high-contrast, glowing magenta and cyan HUD lines'.
3. If stylePreset is "Studio Product Shoot": use terms like 'pristine commercial catalog print, ultra-clean soft clay background, elegant minimalist aesthetic, professional product studio lighting, soft shadows'.
4. If stylePreset is "3D Octane Render": use terms like 'glossy 3D claymation, high-gloss plastic finishes, vibrant pastel color palettes, Unreal Engine 5 render, raytraced glass caustics'.
5. If stylePreset is "Anime Sci-Fi Illustration": use terms like 'vibrant future anime keyframe, detailed hand-drawn vector artwork, dramatic anime cel shading, gorgeous sci-fi sky, Makoto Shinkai style'.

Requirements:
- Your response must consist ONLY of the enhanced visual prompt.
- Do NOT add conversations, introductions, metadata, quotes, "Sure, here is your prompt" or explanations.
- Output a single, continuous, descriptive paragraph under 80 words.`;

    const userPrompt = `Enhance this basic scene: "${description}"
Product Category: "${category || "AI Tech"}"
Desired Style Preset: "${stylePreset || "Cinematic Photorealism"}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.85,
      },
    });

    if (!response.text) {
      throw new Error("Empty text received from Gemini.");
    }

    const enhancedPrompt = response.text.trim().replace(/^["']|["']$/g, ""); // Clean any wrapping quotes

    return NextResponse.json({ enhancedPrompt });
  } catch (err: any) {
    console.error("Enhance visual prompt API Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to enhance visual prompt" },
      { status: 500 }
    );
  }
}
