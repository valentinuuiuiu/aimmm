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
  HelpCircle,
  Copy,
  Check,
  Edit,
  Globe,
  Plus,
  RefreshCw,
  Sliders,
  Speaker
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
  seed: string; // Picsum seed name or color
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
    category: " Productivity Tools",
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

// Default Campaign placeholder
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
      description: "A dark beautiful shadow profile view of a glowing sleek titanium health ring on a finger, with abstract light-streaks speeding past."
    },
    {
      id: 2,
      sceneType: "Problem",
      dialogue: "Strap-on sports watches look awkward, drain quickly, and pinch your skin. Why should tracking your health feel like an absolute chore?",
      visualText: "AWKWARD NO MORE",
      durationSec: 4,
      visualEffect: "panic-shake",
      colorPreset: "from-zinc-950 via-neutral-900 to-rose-950",
      description: "Frustrated modern creator staring at a clumsy bright smartwatch screen flashing alerts, contrasty shadows, moody colors."
    },
    {
      id: 3,
      sceneType: "Solution",
      dialogue: "Meet the Hera AI Smart Ring. Meticulously sculpted out of pure lightweight aerospace titanium black.",
      visualText: "MEET HERA SMART RING",
      durationSec: 4,
      visualEffect: "pulsate",
      colorPreset: "from-zinc-950 via-zinc-900 to-violet-950",
      description: "A pristine macro catalog rendering of the HERA smart ring, rotating in slow motion, highlighting a polished space-grade titanium texture."
    },
    {
      id: 4,
      sceneType: "Features",
      dialogue: "It continuously measures your precise blood-oxygen, real-time stress scales, and calculates deep deep sleep repair scores automatically.",
      visualText: "BIOMETRIC POWERHOUSE",
      durationSec: 5,
      visualEffect: "glow-flash",
      colorPreset: "from-zinc-950 via-slate-900 to-blue-950",
      description: "Abstract digital visualization of health metrics dashboard. Ethereal waves representing heart pattern, sleep grids, and tech HUDs."
    },
    {
      id: 5,
      sceneType: "CTA",
      dialogue: "Level up your daily potential now. Claim Yours on ai-market.online and use discount coupon code SHINE10 today!",
      visualText: "CLAIM REBATE. GO SMART",
      durationSec: 5,
      visualEffect: "slide-left",
      colorPreset: "from-zinc-950 via-indigo-950 to-purple-950",
      description: "A gorgeous glowing showcase card displaying ai-market.online in modern typography, surrounding an elegant smart ring box set."
    }
  ]
};

export default function AIStoreCampaignStudio() {
  // --- States ---
  const [selectedProduct, setSelectedProduct] = useState<ProductPreset>(verifiedProducts[1]); 
  const [campaignTone, setCampaignTone] = useState<string>("Futuristic & Premium Hype");
  const [targetAudience, setTargetAudience] = useState<string>("Tech Pioneers & Wellness Enthusiasts");
  const [videoFormat, setVideoFormat] = useState<"9:16" | "16:9">("9:16");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [campaign, setCampaign] = useState<Campaign>(defaultStoryboard);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [voiceSynthesisEnabled, setVoiceSynthesisEnabled] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isEditingSlide, setIsEditingSlide] = useState<number | null>(null);

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
    
    // Pick a neat robotic or friendly presenter voice if possible
    const voices = window.speechSynthesis.getVoices();
    const desiredVoice = voices.find(v => 
      v.name.includes("Google US English") || 
      v.name.includes("Natural") || 
      v.lang.startsWith("en-")
    );
    if (desiredVoice) utterance.voice = desiredVoice;
    
    utterance.rate = 1.05; // Slightly faster for high energetic clip vibe
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
      console.error("Web Audio fail to initialize:", e);
    }
  };

  const playSynthesizerBeat = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Every 550ms, play a rhythm
    let beatStep = 0;
    synthesizerIntervalRef.current = setInterval(() => {
      if (!audioEnabled || ctx.state === "suspended") return;

      const now = ctx.currentTime;
      
      // 1. Heavy Cyber Kick (every beat 0, 2)
      if (beatStep % 4 === 0 || beatStep % 4 === 2) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.25);
        
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        
        osc.start(now);
        osc.stop(now + 0.3);
      }

      // 2. High-Tech Beep/Ticking (every step)
      if (beatStep % 2 === 1) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(beatStep % 4 === 1 ? 880 : 1320, now);
        
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        osc.start(now);
        osc.stop(now + 0.1);
      }

      // 3. Ambient chord wave swell (every 8 steps)
      if (beatStep % 8 === 0) {
        const chordFreqs = [196, 246, 293, 392]; // G major - tech airy
        chordFreqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq / 2, now); // deep pad sub
          
          // Low pass filter
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(400, now);
          osc.disconnect(gain);
          osc.connect(filter);
          filter.connect(gain);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 0.5);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
          
          osc.start(now);
          osc.stop(now + 2.6);
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
      // Trigger voice on initial press
      speakSlideDialogue(getSlideIndexByTime(playbackTime));
      
      playbackTimerRef.current = setInterval(() => {
        setPlaybackTime((prev) => {
          const nextTime = Number((prev + 0.1).toFixed(1));
          if (nextTime >= totalDuration) {
            setIsPlaying(false);
            if (typeof window !== "undefined" && window.speechSynthesis) {
              window.speechSynthesis.cancel();
            }
            return 0; // Loop back
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
          videoFormat: videoFormat === "9:16" ? "9:16 portrait (Vertical Short/TikTok)" : "16:16 Landscape (Widescreen)",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach script generator API.");
      }

      const generatedData = await response.json();
      if (generatedData && generatedData.slides && generatedData.slides.length === 5) {
        setCampaign(generatedData);
      } else {
        throw new Error("Returned campaign model is malformed.");
      }
    } catch (err) {
      console.error("AI campaign generation failed:", err);
      // Fallback fallback animation if API block unavailable or empty
      alert("Notice: Premium campaign generated offline via local heuristics blueprint!");
      generateOfflineCampaign();
    } finally {
      setIsGenerating(false);
    }
  };

  // Highly advanced local heuristics fallback generator when API keys aren't provisioned yet
  const generateOfflineCampaign = () => {
    const tones = {
      "Tik Tok Hooky": "insanely speedy, viral loop hook, huge energy",
      "Elegant & Cinematic Review": "luxurious pacing, deep breathy vocal review",
      "Technical Spec Blueprint": "highly quantitative diagnostic dashboard walkthrough"
    };
    
    const craftedSlides: StoryboardSlide[] = [
      {
        id: 1,
        sceneType: "Hook",
        dialogue: `Stop scrolling! If you are into modern tech, you need to see what ${selectedProduct.name} is doing to disrupt ${selectedProduct.category}.`,
        visualText: "SAY GOODBYE TO NOISE",
        durationSec: 4,
        visualEffect: "zoom-in",
        colorPreset: "from-zinc-950 to-neutral-900 border-red-500",
        description: `Stunning close-up view of ${selectedProduct.name} glowing with dramatic neon side lighting, tech ambient.`
      },
      {
        id: 2,
        sceneType: "Problem",
        dialogue: `We are exhausted by generic tech that breaks tomorrow, over-complicates our rituals, and drains our hard-earned budget.`,
        visualText: "THE OLD WAY BROKE",
        durationSec: 4,
        visualEffect: "panic-shake",
        colorPreset: "from-rose-950 to-neutral-950 border-rose-600",
        description: "Monochrome close shot of tangled electronic cords and an outdated heavy user manual."
      },
      {
        id: 3,
        sceneType: "Solution",
        dialogue: `Enter the elite ${selectedProduct.name}. A lightweight smart device built for your lifestyle, starting at just ${selectedProduct.price}.`,
        visualText: `MEET ${selectedProduct.name.split(":")[0]}`,
        durationSec: 4,
        visualEffect: "pulsate",
        colorPreset: "from-slate-900 via-stone-900 to-indigo-950 border-indigo-500",
        description: `Ultra-crisp cinematic panning shot across the gorgeous clean edges of the genuine ${selectedProduct.name}.`
      },
      {
        id: 4,
        sceneType: "Features",
        dialogue: `Packed with: ${selectedProduct.bulletPoints[0]}, and featuring ${selectedProduct.bulletPoints[1]}. Experience luxury grade wellness.`,
        visualText: "ELITE SMART DESIGN",
        durationSec: 5,
        visualEffect: "glow-flash",
        colorPreset: "from-zinc-950 via-teal-950 to-blue-950 border-emerald-500",
        description: `Close highlight showcasing its smart properties with clean animated data charts tracking key performance indicators.`
      },
      {
        id: 5,
        sceneType: "CTA",
        dialogue: `Ready to upgrade your rituals? Browse the entire collection on ai-market.online today. Grab your ultimate gear!`,
        visualText: "SHOP AI-MARKET.ONLINE",
        durationSec: 5,
        visualEffect: "slide-left",
        colorPreset: "from-neutral-950 to-violet-950 border-purple-500",
        description: `Bold digital display logo showing ai-market.online web address surrounded by soft rotating light halos.`
      }
    ];

    setCampaign({
      campaignName: `${selectedProduct.name.split(":")[0]} Visual Hype Ad`,
      productName: selectedProduct.name,
      tagline: selectedProduct.shortDesc,
      tone: campaignTone,
      audience: targetAudience,
      musicVibe: "Cinematic Neo-retro ambient synthesizer beat",
      slides: craftedSlides
    });
  };

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
      bulletPoints: ["Exclusive AI integrations", "Intelligent responsive metrics feedback", "Sleek tactical casing materials"],
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
# Promotional Video Campaign Strategy: ${campaign.campaignName}
**Product:** ${campaign.productName}
**Tagline:** ${campaign.tagline}
**Audience:** ${campaign.audience}
**Visual Theme Vibe:** ${campaign.tone}
**Audio Vibe:** ${campaign.musicVibe}

---

${campaign.slides.map(s => `
### Scene ${s.id}: [${s.sceneType}] (${s.durationSec} seconds)
* **Voiceover (Audio dialogue):** "${s.dialogue}"
* **On-Screen Big Captions:** "${s.visualText}"
* **Video Action & Transition:** ${s.visualEffect}
* **Cinematography & Prompt Details:** ${s.description}
`).join("\n")}
    `;

    navigator.clipboard.writeText(md.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Get active effect style class matching video slide
  const getVisualEffectClass = (effect: string) => {
    switch (effect) {
      case "zoom-in":
        return "scale-105 transition-all duration-3000 ease-out";
      case "panic-shake":
        return "animate-[shake_0.5s_infinite] border-2 border-red-500/20";
      case "pulsate":
        return "animate-[pulse_2s_infinite]";
      case "glow-flash":
        return "bg-black relative shadow-[0_0_40px_rgba(20,200,255,0.25)]";
      case "slide-left":
        return "translate-x-1 duration-1000";
      default:
        return "scale-100 transition-transform";
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500 selection:text-white pb-16">
      
      {/* HEADER SECTION */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/10">
              <Video className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                Campaign Ad Studio
                <span className="text-[10px] font-mono text-zinc-500 border border-zinc-800 px-1 bg-zinc-900/50 rounded">
                  v2.5
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-zinc-400 font-mono hidden md:inline">
              Store integration: <strong className="text-emerald-400">ai-market.online</strong>
            </span>
            <a
              href="https://ai-market.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-3 py-1 rounded-md text-zinc-300 flex items-center gap-1.5 transition"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-zinc-400" />
              Visit Store
            </a>
          </div>
        </div>
      </header>

      {/* BODY PANELGRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: WORKSPACE CONTROLLER (COL 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* PRODUCT SELECTOR WHEEL */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 backdrop-blur-sm shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-violet-500" />
                  1. Brand Smart Catalog
                </h3>
                
                <button
                  onClick={() => setIsAddingCustom(!isAddingCustom)}
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {isAddingCustom ? "Show Presets" : "Custom Item"}
                </button>
              </div>

              {isAddingCustom ? (
                <form onSubmit={handleAddCustomProduct} className="space-y-4 pt-1 bg-zinc-950/40 p-3.5 rounded-lg border border-zinc-850">
                  <h4 className="text-xs font-medium text-amber-400">Add custom Shopify item name</h4>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smart Smart LED Bulb"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-xs px-2.5 py-1.5 focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Pricing</label>
                      <input
                        type="text"
                        placeholder="$49.00"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-xs px-2.5 py-1.5 focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Category</label>
                      <input
                        type="text"
                        placeholder="Smart Home"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-xs px-2.5 py-1.5 focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Short Proposition</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Seamless smart light integration synced directly..."
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-xs px-2.5 py-1.5 focus:border-violet-500 focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-gradient-to-r from-amber-600 to-orange-700 text-white font-semibold rounded-md text-xs hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-1"
                  >
                    Use Custom product
                  </button>
                </form>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 max-h-[174px] overflow-y-auto pr-1 gap-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {productsList.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => {
                          setSelectedProduct(prod);
                          generateOfflineCampaign(); // instant preview update for safety
                        }}
                        className={cn(
                          "w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition",
                          selectedProduct.name === prod.name
                            ? "bg-zinc-900/80 border-violet-500/80 text-violet-200"
                            : "bg-zinc-950/40 border-zinc-850 hover:bg-zinc-900/40 text-zinc-400"
                        )}
                      >
                        <div className="flex flex-col pr-2">
                          <span className="font-semibold text-zinc-200 line-clamp-1">{prod.name}</span>
                          <span className="text-[10px] text-zinc-500 mt-0.5">{prod.category} — {prod.price}</span>
                        </div>
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          selectedProduct.name === prod.name ? "bg-violet-500 animate-pulse" : "bg-transparent"
                        )} />
                      </button>
                    ))}
                  </div>

                  {/* ACTIVE PRODUCT DETAILS INLINE CARD */}
                  <div className="mt-3.5 p-3.5 bg-zinc-950/60 rounded-lg border border-zinc-900">
                    <div className="flex justify-between items-start">
                      <span className="text-[10.5px] font-semibold text-violet-400 border border-violet-500/20 px-1.5 rounded-full bg-violet-600/5">
                        {selectedProduct.category}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">{selectedProduct.price}</span>
                    </div>
                    <p className="text-[11.5px] text-zinc-300 mt-1.5 leading-relaxed font-sans">{selectedProduct.shortDesc}</p>
                    <ul className="mt-2.5 space-y-1">
                      {selectedProduct.bulletPoints.slice(0, 3).map((bp, i) => (
                        <li key={i} className="text-[10.5px] text-zinc-500 flex items-center gap-1.5">
                          <div className="h-1 w-1 bg-violet-500 rounded-full" />
                          {bp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* AI CAMPAIGN SETTING CONFIGS */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 backdrop-blur-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                2. AI Script Architect Tuning
              </h3>

              <div className="space-y-4">
                {/* Visual Style Theme Option */}
                <div>
                  <label className="block text-[10.5px] uppercase font-semibold text-zinc-500 mb-1">Campaign Mood Theme</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { name: "Futuristic & Premium Hype", desc: "For smart wearables and AI tech" },
                      { name: "Elegant & Cinematic Review", desc: "For medical, optical, audio review" },
                      { name: "Social Content Hooky Text", desc: "For TikTok, Instagram Reels" },
                      { name: "Industrial Tech Blueprint", desc: "Highly technical specs" }
                    ].map((tn) => (
                      <button
                        key={tn.name}
                        onClick={() => setCampaignTone(tn.name)}
                        className={cn(
                          "p-2 text-left rounded-md border text-[11px] font-medium leading-tight transition",
                          campaignTone === tn.name
                            ? "bg-indigo-600/10 border-indigo-500 text-indigo-200"
                            : "bg-zinc-950/20 border-zinc-850 hover:bg-zinc-900 text-zinc-400"
                        )}
                      >
                        <div>{tn.name.split("&")[0]}</div>
                        <span className="text-[9px] text-zinc-500 block font-normal mt-0.5">{tn.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Audience inputs */}
                <div>
                  <label className="block text-[10.5px] uppercase font-semibold text-zinc-500 mb-1.5">Target Consumer Base</label>
                  <input
                    type="text"
                    placeholder="e.g. Tech Pioneers, Skincare Enthusiasts"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg text-xs px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                {/* Aspect Ratio choice */}
                <div>
                  <label className="block text-[10.5px] uppercase font-semibold text-zinc-500 mb-1.5">Video Layout Format</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setVideoFormat("9:16")}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg border text-xs flex items-center justify-center gap-2 transition",
                        videoFormat === "9:16"
                          ? "bg-violet-950/50 border-violet-500 text-violet-200"
                          : "bg-zinc-950/40 border-zinc-850 text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      <Video className="h-3.5 w-3.5" />
                      Vertical (9:16)
                    </button>
                    <button
                      onClick={() => setVideoFormat("16:9")}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg border text-xs flex items-center justify-center gap-2 transition",
                        videoFormat === "16:9"
                          ? "bg-violet-950/50 border-violet-500 text-violet-200"
                          : "bg-zinc-950/40 border-zinc-850 text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      <Monitor className="h-3.5 w-3.5" />
                      Widescreen (16:9)
                    </button>
                  </div>
                </div>

                {/* GENERATE ACTION BUTTON */}
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateCampaign}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 font-semibold rounded-lg text-xs text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50 active:scale-98"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      AI Synthesizing Campaign (8s)...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Draft Marketing Campaign Script with AI
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* WEB SPEECH NARRATOR AUDIO CONTROLS */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div>
                <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Speaker className="h-4 w-4 text-emerald-500" />
                  Sensory Experience Controller
                </h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Inject dynamic Web-Audio beats and read-aloud spoken narrations.</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Voice Synthesis option */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span className="text-[11px] text-zinc-400">AI Voiceover:</span>
                  <input
                    type="checkbox"
                    checked={voiceSynthesisEnabled}
                    onChange={(e) => {
                      setVoiceSynthesisEnabled(e.target.checked);
                      if (!e.target.checked && typeof window !== "undefined" && window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                    className="accent-violet-500 cursor-pointer"
                  />
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded uppercase font-mono border border-zinc-700">
                    TTS
                  </span>
                </label>

                {/* Synthwave loop soundtrack */}
                <button
                  onClick={handleAudioToggle}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition",
                    audioEnabled
                      ? "bg-emerald-600/15 border-emerald-500 text-emerald-300"
                      : "bg-zinc-950/40 border-zinc-850 text-zinc-400"
                  )}
                >
                  {audioEnabled ? (
                    <>
                      <Volume2 className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                      Synth On
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-3.5 w-3.5" />
                      Muted
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT: CINEMATIC PLAYBACK STUDIO (COL 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* INTERACTIVE VIDEO PLAYER DEVICE FRAME */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-semibold text-zinc-300">Live Render Playground</span>
                </div>
                
                <div className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850 flex items-center gap-1">
                  <Radio className="h-3 w-3 text-red-500" />
                  TEMPO: 120BPM
                </div>
              </div>

              {/* VIDEO OUTLINE OUTER CONTAINER */}
              <div className="flex justify-center items-center w-full">
                <div
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 bg-black rounded-lg border-4 border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between p-6",
                    videoFormat === "9:16"
                      ? "w-[310px] h-[520px]"
                      : "w-full max-w-[640px] h-[360px]"
                  )}
                >
                  
                  {/* VIDEO STAGING ANIMATED GRIDS BACKGROUNDS */}
                  <div className="absolute inset-0 z-0 bg-gradient-to-br transition-all duration-1000">
                    {/* Visual pattern templates based on colorPreset of currently selected slide */}
                    <div className={cn("absolute inset-0 bg-gradient-to-br", activeSlide.colorPreset || "from-neutral-950 to-indigo-950")} />
                    
                    {/* Simulated vector grid lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />
                    
                    {/* Moving graphic background blobs based on playtime */}
                    <div
                      className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl animate-pulse"
                      style={{ animationDuration: "3s" }}
                    />
                    <div
                      className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl animate-pulse"
                      style={{ animationDuration: "5s" }}
                    />

                    {/* Skincare Theme Floating ambient bubbles */}
                    {selectedProduct.category.includes("Skincare") && (
                      <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-30">
                        <div className="absolute h-4 w-4 rounded-full bg-pink-400 top-1/4 left-1/4 animate-bounce duration-1000" />
                        <div className="absolute h-6 w-6 rounded-full bg-rose-300 top-1/2 right-1/4 animate-bounce duration-2000" />
                        <div className="absolute h-3 w-3 rounded-full bg-white bottom-1/4 right-1/3 animate-bounce duration-1500" />
                      </div>
                    )}
                  </div>

                  {/* ACTIVE PLAYING VIEW PORTAL LAYOUT */}
                  <div className="relative z-10 w-full flex items-center justify-between text-zinc-400 text-[10px]">
                    <div className="font-mono tracking-wider flex items-center gap-1 bg-zinc-950/50 backdrop-blur-sm px-2 py-1 rounded">
                      <Tv className="h-3 w-3 text-indigo-400" />
                      CAMPAIGN: {campaign.campaignName.slice(0, 18)}...
                    </div>
                    <div className="font-mono bg-zinc-950/50 backdrop-blur-sm px-2 py-1 rounded border border-zinc-800">
                      SCENE {currentSlideIndex + 1}/5
                    </div>
                  </div>

                  {/* CORE VISUAL SUBJECT CONTENT */}
                  <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-2 text-center my-auto">
                    
                    {/* Subtle aesthetic kinetic display */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlideIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className={cn("w-full h-full flex flex-col justify-center items-center position-relative")}
                      >
                        {/* Simulated high-end visual slide outline card */}
                        <div className="p-3 bg-zinc-950/25 backdrop-blur-xs rounded-xl border border-white/5 w-full flex flex-col items-center gap-2 max-w-[90%]">
                          {/* Top type flag */}
                          <span className="text-[10px] font-mono tracking-widest text-violet-400 uppercase bg-violet-950/50 px-2 py-0.5 rounded-full border border-violet-800/20">
                            {activeSlide.sceneType}
                          </span>

                          {/* Placeholder image representation */}
                          <div className="relative h-20 w-32 rounded bg-zinc-900 border border-white/10 overflow-hidden flex items-center justify-center group my-1">
                            {/* Standard picsum photo with seed matching product */}
                            <img
                              src={`https://picsum.photos/seed/${selectedProduct.seed}/${videoFormat === "9:16" ? "320/200" : "500/200"}?blur=2`}
                              alt={selectedProduct.name}
                              className={cn(
                                "absolute inset-0 w-full h-full object-cover opacity-60 transition-transform",
                                isPlaying ? getVisualEffectClass(activeSlide.visualEffect) : "scale-100"
                              )}
                              referrerPolicy="no-referrer"
                            />
                            {/* Overlay tag */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-1">
                              <span className="text-[9px] text-zinc-400 font-mono tracking-tighter max-w-[90%] truncate">
                                mock: {selectedProduct.seed}
                              </span>
                            </div>
                          </div>

                          {/* Interactive visual text - KINETIC TYPOGRAPHY */}
                          <h2 className="text-sm font-black tracking-tight text-white leading-tight uppercase px-2 py-1 text-center font-sans bg-black/40 rounded-md backdrop-blur-xs break-words max-w-full">
                            {activeSlide.visualText}
                          </h2>

                          {/* Scene layout context descriptions */}
                          <p className="text-[9.5px] italic text-zinc-400 line-clamp-2 max-w-[95%]">
                            {activeSlide.description}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                  </div>

                  {/* BOTTOM BRAND / VOICEOVER TICKER */}
                  <div className="relative z-10 bg-zinc-950/80 backdrop-blur-md p-2.5 rounded-lg border border-white/10 space-y-2">
                    {/* Active read-along speech subtitle ticker */}
                    <div className="flex gap-1.5 items-start">
                      <div className="h-5 w-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                        <Speaker className="h-3 w-3 text-zinc-400 animate-pulse" />
                      </div>
                      <p className="text-[10px] text-zinc-300 leading-normal text-left font-sans font-medium">
                        &ldquo;{activeSlide.dialogue}&rdquo;
                      </p>
                    </div>

                    {/* Integrated mini checkout url footer banner */}
                    <div className="border-t border-zinc-900 pt-1.5 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-zinc-500">Shopify Campaign Ad</span>
                      <span className="text-[9.5px] font-bold text-violet-400 flex items-center gap-1">
                        <Globe className="h-2.5 w-2.5 text-zinc-500" />
                        ai-market.online
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* VIDEO PLAYER METRIC BAR TIMELINE */}
              <div className="mt-5 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const nextIsPlaying = !isPlaying;
                        setIsPlaying(nextIsPlaying);
                      }}
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center transition border",
                        isPlaying 
                          ? "bg-amber-600/30 border-amber-500 text-amber-200" 
                          : "bg-violet-600/20 border-violet-500 text-violet-200 hover:bg-violet-500/30"
                      )}
                    >
                      {isPlaying ? <Pause className="h-4 w-4 fill-amber-200" /> : <Play className="h-4 w-4 fill-violet-200 ml-0.5" />}
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setPlaybackTime(0);
                        if (typeof window !== "undefined" && window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                        }
                        lastSpokenIndexRef.current = -1;
                      }}
                      className="h-8 w-8 rounded-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition"
                      title="Rewind / Restart"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>

                    <div className="text-xs text-zinc-400 ml-2">
                      Elapsed: <span className="font-bold text-zinc-200">{playbackTime.toFixed(1)}s</span> / {totalDuration}s
                    </div>
                  </div>

                  <div className="text-zinc-500 text-[11px]">
                    Tempo scale: {campaign.slides.length} slides
                  </div>
                </div>

                {/* TIMELINE PROGRESS SELECTION BAR */}
                <div className="relative h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900 flex">
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
                        {/* Background representing spent vs remaining */}
                        <div
                          className="absolute inset-0 bg-zinc-900"
                        />
                        {/* Highlight color depending on whether it's active */}
                        <div
                          className={cn(
                            "absolute left-0 top-0 bottom-0 transition-all duration-100",
                            isActive ? "bg-indigo-500" : playbackTime > offsetTime ? "bg-indigo-950/60" : "bg-transparent"
                          )}
                          style={{ width: isActive ? `${accumulatedProgress * 100}%` : "100%" }}
                        />
                        {/* Slide mark Label */}
                        <div className="absolute top-0 right-1 text-[8px] opacity-20 font-mono text-white">
                          S{s.id}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SLIDE VISUAL SEGMENT BADGES */}
                <div className="grid grid-cols-5 gap-1.5">
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
                          "py-1.5 px-1 rounded border text-center font-sans transition-all",
                          isActive
                            ? "bg-indigo-600/10 border-indigo-500 text-indigo-300 shadow"
                            : "bg-zinc-950/20 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                        )}
                      >
                        <div className="text-[10px] uppercase tracking-wider font-bold">
                          {s.sceneType}
                        </div>
                        <div className="text-[9px] opacity-60 font-mono mt-0.5">
                          {s.durationSec}s
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* TAB: STORYBOARD BLUEPRINT AND BUILDER */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-violet-500" />
                    Storyboard Campaign Blueprint
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Edit slide dialogs directly or copy Markdown prompts below.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="text-xs bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-zinc-300 flex items-center gap-1.5 transition active:scale-95"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Copied Markdown!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-zinc-500" />
                        Copy Script Strategy
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
                        "p-4 rounded-lg border transition",
                        isActive
                          ? "bg-zinc-900/80 border-indigo-500/40 shadow-md"
                          : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-850"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-zinc-900 px-2 py-0.5 rounded text-zinc-400 border border-zinc-800">
                            Scene {slide.id}
                          </span>
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                            {slide.sceneType}
                          </span>
                          <span className="text-[10px] bg-zinc-900/50 px-2 rounded-full text-zinc-500 border border-zinc-800">
                            {slide.durationSec} seconds
                          </span>
                        </div>

                        <button
                          onClick={() => setIsEditingSlide(isCurEditing ? null : slide.id)}
                          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          {isCurEditing ? "Collapse" : "Edit Slide"}
                        </button>
                      </div>

                      {/* STORYBOARD PREVIEW INFO */}
                      {!isCurEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                          {/* Dialogue spoken preview */}
                          <div className="md:col-span-4 bg-zinc-950/30 p-2.5 rounded border border-zinc-850">
                            <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider mb-1">
                              Voiceover monologue:
                            </span>
                            <p className="text-zinc-300 italic">&ldquo;{slide.dialogue}&rdquo;</p>
                          </div>

                          {/* Captions overlaid */}
                          <div className="md:col-span-4 bg-zinc-950/30 p-2.5 rounded border border-zinc-850">
                            <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider mb-1">
                              kinetic overlays:
                            </span>
                            <p className="font-bold text-white uppercase">{slide.visualText}</p>
                          </div>

                          {/* Cinemagraphic prompt description */}
                          <div className="md:col-span-4 bg-zinc-950/30 p-2.5 rounded border border-zinc-850">
                            <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider mb-1">
                              Layout prompt context:
                            </span>
                            <p className="text-zinc-400 line-clamp-2 md:line-clamp-none leading-relaxed">
                              {slide.description}
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* EXPANDED LIVE FORM EDITOR FIELDS */
                        <div className="space-y-3 pt-2 border-t border-zinc-850 mt-2 bg-zinc-950/40 p-3 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">
                                Bold Overlay Text
                              </label>
                              <input
                                type="text"
                                value={slide.visualText}
                                onChange={(e) => handleUpdateSlideField(slide.id, "visualText", e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">
                                Visual Transition Effect
                              </label>
                              <select
                                value={slide.visualEffect}
                                onChange={(e) => handleUpdateSlideField(slide.id, "visualEffect", e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                              >
                                <option value="zoom-in">Continuous Zoom (Aesthetic)</option>
                                <option value="panic-shake">Shock Wave Shake (Friction)</option>
                                <option value="pulsate">Soft Glow Pulsate (Trust)</option>
                                <option value="glow-flash">Glow Wave Flash (Surge)</option>
                                <option value="slide-left">Slick Slide-Left (Action)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">
                              Voiceover Spoken Monologue (Read-Aloud text)
                            </label>
                            <textarea
                              rows={2}
                              value={slide.dialogue}
                              onChange={(e) => handleUpdateSlideField(slide.id, "dialogue", e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">
                              Visual Prompt / Frame Cinematography
                            </label>
                            <input
                              type="text"
                              value={slide.description}
                              onChange={(e) => handleUpdateSlideField(slide.id, "description", e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-400 focus:outline-none focus:border-violet-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
