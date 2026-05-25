"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Volume2,
  VolumeX,
  Radio,
  Video,
  Monitor,
  Tv,
  Eye,
  Settings,
  Flame,
  User,
  Copy,
  Check,
  Edit,
  Globe,
  Plus,
  RefreshCw,
  Sliders,
  Speaker,
  Wand2,
  Dices,
  Download,
  Film,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface StoryboardSlide {
  id: number;
  sceneType: string; // Hook, Problem, Solution, Features, CTA
  dialogue: string; // Narration script
  visualText: string; // Large typography to overlay
  durationSec: number; // Duration of slide
  visualEffect: string; // zoom-in, slide-left, panic-shake, pulsate, glow-flash
  colorPreset: string; // Background visual style
  description: string; // Prompt description
  seed?: number;        // Seed for Pollinations AI
  stylePreset?: string; // Creative style overwrite
}

interface Campaign {
  campaignName: string;
  productName: string;
  tagline: string;
  tone: string;
  audience: string;
  musicVibe: string;
  slides: StoryboardSlide[];
}

interface ProductPreset {
  name: string;
  price: string;
  category: string;
  shortDesc: string;
  bulletPoints: string[];
  seed: string; 
  accentColor: string;
  url: string;
}

// --- Verified Products list from ai-market.online ---
const verifiedProducts: ProductPreset[] = [
  {
    name: "AURORA: AI Red Light Therapy Face Mask",
    price: "$149.00",
    category: "Skincare Tech",
    shortDesc: "LED photon emission technology targeting deep skin revitalization with customized lightwave patterns.",
    bulletPoints: [
      "Customizable therapeutic LED wavelengths",
      "Wireless lightweight facial protection outline",
      "Improves skin elastic index & minimizes lines",
      "Ergonomic safe eye-port vision design"
    ],
    seed: "skincare-mask",
    accentColor: "from-rose-500 to-pink-600",
    url: "https://ai-market.online/collections/all"
  },
  {
    name: "HERA AI Smart Ring",
    price: "$199.00",
    category: "Healthcare Wearables",
    shortDesc: "Premium titanium health tracking ring measuring oxygen levels, heart-rate variation, and sleep stages.",
    bulletPoints: [
      "Ultra-lightweight titanium black armor",
      "Continuous blood-oxygen & stress diagnostics",
      "Advanced sleep scoring & temperature metrics",
      "IPX8 waterproof body engineered for 24/7 wear"
    ],
    seed: "smart-ring",
    accentColor: "from-purple-500 to-indigo-600",
    url: "https://ai-market.online/collections/all"
  },
  {
    name: "ECHO: AI Voice Recorder & Real-Time Translator",
    price: "$129.00",
    category: "Productivity Tools",
    shortDesc: "Compact digital voice capturer with on-device transcription and instant multi-language audio conversion.",
    bulletPoints: [
      "Dynamic acoustic transcription dashboard",
      "Instant translation in over 120 languages",
      "Intelligent dual-mic directional noise filter",
      "Sleek aerospace carbon-fiber framework"
    ],
    seed: "voice-recorder",
    accentColor: "from-blue-500 to-cyan-600",
    url: "https://ai-market.online/collections/all"
  },
  {
    name: "NEBULA: 4K Smart Portable Projector",
    price: "$249.00",
    category: "Smart Home Cinema",
    shortDesc: "Premium miniature cinema projector with automated keystone correction and integrated streaming apps.",
    bulletPoints: [
      "Crisp ultra-luminous 4K cinema projection",
      "Automated trapezoid & focus calibration",
      "Surround-sound acoustic smart speakers built-in",
      "Compact carry handle for movie nights anywhere"
    ],
    seed: "portable-projector",
    accentColor: "from-amber-500 to-orange-600",
    url: "https://ai-market.online/collections/all"
  },
  {
    name: "AURACLE: Smart Visual Ear Otoscope",
    price: "$59.00",
    category: "Personal Wellness",
    shortDesc: "Ultra-sharp 1296P microscopic safety camera with warm temperature stability and dynamic wellness app.",
    bulletPoints: [
      "Microscopic 1296P panoramic video stream",
      "Constant soothing ear-canal temperature control",
      "Surgical-grade replaceable elastic tips",
      "Sync iOS & Android safety monitoring views"
    ],
    seed: "ear-otoscope",
    accentColor: "from-emerald-500 to-teal-600",
    url: "https://ai-market.online/collections/all"
  },
  {
    name: "Lenovo AI Translation Smart Glasses",
    price: "$189.00",
    category: "Augmented Vision",
    shortDesc: "Smart heads-up translation eyepiece overlays instant target subtitles over real world conversations.",
    bulletPoints: [
      "HUD holographic subtitle overlay projection",
      "Real-time speaker audio-transcription HUD",
      "Aerospace bone-conduction stereo sound",
      "UV protection tinted blue-light filtration lens"
    ],
    seed: "smart-glasses",
    accentColor: "from-violet-500 to-purple-600",
    url: "https://ai-market.online/collections/all"
  },
  {
    name: "PULSE: AI Pocket ECG Monitor",
    price: "$119.00",
    category: "Medical Tech",
    shortDesc: "Pocket-sized heart rhythm tracker for immediate clinical grade feedback sent securely to your cardiologist.",
    bulletPoints: [
      "Instant medical-grade ECG trace printouts",
      "Advanced arrhythmia and tachycardia sensors",
      "Secure encrypted health report PDF generation",
      "Lanyard clasp for emergency cardiac tests anywhere"
    ],
    seed: "pocket-ecg",
    accentColor: "from-red-500 to-rose-600",
    url: "https://ai-market.online/collections/all"
  },
  {
    name: "MOTUS: AI Smart Curtain Opener",
    price: "$79.00",
    category: "IoT Home Automation",
    shortDesc: "Instantly retrofit custom schedule-driven sunlight opening tracks to standard curtain rods.",
    bulletPoints: [
      "Attaches to regular curtain poles in 30 seconds",
      "Schedules waking positions matching sunlight angle",
      "Integrates with Google Home / Amazon Alexa voice",
      "Heavy duty motor pulling up to 12kg fabric"
    ],
    seed: "smart-curtain",
    accentColor: "from-yellow-500 to-amber-600",
    url: "https://ai-market.online/collections/all"
  }
];

// Default Campaign placeholder (already enriched with seeds)
const defaultStoryboard: Campaign = {
  campaignName: "Hera Smart Ring Core Debut",
  productName: "HERA AI Smart Ring",
  tagline: "Your Entire Health. Beautifully Circled.",
  tone: "Futuristic & Premium Hype",
  audience: "Biohackers, Professionals & Tech Pioneers",
  musicVibe: "Cyberpunk Synth Wave Electro",
  slides: [
    {
      id: 1,
      sceneType: "Hook",
      dialogue: "Forget heavy bulky smart watches. The absolute future of your personal bio-tracking has shrunk into this single band...",
      visualText: "THE FUTURE IS TINY",
      durationSec: 4,
      visualEffect: "zoom-in",
      colorPreset: "from-zinc-950 via-neutral-900 to-indigo-950",
      description: "A dark beautiful shadow profile view of a glowing sleek titanium health ring on a finger, with abstract light-streaks speeding past",
      seed: 1205,
      stylePreset: "Cinematic Photorealism"
    },
    {
      id: 2,
      sceneType: "Problem",
      dialogue: "Strap-on sports watches look awkward, drain quickly, and pinch your skin. Why should tracking your health feel like an absolute chore?",
      visualText: "AWKWARD NO MORE",
      durationSec: 4,
      visualEffect: "panic-shake",
      colorPreset: "from-zinc-950 via-neutral-900 to-rose-950",
      description: "Frustrated modern creator staring at a clumsy bright smartwatch screen flashing alerts, contrasty shadows, moody colors",
      seed: 8491,
      stylePreset: "Cinematic Photorealism"
    },
    {
      id: 3,
      sceneType: "Solution",
      dialogue: "Meet the Hera AI Smart Ring. Meticulously sculpted out of pure lightweight aerospace titanium black.",
      visualText: "MEET HERA SMART RING",
      durationSec: 4,
      visualEffect: "pulsate",
      colorPreset: "from-zinc-950 via-zinc-900 to-violet-950",
      description: "A pristine macro catalog rendering of the HERA smart ring, rotating in slow motion, highlighting a polished space-grade titanium texture",
      seed: 3912,
      stylePreset: "Cinematic Photorealism"
    },
    {
      id: 4,
      sceneType: "Features",
      dialogue: "It continuously measures your precise blood-oxygen, real-time stress scales, and calculates deep deep sleep repair scores automatically.",
      visualText: "BIOMETRIC POWERHOUSE",
      durationSec: 5,
      visualEffect: "glow-flash",
      colorPreset: "from-zinc-950 via-slate-900 to-blue-950",
      description: "Abstract digital visualization of health metrics dashboard. Ethereal waves representing heart pattern, sleep grids, and tech HUDs",
      seed: 7300,
      stylePreset: "Cinematic Photorealism"
    },
    {
      id: 5,
      sceneType: "CTA",
      dialogue: "Level up your daily potential now. Claim Yours on ai-market.online and use discount coupon code SHINE10 today!",
      visualText: "CLAIM REBATE. GO SMART",
      durationSec: 5,
      visualEffect: "slide-left",
      colorPreset: "from-zinc-950 via-indigo-950 to-purple-950",
      description: "A gorgeous glowing showcase card displaying ai-market.online in modern typography, surrounding an elegant smart ring box set",
      seed: 5493,
      stylePreset: "Cinematic Photorealism"
    }
  ]
};

export default function AIStoreCampaignStudio() {
  // --- States ---
  const [selectedProduct, setSelectedProduct] = useState<ProductPreset>(verifiedProducts[1]); 
  const [campaignTone, setCampaignTone] = useState<string>("Futuristic & Premium Hype");
  const [targetAudience, setTargetAudience] = useState<string>("Tech Pioneers & Wellness Enthusiasts");
  const [videoFormat, setVideoFormat] = useState<"9:16" | "16:9">("9:16");
  const [campaignStylePreset, setCampaignStylePreset] = useState<string>("Cinematic Photorealism");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [campaign, setCampaign] = useState<Campaign>(defaultStoryboard);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [voiceSynthesisEnabled, setVoiceSynthesisEnabled] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isEditingSlide, setIsEditingSlide] = useState<number | null>(null);

  // Loading states for specialized slide features
  const [isEnhancingSlideId, setIsEnhancingSlideId] = useState<number | null>(null);

  // Custom product adding fields
  const [isAddingCustom, setIsAddingCustom] = useState<boolean>(false);
  const [customName, setCustomName] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customPrice, setCustomPrice] = useState("$99.00");
  const [customCategory, setCustomCategory] = useState("AI Gadget");

  const [productsList, setProductsList] = useState<ProductPreset[]>(verifiedProducts);

  // --- Refs for audio synthesize beat ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthesizerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute total campaign duration
  const totalDuration = campaign.slides.reduce((acc, curr) => acc + curr.durationSec, 0);

  // Find slide index by accumulated time
  const getSlideIndexByTime = (time: number): number => {
    let sum = 0;
    for (let i = 0; i < campaign.slides.length; i++) {
      sum += campaign.slides[i].durationSec;
      if (time < sum) return i;
    }
    return campaign.slides.length - 1;
  };

  const currentSlideIndex = getSlideIndexByTime(playbackTime);

  // Get start offset of a specific slide index
  const getSlideStartTime = (index: number): number => {
    let sum = 0;
    for (let i = 0; i < index; i++) {
      sum += campaign.slides[i].durationSec;
    }
    return sum;
  };

  // --- Voice Synthesis implementation ---
  const lastSpokenIndexRef = useRef<number>(-1);

  const speakSlideDialogue = (slideIndex: number) => {
    if (!voiceSynthesisEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    
    // Stop ongoing speech
    window.speechSynthesis.cancel();
    
    const slide = campaign.slides[slideIndex];
    if (!slide) return;
    
    const utterance = new SpeechSynthesisUtterance(slide.dialogue);
    
    // Pick a neat representation voice if possible
    const voices = window.speechSynthesis.getVoices();
    const desiredVoice = voices.find(v => 
      v.name.includes("Google US English") || 
      v.name.includes("Natural") || 
      v.lang.startsWith("en-")
    );
    if (desiredVoice) utterance.voice = desiredVoice;
    
    utterance.rate = 1.05; // Energetic pacing
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
    lastSpokenIndexRef.current = slideIndex;
  };

  // Trigger speech when slide index changes during active playback
  useEffect(() => {
    if (isPlaying && currentSlideIndex !== lastSpokenIndexRef.current) {
      speakSlideDialogue(currentSlideIndex);
    }
  }, [currentSlideIndex, isPlaying]);

  // --- Web Audio Synthetic Cyber Soundtrack Maker ---
  const initWebAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    } catch (e) {
      console.error("Web Audio failed to initialize:", e);
    }
  };

  const playSynthesizerBeat = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    let beatStep = 0;
    synthesizerIntervalRef.current = setInterval(() => {
      if (!audioEnabled || ctx.state === "suspended") return;

      const now = ctx.currentTime;
      
      // Heavy Cyber Kick
      if (beatStep % 4 === 0 || beatStep % 4 === 2) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(95, now);
        osc.frequency.exponentialRampToValueAtTime(36, now + 0.22);
        
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        
        osc.start(now);
        osc.stop(now + 0.28);
      }

      // Tech Ticking
      if (beatStep % 2 === 1) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(beatStep % 4 === 1 ? 920 : 1240, now);
        
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        
        osc.start(now);
        osc.stop(now + 0.09);
      }

      // Synth Chord Swell
      if (beatStep % 8 === 0) {
        const chordFreqs = [196, 233, 293, 349]; // atmospheric chords
        chordFreqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq / 2, now); // atmospheric sub base
          
          // Low pass filter to make it lush and non-abrasive
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(320, now);
          
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.06, now + 0.6);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.3);
          
          osc.start(now);
          osc.stop(now + 2.4);
        });
      }

      beatStep = (beatStep + 1) % 16;
    }, 450);
  };

  const stopSynthesizerBeat = () => {
    if (synthesizerIntervalRef.current) {
      clearInterval(synthesizerIntervalRef.current);
      synthesizerIntervalRef.current = null;
    }
  };

  // Toggle Soundtrack Audio
  const handleAudioToggle = () => {
    if (!audioEnabled) {
      initWebAudio();
      setAudioEnabled(true);
    } else {
      setAudioEnabled(false);
    }
  };

  // Audio effect triggers on changes
  useEffect(() => {
    if (audioEnabled) {
      playSynthesizerBeat();
    } else {
      stopSynthesizerBeat();
    }
    return () => stopSynthesizerBeat();
  }, [audioEnabled]);

  // Handle Play/Pause Timeline loops
  useEffect(() => {
    if (isPlaying) {
      speakSlideDialogue(getSlideIndexByTime(playbackTime));
      
      playbackTimerRef.current = setInterval(() => {
        setPlaybackTime((prev) => {
          const nextTime = Number((prev + 0.1).toFixed(1));
          if (nextTime >= totalDuration) {
            setIsPlaying(false);
            if (typeof window !== "undefined" && window.speechSynthesis) {
              window.speechSynthesis.cancel();
            }
            return 0; // Reset
          }
          return nextTime;
        });
      }, 100);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }

    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying, totalDuration]);

  const activeSlide = campaign.slides[currentSlideIndex] || campaign.slides[0];

  // Helper to append styling instructions and shape the Pollinations dynamic URL
  const getPollinationsUrl = (slide: StoryboardSlide) => {
    const promptText = slide.description || "Stunning product visualization";
    let styleTags = "";

    switch (campaignStylePreset) {
      case "Cyberpunk Noir":
        styleTags = "neon-drenched dark atmosphere, futuristic glowing cyberpunk hardware, wet glossy surfaces, moody pink and cold cyan rim lights, photorealistic 3D render, 8k depth of field";
        break;
      case "Studio Product Shoot":
        styleTags = "pristine high-end product photography, professional catalog commercial lighting, elegant soft minimalist background, neutral sand tone canvas, diffuse soft lighting, hyperdetailed lens focus, 8k";
        break;
      case "3D Octane Render":
        styleTags = "glossy 3D claymation design, premium Octane render look, stylized toy proportions, vibrant pastel accents, Unreal Engine 5 aesthetic, beautiful glossy plastic materials, ambient occlusion";
        break;
      case "Anime Sci-Fi Illustration":
        styleTags = "gorgeous retro sci-fi anime keyframe, hand-drawn vector art illustration, vivid colors, beautiful starry sky, detailed cel shading, Makoto Shinkai layout direction";
        break;
      case "Cinematic Photorealism":
      default:
        styleTags = "editorial premium hyperrealistic marketing photography, Hasselblad 100mp, high-fidelity lens depth of field, sharp focus, side rim volumetric shadows, golden hour studio lighting, 8k resolution";
        break;
    }

    const fullPrompt = `${promptText}, ${selectedProduct.name}, ${styleTags}`.trim();
    const seed = slide.seed || (42 + slide.id);
    return `https://image.pollinations.ai/p/${encodeURIComponent(fullPrompt)}?width=800&height=800&seed=${seed}&nologo=true`;
  };

  // Safe image download trigger
  const handleDownloadSlideImage = async (slide: StoryboardSlide) => {
    const url = getPollinationsUrl(slide);
    const filename = `${selectedProduct.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_scene_${slide.id}.jpg`;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  // Randomize a state seed to trigger dynamic image recreation
  const handleRollSlideSeed = (slideId: number) => {
    const updatedSlides = campaign.slides.map((s) => {
      if (s.id === slideId) {
        return { ...s, seed: Math.floor(Math.random() * 99999) + 1 };
      }
      return s;
    });
    setCampaign({ ...campaign, slides: updatedSlides });
  };

  // Enhance scene description into master design instructions using server endpoint
  const handleEnhanceSlidePrompt = async (slideId: number, baseDesc: string) => {
    setIsEnhancingSlideId(slideId);
    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: baseDesc,
          category: selectedProduct.category,
          stylePreset: campaignStylePreset
        })
      });

      if (!response.ok) {
        throw new Error("Enhancement failed");
      }

      const data = await response.json();
      if (data.enhancedPrompt) {
        const updatedSlides = campaign.slides.map((s) => {
          if (s.id === slideId) {
            return { 
              ...s, 
              description: data.enhancedPrompt,
              seed: Math.floor(Math.random() * 9999) + 1 // trigger refreshing with alternative layout
            };
          }
          return s;
        });
        setCampaign({ ...campaign, slides: updatedSlides });
      }
    } catch (err) {
      console.error("Failed to enhance prompt with Gemini:", err);
      // fallback silent alert
    } finally {
      setIsEnhancingSlideId(null);
    }
  };

  // --- Campaign AI generator trigger ---
  const handleGenerateCampaign = async () => {
    setIsGenerating(true);
    setIsPlaying(false);
    setPlaybackTime(0);
    lastSpokenIndexRef.current = -1;

    try {
      const response = await fetch("/api/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: selectedProduct.name,
          productDesc: `${selectedProduct.shortDesc} Details: ${selectedProduct.bulletPoints.join(", ")}`,
          tone: campaignTone,
          audience: targetAudience,
          videoFormat: videoFormat === "9:16" ? "9:16 portrait (Vertical Short/TikTok)" : "16:9 Landscape (Widescreen)",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach script generator API.");
      }

      const generatedData = await response.json();
      if (generatedData && generatedData.slides && generatedData.slides.length === 5) {
        // Hydrate slides with seed attributes
        const populatedSlides = generatedData.slides.map((s: any, idx: number) => ({
          ...s,
          seed: Math.floor(Math.random() * 98990) + 1000 + idx * 45,
          stylePreset: campaignStylePreset
        }));
        setCampaign({
          ...generatedData,
          slides: populatedSlides
        });
      } else {
        throw new Error("Returned campaign model is malformed.");
      }
    } catch (err) {
      console.error("AI campaign generation failed, triggering high quality offline generator:", err);
      generateOfflineCampaign();
    } finally {
      setIsGenerating(false);
    }
  };

  // Highly advanced local heuristics template generator 
  const generateOfflineCampaign = () => {
    const craftedSlides: StoryboardSlide[] = [
      {
        id: 1,
        sceneType: "Hook",
        dialogue: `Stop scrolling! If you care about game-changing gadgets, you need to see what ${selectedProduct.name} is doing to revolutionize ${selectedProduct.category}.`,
        visualText: "THE COLD FUTURE REVEALED",
        durationSec: 4,
        visualEffect: "zoom-in",
        colorPreset: "from-zinc-950 to-neutral-900",
        description: `Stunning close-up view of ${selectedProduct.name} shining in high-contrast cinematic side lighting, volumetric dark studio background`,
        seed: Math.floor(Math.random() * 10000) + 1,
        stylePreset: campaignStylePreset
      },
      {
        id: 2,
        sceneType: "Problem",
        dialogue: `We are exhausted by generic tech that claims to change lives but drains your focus and cracks on day three.`,
        visualText: "THE OLD WAY COMPROMISES",
        durationSec: 4,
        visualEffect: "panic-shake",
        colorPreset: "from-rose-950 to-neutral-950",
        description: "Clumsy old cords tangled next to an oversized battery pack, monochrome moody lighting",
        seed: Math.floor(Math.random() * 10000) + 1,
        stylePreset: campaignStylePreset
      },
      {
        id: 3,
        sceneType: "Solution",
        dialogue: `Enter the pristine ${selectedProduct.name}. Architecturally sculpted, lightweight, and engineered for your lifestyle, starting at just ${selectedProduct.price}.`,
        visualText: `MEET ${selectedProduct.name.split(":")[0]}`,
        durationSec: 4,
        visualEffect: "pulsate",
        colorPreset: "from-slate-900 to-indigo-950",
        description: `Slow macro gliding tracking shot highlighting the elegant premium chassis curves and high tech integrity of ${selectedProduct.name}`,
        seed: Math.floor(Math.random() * 10000) + 1,
        stylePreset: campaignStylePreset
      },
      {
        id: 4,
        sceneType: "Features",
        dialogue: `Featuring: ${selectedProduct.bulletPoints[0]}, and fully customized with ${selectedProduct.bulletPoints[1]}. Live smarter.`,
        visualText: "PREMIUM HUMAN METRICS",
        durationSec: 5,
        visualEffect: "glow-flash",
        colorPreset: "from-zinc-950 via-teal-950 to-blue-950",
        description: `Detailed glowing holographic HUD dashboard overlaying stats and biometric lines indicating supreme design of ${selectedProduct.name}`,
        seed: Math.floor(Math.random() * 10000) + 1,
        stylePreset: campaignStylePreset
      },
      {
        id: 5,
        sceneType: "CTA",
        dialogue: `Transform your ritual now. Secure Yours on ai-market.online today and redeem code SPOTLIGHT on checkout for free tracking extensions!`,
        visualText: "GO SMART. SHOP NOW",
        durationSec: 5,
        visualEffect: "slide-left",
        colorPreset: "from-neutral-950 to-violet-950",
        description: `Premium stylized box-set display showing the official ai-market.online online URL beautifully rendered, golden flares`,
        seed: Math.floor(Math.random() * 10000) + 1,
        stylePreset: campaignStylePreset
      }
    ];

    setCampaign({
      campaignName: `${selectedProduct.name.split(":")[0]} Ad Strategy`,
      productName: selectedProduct.name,
      tagline: selectedProduct.shortDesc,
      tone: campaignTone,
      audience: targetAudience,
      musicVibe: "Cinematic Neo-retro ambient synthesizer beat",
      slides: craftedSlides
    });
  };

  // Sync slides style preset if global preset changes
  useEffect(() => {
    const updated = campaign.slides.map(s => ({
      ...s,
      stylePreset: campaignStylePreset
    }));
    setCampaign(prev => ({ ...prev, slides: updated }));
  }, [campaignStylePreset]);

  // Handle slide input edits
  const handleUpdateSlideField = (slideId: number, field: keyof StoryboardSlide, value: any) => {
    const updatedSlides = campaign.slides.map((s) => {
      if (s.id === slideId) {
        return { ...s, [field]: value };
      }
      return s;
    });
    setCampaign({ ...campaign, slides: updatedSlides });
  };

  // Add custom products
  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customDesc) return;

    const newPrd: ProductPreset = {
      name: customName,
      price: customPrice,
      category: customCategory,
      shortDesc: customDesc,
      bulletPoints: ["Seamless direct API integrations", "Highly optimized metrics feedback", "Lightweight tactical casing protection"],
      seed: "custom-gadget",
      accentColor: "from-amber-600 to-red-600",
      url: "https://ai-market.online"
    };

    const nextList = [newPrd, ...productsList];
    setProductsList(nextList);
    setSelectedProduct(newPrd);
    setIsAddingCustom(false);
    setCustomName("");
    setCustomDesc("");
  };

  // Copy Markdown script to clipboard
  const handleCopyMarkdown = () => {
    const md = `
# Promotion Ad Campaign Master Deck: ${campaign.campaignName}
**Product:** ${campaign.productName}
**Retail Cost:** ${selectedProduct.price}
**Tagline:** ${campaign.tagline}
**Audience Interest Group:** ${campaign.audience}
**Aesthetic Style Preset:** ${campaignStylePreset}
**Audio Vibe Blueprint:** ${campaign.musicVibe}

---

${campaign.slides.map(s => `
### Scene ${s.id}: [${s.sceneType}] (${s.durationSec}s)
* **Monologue Script:** "${s.dialogue}"
* **On-Screen High Contrast Overlays:** "${s.visualText}"
* **Motion Effect:** ${s.visualEffect}
* **Active Art Generation Prompt for Media Creators:** "${s.description}"
* **Calculated Pollinations Image Asset URL:** ${getPollinationsUrl(s)}
`).join("\n")}
    `;

    navigator.clipboard.writeText(md.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Calculate subtle dynamic Ken Burns effect coordinates based on play timeline progress
  const getProgressStyles = () => {
    if (!isPlaying) return { transform: "scale(1.0) translate(0px, 0px)" };
    
    const currentSlideStartTime = getSlideStartTime(currentSlideIndex);
    const activeSlideData = campaign.slides[currentSlideIndex];
    const duration = activeSlideData ? activeSlideData.durationSec : 4;
    const progress = Math.min(Math.max((playbackTime - currentSlideStartTime) / duration, 0), 1);
    
    // Ken Burns zoom scale from 1.0 to 1.12
    const scale = 1.0 + progress * 0.12; 
    
    // Slight camera glide/translation depending on the visual effect chosen
    let x = 0;
    let y = 0;
    
    const effect = activeSlideData ? activeSlideData.visualEffect : "zoom-in";
    if (effect === "slide-left") {
      x = progress * -18;
    } else if (effect === "panic-shake") {
      // Simulate micro tremors matching timing
      x = Math.sin(playbackTime * 45) * 3;
      y = Math.cos(playbackTime * 45) * 3;
    } else if (effect === "pulsate") {
      // Gentle breathing wave
      const wave = Math.sin(playbackTime * Math.PI) * 0.02;
      return { transform: `scale(${scale + wave}) translate(0px, 0px)` };
    }
    
    return { transform: `scale(${scale}) translate(${x}px, ${y}px)`, transition: "transform 0.1s linear" };
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-purple-600 selection:text-white pb-20">
      
      {/* BRAND HEADER BANNER */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 top to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
              <Film className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                AI Commercial Creator Pro
                <span className="text-[9px] font-mono text-zinc-400 border border-zinc-800 px-1.5 py-0.5 bg-zinc-900/50 rounded">
                  FLUX powered
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs text-zinc-400 font-mono hidden md:inline">
              Shopify Channel: <strong className="text-emerald-400">ai-market.online</strong>
            </span>
            <a
              href="https://ai-market.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-zinc-900 hover:bg-zinc-855 border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-zinc-400" />
              Visit Shopify Store
            </a>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE PANEL GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: BRAND CATALOG & AI SCRIPT CONFIGURATION (COL 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* BRAND CATALOG WHEEL CARD */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 backdrop-blur-sm shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-purple-500" />
                  1. Brand Smart Catalog
                </h3>
                
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(!isAddingCustom)}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {isAddingCustom ? "Show Catalog" : "Custom Shopify Item"}
                </button>
              </div>

              {isAddingCustom ? (
                <form onSubmit={handleAddCustomProduct} className="space-y-4 pt-1 bg-zinc-950/40 p-4 rounded-lg border border-zinc-850">
                  <h4 className="text-xs font-semibold text-purple-400">Configure Custom Product Preset</h4>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smart LED Mask Dual"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-xs px-2.5 py-2 text-zinc-200 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Pricing Format</label>
                      <input
                        type="text"
                        placeholder="$99.00"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-xs px-2.5 py-2 text-zinc-200 focus:border-purple-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Market Category</label>
                      <input
                        type="text"
                        placeholder="Smart Home"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-xs px-2.5 py-2 text-zinc-200 focus:border-purple-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Key Value Proposition</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Seamless cellular voice tracking with instant localized translations to any smart output gadget."
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-xs px-2.5 py-2 text-zinc-200 focus:border-purple-500 focus:outline-none resize-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-md text-xs hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-1.5"
                  >
                    Add Custom Brand Preset
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 max-h-[174px] overflow-y-auto pr-1 gap-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {productsList.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => {
                          setSelectedProduct(prod);
                        }}
                        className={cn(
                          "w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all",
                          selectedProduct.name === prod.name
                            ? "bg-purple-950/20 border-purple-500 text-purple-200 shadow-md shadow-purple-500/5"
                            : "bg-zinc-950/40 border-zinc-900 hover:bg-zinc-900/30 text-zinc-400"
                        )}
                        type="button"
                      >
                        <div className="flex flex-col pr-2">
                          <span className="font-semibold text-zinc-200 line-clamp-1">{prod.name}</span>
                          <span className="text-[10px] text-zinc-500 mt-0.5">{prod.category} — {prod.price}</span>
                        </div>
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          selectedProduct.name === prod.name ? "bg-purple-500 animate-pulse" : "bg-transparent"
                        )} />
                      </button>
                    ))}
                  </div>

                  {/* ACTIVE PRODUCT ATTRIBUTE DETAILS */}
                  <div className="p-3.5 bg-zinc-950/60 rounded-lg border border-zinc-905">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full bg-purple-600/5 uppercase tracking-wider">
                        {selectedProduct.category}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">{selectedProduct.price}</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed font-sans">{selectedProduct.shortDesc}</p>
                    <ul className="mt-2.5 space-y-1">
                      {selectedProduct.bulletPoints.slice(0, 3).map((bp, i) => (
                        <li key={i} className="text-[10.5px] text-zinc-500 flex items-center gap-1.5">
                          <div className="h-1 w-1 bg-purple-500 rounded-full" />
                          {bp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* TUNING PANEL: MUSIC & MOOD ARTWORK CONFIGURATION */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 backdrop-blur-sm shadow-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                2. Real-Time Ad Director Configuration
              </h3>

              <div className="space-y-4">
                {/* Visual rendering style theme model */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10.5px] uppercase font-bold text-zinc-400">AI Visual style model (Pollinations)</label>
                    <span className="text-[9px] font-mono text-indigo-400">FLUX Engine</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { name: "Cinematic Photorealism", desc: "Premium Hasselblad 8k" },
                      { name: "Cyberpunk Noir", desc: "Dark neon cyber aesthetics" },
                      { name: "Studio Product Shoot", desc: "Clean minimalist catalogue" },
                      { name: "3D Octane Render", desc: "Glossy detailed 3D artwork" },
                      { name: "Anime Sci-Fi Illustration", desc: "Hand-drawn vibrant keys" }
                    ].map((st) => (
                      <button
                        key={st.name}
                        onClick={() => setCampaignStylePreset(st.name)}
                        className={cn(
                          "p-2 text-left rounded-lg border text-[10.5px] font-semibold leading-tight transition-all",
                          campaignStylePreset === st.name
                            ? "bg-indigo-600/10 border-indigo-500 text-indigo-200"
                            : "bg-zinc-950/20 border-zinc-850 hover:bg-zinc-900/40 hover:border-zinc-800 text-zinc-400"
                        )}
                        type="button"
                      >
                        <div>{st.name}</div>
                        <span className="text-[9px] text-zinc-500 block font-normal mt-0.5">{st.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campaign Tone Options */}
                <div>
                  <label className="block text-[10.5px] uppercase font-bold text-zinc-400 mb-1.5">Monologue voice Tone</label>
                  <select
                    value={campaignTone}
                    onChange={(e) => setCampaignTone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg text-xs px-3 py-2 text-zinc-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Futuristic & Premium Hype">Futuristic & Premium Hype</option>
                    <option value="Elegant & Cinematic Review">Elegant & Cinematic Review</option>
                    <option value="Social Content Hooky Text">Social Content Hooky Text (TikTok/IG Reels)</option>
                    <option value="Industrial Tech Blueprint">Industrial Tech Blueprint</option>
                  </select>
                </div>

                {/* Target Demographics */}
                <div>
                  <label className="block text-[10.5px] uppercase font-bold text-zinc-400 mb-1.5">Target Demographic Audience</label>
                  <input
                    type="text"
                    placeholder="e.g. Biohackers, Skincare Enthusiasts"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg text-xs px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                  />
                </div>

                {/* Aspect Layout choices */}
                <div>
                  <label className="block text-[10.5px] uppercase font-bold text-zinc-400 mb-1.5">Output Layout Aspect Ratio</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setVideoFormat("9:16")}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg border text-xs flex items-center justify-center gap-1.5 transition-all font-semibold",
                        videoFormat === "9:16"
                          ? "bg-purple-950/50 border-purple-500 text-purple-200 shadow"
                          : "bg-zinc-950/40 border-zinc-850 text-zinc-500 hover:text-zinc-300"
                      )}
                      type="button"
                    >
                      <Video className="h-3.5 w-3.5" />
                      Portrait Mobile (9:16)
                    </button>
                    <button
                      onClick={() => setVideoFormat("16:9")}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg border text-xs flex items-center justify-center gap-1.5 transition-all font-semibold",
                        videoFormat === "16:9"
                          ? "bg-purple-950/50 border-purple-500 text-purple-200 shadow"
                          : "bg-zinc-950/40 border-zinc-850 text-zinc-500 hover:text-zinc-300"
                      )}
                      type="button"
                    >
                      <Monitor className="h-3.5 w-3.5" />
                      Landscape YouTube (16:9)
                    </button>
                  </div>
                </div>

                {/* MAIN GENERATOR ACTION */}
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateCampaign}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 font-bold rounded-lg text-xs text-white shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-98"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      AI Generating Campaign Matrix...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-purple-200 animate-pulse" />
                      Generate Video Script Strategy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* VOICE & INSTRUMENT AUDIO CONTROLLER */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div>
                <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Speaker className="h-4 w-4 text-emerald-500" />
                  Sensory Experience Controller
                </h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Simulate browser voiceovers and cybernetic techno audio loops.</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* Speech Synthesis voice switch */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span className="text-[11px] text-zinc-400">Speech (TTS):</span>
                  <input
                    type="checkbox"
                    checked={voiceSynthesisEnabled}
                    onChange={(e) => {
                      setVoiceSynthesisEnabled(e.target.checked);
                      if (!e.target.checked && typeof window !== "undefined" && window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                    className="accent-purple-500 cursor-pointer h-3.5 w-3.5"
                  />
                </label>

                {/* Synthesizer loop soundtrack toggle */}
                <button
                  onClick={handleAudioToggle}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                    audioEnabled
                      ? "bg-emerald-600/15 border-emerald-500 text-emerald-300 shadow"
                      : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-zinc-300"
                  )}
                  type="button"
                >
                  {audioEnabled ? (
                    <>
                      <Volume2 className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                      Atmoshpere On
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-3.5 w-3.5" />
                      Sound Muted
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CINEMATIC AI STAGING & TIMELINE RUNTIME (COL 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* INTERACTIVE VIDEO RENDER STAGING VIEWPORT */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-28 w-28 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Cinematic Video Renderer</span>
                </div>
                
                <div className="text-[10px] font-mono text-indigo-400 bg-zinc-950/80 px-2.5 py-1 rounded-md border border-zinc-850 flex items-center gap-1.5 shadow">
                  <Radio className="h-3 w-3 text-red-500 animate-pulse" />
                  SYSTEM CLOCK: {playbackTime.toFixed(1)}s
                </div>
              </div>

              {/* VIDEO OUTLINE OUTER CONTAINER */}
              <div className="flex justify-center items-center w-full bg-zinc-950/30 p-2 border border-zinc-900/80 rounded-xl">
                <div
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 bg-zinc-900 rounded-lg shadow-2xl flex flex-col justify-between p-5 border border-zinc-800",
                    videoFormat === "9:16"
                      ? "w-[300px] h-[500px]"
                      : "w-full max-w-[620px] h-[348px] aspect-video"
                  )}
                >
                  
                  {/* FULL-BLEED LIVING ART IMAGE GENERATED VIA POLLINATIONS */}
                  <div className="absolute inset-0 z-0 bg-black">
                    <img
                      src={getPollinationsUrl(activeSlide)}
                      alt={activeSlide.visualText || "Visual Scene"}
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                      style={getProgressStyles()}
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark professional vignette overlay for subtitles background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/70 z-10" />

                    {/* Subtle grid lines matching technological theme */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px] z-10" />
                  </div>

                  {/* ACTIVE PLAYER HUD TOP RATIOS */}
                  <div className="relative z-20 w-full flex items-center justify-between pointer-events-none">
                    <div className="font-mono text-[9px] tracking-wider flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/5 text-zinc-300">
                      <Tv className="h-3 w-3 text-purple-400" />
                      AD PREVIEW ({videoFormat})
                    </div>
                    
                    <div className="font-mono text-[9px] bg-purple-900/40 text-purple-200 backdrop-blur-md px-2 py-1 rounded-md border border-purple-500/20 uppercase tracking-widest font-bold">
                      {activeSlide.sceneType}
                    </div>
                  </div>

                  {/* INTERACTIVE DYNAMIC KINETIC TYPOGRAPHY Overlay */}
                  <div className="relative z-20 flex-grow flex items-center justify-center text-center p-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${currentSlideIndex}-${activeSlide.visualText}`}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.98 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="max-w-[90%]"
                      >
                        <h2 className="text-lg md:text-xl font-black tracking-tight text-white leading-tight uppercase font-sans px-4 py-2.5 text-center bg-black/60 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md break-words shadow-purple-500/5">
                          {activeSlide.visualText}
                        </h2>
                        
                        <p className="text-[10px] text-zinc-400 italic mt-2 text-center bg-black/40 px-2 py-1 rounded-full inline-block backdrop-blur-xs font-medium">
                          Style: {campaignStylePreset}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* VOICEOVER SUBTITLE STREAM BAR */}
                  <div className="relative z-20 bg-black/75 backdrop-blur-md p-3 rounded-lg border border-white/10 space-y-2">
                    <div className="flex gap-2 items-start">
                      <div className="h-5 w-5 rounded bg-zinc-900/60 border border-zinc-805 flex items-center justify-center shrink-0">
                        <Speaker className="h-3 w-3 text-zinc-300 animate-pulse" />
                      </div>
                      <p className="text-[10.5px] text-zinc-200 leading-relaxed text-left font-sans font-semibold">
                        &ldquo;{activeSlide.dialogue}&rdquo;
                      </p>
                    </div>

                    <div className="border-t border-zinc-850 pt-1.5 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                      <span>Shopify Vector Storyboard v2.5</span>
                      <span className="text-purple-400 font-semibold flex items-center gap-1">
                        <Globe className="h-2.5 w-2.5" />
                        ai-market.online
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* TIMELINE RUNTIME CONTROLS BAR */}
              <div className="mt-5 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const nextIsPlaying = !isPlaying;
                        setIsPlaying(nextIsPlaying);
                      }}
                      className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center transition-all border shadow active:scale-90",
                        isPlaying 
                          ? "bg-amber-600/20 border-amber-500 text-amber-200 hover:bg-amber-600/30" 
                          : "bg-purple-600/20 border-purple-500 text-purple-200 hover:bg-purple-500/30"
                      )}
                      title={isPlaying ? "Pause Scene" : "Start Video Deck Playback"}
                    >
                      {isPlaying ? <Pause className="h-4 w-4 fill-amber-200" /> : <Play className="h-4 w-4 fill-purple-200 ml-0.5" />}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setIsPlaying(false);
                        setPlaybackTime(0);
                        if (typeof window !== "undefined" && window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                        }
                        lastSpokenIndexRef.current = -1;
                      }}
                      className="h-9 w-9 rounded-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all active:scale-90"
                      title="Rewind / Reset Workspace"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>

                    <div className="text-xs text-zinc-400 ml-2 font-medium">
                      Playback Progress: <span className="font-bold text-zinc-200">{playbackTime.toFixed(1)}s</span> / {totalDuration}s
                    </div>
                  </div>

                  <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                    {campaign.slides.length} cinematic parts
                  </div>
                </div>

                {/* ADVANCED PROGRESS MATRIX LINE */}
                <div className="relative h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900 flex select-none">
                  {campaign.slides.map((s, idx) => {
                    const widthPercent = (s.durationSec / totalDuration) * 100;
                    const offsetTime = getSlideStartTime(idx);
                    const isActive = currentSlideIndex === idx;
                    const accumulatedProgress = Math.min(
                      Math.max((playbackTime - offsetTime) / s.durationSec, 0),
                      1
                    );

                    return (
                      <div
                        key={s.id}
                        className="h-full relative border-r border-zinc-900 cursor-pointer"
                        style={{ width: `${widthPercent}%` }}
                        onClick={() => {
                          setIsPlaying(false);
                          setPlaybackTime(offsetTime);
                        }}
                      >
                        <div className="absolute inset-0 bg-zinc-900/50" />
                        <div
                          className={cn(
                            "absolute left-0 top-0 bottom-0 transition-all duration-100",
                            isActive ? "bg-purple-500" : playbackTime > offsetTime ? "bg-purple-950/60" : "bg-transparent"
                          )}
                          style={{ width: isActive ? `${accumulatedProgress * 100}%` : "100%" }}
                        />
                        <div className="absolute top-0 right-1 text-[7px] opacity-40 font-mono text-zinc-500">
                          SCENE {s.id}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* DIRECT QUICK PLAY BADGES */}
                <div className="grid grid-cols-5 gap-2">
                  {campaign.slides.map((s, idx) => {
                    const isActive = currentSlideIndex === idx;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          setIsPlaying(false);
                          setPlaybackTime(getSlideStartTime(idx));
                        }}
                        className={cn(
                          "py-2 px-1 rounded-lg border text-center font-sans tracking-wide transition-all shadow-sm",
                          isActive
                            ? "bg-purple-600/10 border-purple-500 text-purple-300 ring-1 ring-purple-500/20"
                            : "bg-zinc-950/20 border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800"
                        )}
                        type="button"
                      >
                        <div className="text-[9.5px] uppercase font-bold tracking-wider">
                          {s.sceneType}
                        </div>
                        <div className="text-[8.5px] opacity-55 font-mono mt-0.5">
                          {s.durationSec}s Frame
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ARTWORK PREVIEW DIRECTOR'S DECK GALLERY GRID (REAL-TIME GENERATIONS) */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 backdrop-blur-md">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-purple-500" />
                    3. Visual Storyboard Deck
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Preview all generated Pollinations live frames side-by-side. 🎲 rolls unique AI seed variations!
                  </p>
                </div>
              </div>

              {/* FIVE FRAMES GALLERY */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {campaign.slides.map((sl, index) => {
                  const isActive = currentSlideIndex === index;
                  return (
                    <div
                      key={sl.id}
                      className={cn(
                        "relative bg-zinc-950 rounded-xl overflow-hidden border transition-all cursor-pointer group flex flex-col justify-between h-[155px]",
                        isActive 
                          ? "border-purple-500 ring-2 ring-purple-500/20 shadow-md shadow-purple-500/5" 
                          : "border-zinc-90 w hover:border-zinc-800"
                      )}
                      onClick={() => {
                        setIsPlaying(false);
                        setPlaybackTime(getSlideStartTime(index));
                      }}
                    >
                      {/* Generative Frame Image */}
                      <div className="relative w-full h-[85px] bg-zinc-900 overflow-hidden">
                        <img
                          src={getPollinationsUrl(sl)}
                          alt={`Scene ${sl.id}`}
                          className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        {/* Dimmer layout hover info */}
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 bg-zinc-950/70">
                          <button
                            title="Randomize Frame Seed"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRollSlideSeed(sl.id);
                            }}
                            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 p-1.5 rounded-md text-purple-400 hover:text-white transition-all shadow active:scale-90"
                            type="button"
                          >
                            <Dices className="h-3 w-3" />
                          </button>
                          <button
                            title="Download High-Res Frame Asset"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadSlideImage(sl);
                            }}
                            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 p-1.5 rounded-md text-emerald-400 hover:text-white transition-all shadow active:scale-90"
                            type="button"
                          >
                            <Download className="h-3 w-3" />
                          </button>
                        </div>
                        {/* Small bottom seed number label */}
                        <span className="absolute bottom-1 right-1 font-mono text-[8px] text-zinc-500 bg-black/60 px-1 rounded-md">
                          seed: {sl.seed || (42 + sl.id)}
                        </span>
                      </div>

                      {/* Content Info under Image */}
                      <div className="p-2 bg-zinc-950/60 leading-tight flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-zinc-400">Scene {sl.id}</span>
                          <span className="text-[8px] font-mono text-purple-400 uppercase font-semibold">{sl.sceneType}</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-medium truncate mt-1">
                          {sl.visualText}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TAB: STORYBOARD BLUEPRINT AND BUILDER */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-purple-500" />
                    4. Screenplay & Prompt Director Board
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Customize monologues, typography overlays, or expand scenes with Gemini AI.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="text-xs bg-zinc-955 hover:bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-zinc-300 flex items-center gap-1.5 transition-all active:scale-95 shadow"
                    type="button"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Copied Storyboard Strategy!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-zinc-500" />
                        Copy Screenplay Strategy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* SCENE BY SCENE CARD LIST */}
              <div className="space-y-4">
                {campaign.slides.map((slide, idx) => {
                  const isCurEditing = isEditingSlide === slide.id;
                  const isActive = currentSlideIndex === idx;

                  return (
                    <div
                      key={slide.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        isActive
                          ? "bg-purple-950/5 border-purple-500/20 shadow-md"
                          : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-850"
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold bg-zinc-900 px-2.5 py-0.5 rounded text-zinc-400 border border-zinc-800">
                            Scene {slide.id}
                          </span>
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                            {slide.sceneType}
                          </span>
                          <span className="text-[10px] bg-zinc-900/50 px-2 rounded-full text-zinc-500 border border-zinc-805">
                            {slide.durationSec}s frame timer
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Quick seed rolling button */}
                          <button
                            title="Roll Slide Alternative Random Seed"
                            onClick={() => handleRollSlideSeed(slide.id)}
                            className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-md text-zinc-400 hover:text-white text-[10.5px] transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                            type="button"
                          >
                            <Dices className="h-3.5 w-3.5 text-purple-400" />
                            Roll Seed
                          </button>

                          <button
                            onClick={() => setIsEditingSlide(isCurEditing ? null : slide.id)}
                            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-all bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 p-1 px-2.5 rounded-md cursor-pointer"
                            type="button"
                          >
                            <Edit className="h-3.5 w-3.5 text-indigo-400" />
                            {isCurEditing ? "Collapse" : "Edit Scene details"}
                          </button>
                        </div>
                      </div>

                      {/* STORYBOARD PREVIEW INFO */}
                      {!isCurEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 text-xs">
                          {/* Dialogue vocal preview */}
                          <div className="md:col-span-4 bg-zinc-950/40 p-3 rounded-lg border border-zinc-905">
                            <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider mb-1">
                              Voiceover Monologue (Spoken):
                            </span>
                            <p className="text-zinc-300 font-medium font-sans leading-relaxed italic">&ldquo;{slide.dialogue}&rdquo;</p>
                          </div>

                          {/* Bold typography kinetic overlays */}
                          <div className="md:col-span-4 bg-zinc-950/40 p-3 rounded-lg border border-zinc-905">
                            <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider mb-1">
                              Kinetic screen titles:
                            </span>
                            <p className="font-extrabold text-white uppercase tracking-tight">{slide.visualText}</p>
                          </div>

                          {/* Cinemagraphic layout generator prompt */}
                          <div className="md:col-span-4 bg-zinc-950/40 p-3 rounded-lg border border-zinc-905">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">
                                FLUX generator Prompt:
                              </span>
                              {/* Small Quick enhance button */}
                              <button
                                onClick={() => handleEnhanceSlidePrompt(slide.id, slide.description)}
                                disabled={isEnhancingSlideId === slide.id}
                                className="text-[9.5px] text-purple-400 hover:text-purple-300 flex items-center gap-0.5 transition-all bg-purple-950/20 px-1.5 rounded border border-purple-500/20"
                                type="button"
                              >
                                {isEnhancingSlideId === slide.id ? (
                                  <RefreshCw className="h-2 w-2 animate-spin" />
                                ) : (
                                  <Wand2 className="h-2.5 w-2.5" />
                                )}
                                Auto-Enhance✨
                              </button>
                            </div>
                            <p className="text-zinc-400 line-clamp-2 md:line-clamp-none leading-relaxed text-[11px]">
                              {slide.description}
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* EXPANDED LIVE FORM EDITOR FIELDS */
                        <div className="space-y-4 pt-3 border-t border-zinc-900 mt-2 bg-zinc-950/40 p-3.5 rounded-lg border border-zinc-900">
                          
                          <div className="flex justify-between items-center bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-850">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-purple-400" />
                              <div>
                                <h4 className="text-xs font-semibold text-zinc-300">Intelligent Visual Assistant</h4>
                                <p className="text-[9.5px] text-zinc-500">Gemini will rewrite your simple instructions into lighting-perfect prompts.</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleEnhanceSlidePrompt(slide.id, slide.description)}
                              disabled={isEnhancingSlideId === slide.id}
                              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow transition active:scale-95 disabled:opacity-50 pointer-events-auto"
                            >
                              {isEnhancingSlideId === slide.id ? (
                                <>
                                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                  Upgrading...
                                </>
                              ) : (
                                <>
                                  <Wand2 className="h-3.5 w-3.5" />
                                  Enhance Prompt with Gemini AI ✨
                                </>
                              )}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">
                                Bold Screen Typography (Kinetic Overlay)
                              </label>
                              <input
                                type="text"
                                value={slide.visualText || ""}
                                onChange={(e) => handleUpdateSlideField(slide.id, "visualText", e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-805 rounded px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 transition-all font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">
                                Motion Camera Preset Accent
                              </label>
                              <select
                                value={slide.visualEffect || "zoom-in"}
                                onChange={(e) => handleUpdateSlideField(slide.id, "visualEffect", e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-805 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 transition-all"
                              >
                                <option value="zoom-in">Slow Cinematic Ken Burns Zoom-In</option>
                                <option value="panic-shake">Shock Wave Glitch Shake</option>
                                <option value="pulsate">Soft Breathing Glow Pulsation</option>
                                <option value="glow-flash">Glow Wave Flash</option>
                                <option value="slide-left">Slick Lateral Pan-Left</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">
                              Voiceover Spoken Monologue (Dialogues Read aloud via TTS option)
                            </label>
                            <textarea
                              rows={2}
                              value={slide.dialogue || ""}
                              onChange={(e) => handleUpdateSlideField(slide.id, "dialogue", e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-805 rounded px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 resize-none transition-all font-medium leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-500 mb-1">
                              <span>Visual prompt scene description (Sends to Pollinations AI)</span>
                              <span className="text-[9px] font-mono tracking-wide text-zinc-650 font-normal">Active Style: {campaignStylePreset}</span>
                            </label>
                            <textarea
                              rows={2}
                              value={slide.description || ""}
                              onChange={(e) => handleUpdateSlideField(slide.id, "description", e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-805 rounded px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-purple-500 resize-none font-sans"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AD EXPORT & BUNDLE CREATION CHEER SHEET */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 mb-3">
                <Video className="h-4 w-4 text-purple-400" />
                5. How to Compile into a Master Video (Free Strategy)
              </h3>
              
              <div className="space-y-3.5 text-xs text-zinc-400 leading-relaxed bg-zinc-950/40 p-4 rounded-lg border border-zinc-900">
                <p>
                  Since we are operating on absolute zero API costs, you can assemble a production-ready vertical TikTok, Instagram Reel, or YouTube Short in under 2 minutes:
                </p>
                <ol className="list-decimal list-inside space-y-2 mt-2 pl-1.5">
                  <li>
                    Hover over each card in the <strong className="text-purple-300">Visual Storyboard Deck</strong> above and download all 5 high-definition AI generated visuals.
                  </li>
                  <li>
                    Copy the screenplay monologue strategy using our <strong className="text-zinc-200">Copy Screenplay</strong> button.
                  </li>
                  <li>
                    Drag the downloaded visuals into any free browser editor like <strong className="text-white">CapCut Online</strong> or <strong className="text-white">Canva Video</strong>.
                  </li>
                  <li>
                    Use CapCut&apos;s free <strong className="text-emerald-400">Auto Captions / Text-to-Speech</strong> feature to automatically generate highly energetic viral narrator voiceovers and on-screen subtitle captions matching your copied dialogue!
                  </li>
                </ol>
                <p className="mt-2.5 text-[11px] text-zinc-500 italic block border-t border-zinc-900 pt-2">
                  This workflow guarantees cinematic multi-modality visual performance without spending a single dollar on cloud compute.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
