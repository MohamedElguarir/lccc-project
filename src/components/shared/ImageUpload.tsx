"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Icons } from "@/assets/icons";
import useUpload from "@/hooks/use-cloudinary-upload";
import { X } from "lucide-react";
import { Gauge } from "../ui/gauge";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  let [progress, setProgress] = useState<null | number>(null);
  const { upload } = useUpload();
  let [preview, setPreview] = useState<string | null>(null);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));
      upload({
        file,
        onUploadProgress: (progress) => {
          setProgress(progress);
        },
        onUploadComplete: (url) => {
          onChange(url);
          setProgress(null);
          URL.revokeObjectURL(preview ?? "");
        },
      });
    },
    multiple: false,
    onDropRejected: (fileRejections) => {
      toast.error("The file you uploaded is not an image, try again!");
    },
  });

  if (progress)
    return (
      <div className="relative flex flex-col items-center justify-center w-full border-2 rounded-lg h-44 border-border">
        {preview && (
          <img
            src={preview}
            className="object-cover w-full h-full rounded-lg"
          />
        )}
        <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-50 rounded-lg">
          <Gauge value={progress} showValue size="medium" />
        </div>
      </div>
    );

  if (value)
    return (
      <div className="relative flex items-center justify-center w-full border-2 rounded-lg h-44 border-border">
        <img
          src={value}
          alt="article image"
          className="object-cover w-full h-full rounded-lg"
        />
        <Button
          type="button"
          className="absolute p-0 shadow w-7 h-7 top-1 right-1"
          size={"sm"}
          variant={"outline"}
          onClick={() => onChange("")}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );

  return (
    <div
      className={cn(
        "w-full h-44 border-2 flex-col gap-2 transition-colors duration-200 border-dashed rounded-lg border-border flex items-center justify-center",
        isDragActive && "border-primary",
        isDragReject && "border-destructive",
        isDragAccept && "border-green-600",
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <>
          <span className="text-lg font-medium text-center text-muted-foreground">
            Drop the file here...
          </span>
        </>
      ) : (
        <>
          <Button
            type="button"
            variant={"outline"}
            size={"xs"}
            className="px-4 py-1 text-xs rounded-full h-7"
          >
            <Icons.cloudUpload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <span className="text-xs font-medium text-muted-foreground">
            Only images are allowed (png, jpg, jpeg, webp).
          </span>
        </>
      )}
    </div>
  );
};

export default ImageUpload;
