// ImageUploader.tsx
import { useEffect, useId, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

type ImageUploaderProps = {
  onFileSelect?: (file: File | null) => void;
  maxSizeMB?: number; // default 5MB
  accepted?: string; // default "image/*"
  label?: string;
  //   formDataSetter: React.SetStateAction
};

export default function ImageUploader({
  onFileSelect,
  maxSizeMB = 5,
  accepted = "image/*",
  label = "Upload image",
}: ImageUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // for a loading animation effect

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    console.log("file selected: ", f);
    if (!f) return;

    // Basic validation
    if (!f.type.startsWith("image/")) {
      setError("The selected file is not an image.");
      resetFileInput();
      return;
    }
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (f.size > maxBytes) {
      setError(`Image exceeds ${maxSizeMB}MB.`);
      resetFileInput();
      return;
    }

    setError(null);
    setFile(f);
    onFileSelect?.(f);
  };

  const resetFileInput = () => {
    setFile(null);
    onFileSelect?.(null);
    if (inputRef.current) inputRef.current.value = ""; // allow re-selecting the same file
  };

  

  return (
    <Stack spacing={2} sx={{ alignSelf: "center" }}>
      <Box>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accepted}
          onChange={handleSelect}
          style={{ display: "none" }}
        />
        <label htmlFor={inputId}>
          <Button
            variant="outlined"
            component="span"
            color="primary"
            startIcon={<PhotoCamera />}
          >
            {file ? "Change image" : label}
          </Button>
        </label>
        {file && (
          <Button
            sx={{ ml: 1 }}
            variant="text"
            color="error"
            startIcon={<DeleteOutline />}
            onClick={resetFileInput}
          >
            Remove
          </Button>
        )}
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {file && (
        <Card variant="outlined" sx={{ maxWidth: 420 }}>
          <CardMedia
            component="img"
            image={previewUrl}
            alt={file.name}
            sx={{ aspectRatio: "16 / 9", objectFit: "cover" }}
          />
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600}>
              {file.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type}
            </Typography>
          </CardContent>
          {/* <CardActions>
            <Button size="small" onClick={() => inputRef.current?.click()}>
              Replace
            </Button>
            <Button size="small" color="error" onClick={resetFileInput}>
              Delete
            </Button>
          </CardActions> */}
        </Card>
      )}
    </Stack>
  );
}
