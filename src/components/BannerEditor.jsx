import { useState, useEffect } from "react";
import { useSystemStatus } from "@/context/SystemStatusContext";
import api from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, Plus, Image as ImageIcon, Save, RefreshCcw, Loader2, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function BannerEditor() {
  const { status, refreshStatus, isLoading } = useSystemStatus();
  const { toast } = useToast();
  
  const [imageUrl, setImageUrl] = useState("");
  const [texts, setTexts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isLoading && !isInitialized && status) {
      setImageUrl(status.hero_banner_image || "");
      setTexts(status.hero_banner_texts?.length > 0 ? status.hero_banner_texts : [""]);
      setIsInitialized(true);
    }
  }, [status, isLoading, isInitialized]);

  const uploadToSupabase = async (file) => {
    if (!file) return;
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-banner-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('public-assets')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });
        
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('public-assets')
        .getPublicUrl(fileName);
        
      setImageUrl(publicUrl);
      toast({ title: "Image uploaded!", description: "Click Save Changes to apply." });
    } catch (err) {
      toast({ variant: "destructive", title: "Upload Failed", description: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) uploadToSupabase(file);
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) uploadToSupabase(file);
  };

  const handleTextChange = (index, value) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const handleAddText = () => {
    setTexts([...texts, ""]);
  };

  const handleRemoveText = (index) => {
    const newTexts = texts.filter((_, i) => i !== index);
    if (newTexts.length === 0) newTexts.push("");
    setTexts(newTexts);
  };

  const handleResetToDefault = () => {
    setImageUrl("");
    toast({ title: "Image reset to default. Don't forget to save." });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const cleanTexts = texts.filter(t => t.trim() !== "");
      await api.patch('/system/banner', {
        hero_banner_image: imageUrl,
        hero_banner_texts: cleanTexts
      });
      
      toast({ title: "Success", description: "Banner settings updated successfully!" });
      refreshStatus(); // Refresh global context
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.response?.data?.message || "Failed to update banner." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-lg rounded-2xl">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
        <CardTitle className="text-lg font-bold text-[#4d148c] flex items-center gap-2">
          <ImageIcon className="w-5 h-5" /> Hero Banner Settings
        </CardTitle>
        <CardDescription>
          Customize the dashboard banner image and scrolling announcements.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Cover Photo Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cover Photo</h3>
              <p className="text-xs text-slate-500 mb-2">
                Recommended size: 1200x300 pixels (or a wide 16:9 ratio) for best quality.
              </p>
            </div>
            <Button variant="outline" onClick={handleResetToDefault} className="rounded-xl border-slate-200 text-slate-600 hover:text-red-600">
              <RefreshCcw className="w-4 h-4 mr-2" /> Reset Default
            </Button>
          </div>
          
          <div 
            className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center relative overflow-hidden"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('banner-upload').click()}
          >
            <input 
              type="file" 
              id="banner-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileSelect}
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff7e28]" />
                <p className="text-sm font-bold text-slate-500">Uploading...</p>
              </div>
            ) : imageUrl ? (
              <div className="w-full relative group">
                <img src={imageUrl} alt="Banner Preview" className="w-full h-32 md:h-48 object-cover rounded-xl shadow-inner" onError={(e) => e.target.style.display='none'} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <p className="text-white font-bold text-sm flex items-center"><UploadCloud className="w-5 h-5 mr-2" /> Click or drag to replace</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-16 h-16 bg-[#ff7e28]/10 text-[#ff7e28] rounded-full flex items-center justify-center">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500">JPG, PNG, WEBP up to 5MB</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center mt-2">
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap">OR Paste URL:</span>
            <Input 
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="h-8 text-xs rounded-lg"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Marquee Texts Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Scrolling Announcements</h3>
            <p className="text-xs text-slate-500 mb-2">
              These messages will scroll continuously across the bottom of the banner.
            </p>
          </div>
          
          <div className="space-y-3">
            {texts.map((text, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-xs font-bold text-slate-400 w-6">{index + 1}.</span>
                <Input 
                  placeholder="e.g., Reminder: Submit your ideas by Friday!"
                  value={text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  className="flex-1 rounded-xl"
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveText(index)} className="text-slate-400 hover:text-red-500 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button variant="outline" onClick={handleAddText} className="rounded-xl text-[#ff7e28] border-[#ff7e28]/20 hover:bg-[#ff7e28]/10 w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Add Message
          </Button>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#ff7e28] hover:bg-[#ff7e28]/90 text-white rounded-xl px-8 font-bold">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
