import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  bucket: string;
  currentImageUrl?: string | null;
  onImageChange: (url: string | null) => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  userId?: string; // For folder organization
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  bucket,
  currentImageUrl,
  onImageChange,
  disabled = false,
  accept = "image/*",
  maxSize = 5,
  userId
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    console.log('🔄 [IMAGE_UPLOAD] Starting upload for file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      bucket
    });

    if (file.size > maxSize * 1024 * 1024) {
      console.error('❌ [IMAGE_UPLOAD] File too large:', file.size, 'max:', maxSize * 1024 * 1024);
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = userId ? `${userId}/${fileName}` : fileName;

      console.log('📤 [IMAGE_UPLOAD] Uploading to bucket:', bucket, 'path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ [IMAGE_UPLOAD] Upload error:', uploadError);
        throw uploadError;
      }

      console.log('✅ [IMAGE_UPLOAD] Upload successful, getting public URL');

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('✅ [IMAGE_UPLOAD] Public URL generated:', data.publicUrl);

      onImageChange(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully.",
      });
    } catch (error) {
      console.error('💥 [IMAGE_UPLOAD] Error uploading image:', error);
      toast({
        title: "Error",
        description: `Failed to upload image: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    onImageChange(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`${bucket}-upload`}>{label}</Label>
      
      {currentImageUrl ? (
        <div className="relative">
          <div className="border rounded-lg p-4 bg-muted/50">
            <img
              src={currentImageUrl}
              alt={label}
              className="max-h-32 max-w-full object-contain mx-auto"
            />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-2">
            <Image className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              {uploading ? (
                "Uploading..."
              ) : (
                <>
                  <span className="font-medium">Click to upload</span> or drag and drop
                  <br />
                  <span className="text-xs">PNG, JPG, GIF up to {maxSize}MB</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Input
        ref={fileInputRef}
        id={`${bucket}-upload`}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />
    </div>
  );
};