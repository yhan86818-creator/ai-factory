"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Camera, 
  Trash2, 
  Share2, 
  Copy, 
  X, 
  RefreshCw, 
  Skull, 
  Flame, 
  Ghost,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function RoastPage() {
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [tone, setTone] = useState("Medium");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [roasts, setRoasts] = useState<string[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const roastCardsRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRoast = async () => {
    const usedApiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!usedApiKey) {
      toast.error("API Key is required! Please enter your own Gemini API key in the field below.");
      return;
    }

    if (!input && !image) {
      toast.error("Give me something to roast, coward!");
      return;
    }

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(usedApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let prompt = `You are a savage, witty, and humorous AI roast master. 
      Your goal is to roast the user based on the provided ${image ? "image and " : ""}text.
      Tone: ${tone} (Playful, Medium, Brutal, No Mercy).
      
      Requirements:
      - Generate 3 to 5 separate roasts.
      - Make them sharp, funny, and personalized.
      - Be creative and use modern slang if appropriate.
      - Ensure they are not actual hate speech or genuinely harmful.
      - Format the output as a JSON array of strings. 
      - Return ONLY the JSON array.
      
      Input Text: ${input || "N/A"}
      `;

      let resultText = "";
      if (image) {
        const imageData = image.split(",")[1];
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: imageData,
              mimeType: "image/jpeg",
            },
          },
        ]);
        const response = await result.response;
        resultText = response.text();
      } else {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        resultText = response.text();
      }

      const parsedRoasts = parseRoasts(resultText);
      setRoasts(parsedRoasts);
      setIsGenerated(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#d946ef", "#3b82f6"]
      });
      toast.success("Burn level: CRITICAL");
    } catch (error: any) {
      console.error("Roast error:", error);
      toast.error(error.message || "Failed to generate roasts");
    } finally {
      setLoading(false);
    }
  };

  function parseRoasts(text: string): string[] {
    try {
      const match = text.match(/\[.*\]/s);
      if (match) {
        return JSON.parse(match[0]);
      }
      return text.split("\n").filter(line => line.trim().length > 0).slice(0, 5);
    } catch (e) {
      return [text];
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const shareToTwitter = (roast: string) => {
    const text = encodeURIComponent(`🔥 AI ROASTED ME: "${roast}"\n\nGenerate your own roast at RoastMe Savage! 💀`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const downloadRoastImage = async (index: number) => {
    if (roastCardsRef.current) {
      const card = roastCardsRef.current.children[index] as HTMLElement;
      const dataUrl = await toPng(card, { quality: 0.95 });
      const link = document.createElement("a");
      link.download = `roast-burn-${index + 1}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const reset = () => {
    setIsGenerated(false);
    setRoasts([]);
    setInput("");
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground p-4 md:p-8 font-sans">
      <Toaster position="top-center" theme="dark" richColors />
      
      <main className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl border border-primary/20 neon-border mb-4"
          >
            <Skull className="w-8 h-8 text-primary animate-pulse" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic neon-text">
            RoastMe <span className="text-primary">Savage</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium tracking-tight">
            The AI that actually hates you. <span className="text-foreground">Upload a bio or photo and get burned.</span>
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isGenerated ? (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid gap-8"
            >
              <Card className="glass border-primary/20 overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Feed the Beast
                  </CardTitle>
                  <CardDescription>Input your bio, name, or a photo to get roasted.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Text Input */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">User Info / Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="e.g. 'Software engineer who loves coffee and complaining about CSS'"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="min-h-[120px] bg-background/50 border-primary/10 focus-visible:ring-primary focus-visible:border-primary text-lg"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Visual Roast (Optional)</Label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative aspect-video rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${image ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50 bg-muted/5'}`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      {image ? (
                        <>
                          <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg opacity-80" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Trash2 className="w-8 h-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <Camera className="w-10 h-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Click to upload a selfie or screenshot</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Burn Intensity</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="bg-background/50 border-primary/10 h-12">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent className="glass border-primary/20">
                          <SelectItem value="Playful">🍦 Playful (Soft)</SelectItem>
                          <SelectItem value="Medium">🔥 Medium (Crispy)</SelectItem>
                          <SelectItem value="Brutal">🧨 Brutal (Devastating)</SelectItem>
                          <SelectItem value="No Mercy">💣 NO MERCY (War Crimes)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Your API Key (Optional)</Label>
                      <Input
                        type="password"
                        placeholder="Gemini API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="bg-background/50 border-primary/10 h-12"
                      />
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Info className="w-3 h-3" /> Helps us keep it free for everyone.
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={generateRoast} 
                    disabled={loading}
                    className="w-full h-16 text-xl font-black uppercase tracking-tighter shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                  >
                    {loading ? (
                      <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                    ) : (
                      <Zap className="w-6 h-6 mr-2 fill-current" />
                    )}
                    {loading ? "Analyzing Failures..." : "Initialize Roast Sequence"}
                  </Button>
                </CardContent>
              </Card>

              <div className="text-center p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">
                  ⚠️ Safety Note: This is an AI. It's meant to be funny, not hurtful. Use with a grain of salt.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="output-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={reset} className="text-muted-foreground hover:text-foreground">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Roast Someone Else
                </Button>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Target Terminated</span>
                </div>
              </div>

              <div ref={roastCardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roasts.map((roast, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass relative h-full border-primary/30 group hover:border-primary transition-all overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary/30 opacity-50" />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Burn #{i + 1}</span>
                          <Ghost className="w-4 h-4 text-primary/40" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <p className="text-xl font-bold italic leading-tight text-foreground/90">
                          "{roast}"
                        </p>
                        <div className="flex items-center gap-2 pt-4">
                          <Button size="icon" variant="secondary" onClick={() => copyToClipboard(roast)} className="w-8 h-8 rounded-lg">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="secondary" onClick={() => shareToTwitter(roast)} className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white">
                            <X className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="secondary" onClick={() => downloadRoastImage(i)} className="w-8 h-8 rounded-lg">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 flex flex-col items-center gap-6">
                <Button 
                  size="lg" 
                  onClick={reset} 
                  className="px-12 h-16 text-xl font-black uppercase rounded-full neon-border hover:scale-110 transition-transform"
                >
                  GO AGAIN 💀
                </Button>
                <div className="flex items-center gap-8 text-muted-foreground opacity-50">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Skull className="w-4 h-4" /> 1M+ Burns</span>
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Flame className="w-4 h-4" /> Trending</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-24 py-12 border-t border-muted/20 text-center">
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
          Built for the brave by <span className="text-primary">Antigravity AI</span>
        </p>
        <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground underline decoration-primary/30">
          <a href="#">Terms of Roast</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Victim Support</a>
        </div>
      </footer>
    </div>
  );
}
