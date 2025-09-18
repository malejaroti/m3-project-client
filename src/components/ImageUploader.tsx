// ImageUploader.tsx
import { useEffect, useId, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteOutline from '@mui/icons-material/DeleteOutline';

type ImageUploaderProps = {
  onFileSelect?: (file: File | null) => void;
  maxSizeMB?: number; // default 5MB
  accepted?: string; // default "image/*"
  imageTimelineItem?: string
  label?: string; // button text
};

export default function ImageUploader({
  onFileSelect,
  maxSizeMB = 5,
  accepted = 'image/*',
  imageTimelineItem,
  label = imageTimelineItem ? "Change Image" : 'Upload image', // If card already has an image, then change button label
}: ImageUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFileSelected, setIsFileSelected] = useState(false);

  const previewUrl = file ? URL.createObjectURL(file): ""
  useEffect(() => {
    console.log("Mounted Image Uploader component or updated previewURL", previewUrl)
    return () => {
      console.log("Unmounted component", previewUrl)
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {

    const selectedFile = e.target.files?.[0];
    console.log('file selected: ', selectedFile);
    if (!selectedFile) return;

    // File validations
    // Check it is an image
    if (!selectedFile.type.startsWith('image/')) {
      setError('The selected file is not an image.');
      resetFileInput();
      return;
    }
    
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxBytes) {
      setError(`Image exceeds ${maxSizeMB}MB.`);
      resetFileInput();
      return;
    }

    setError(null);
    setFile(selectedFile);
    setIsFileSelected(true)
    onFileSelect?.(selectedFile);
  };

  const resetFileInput = () => {
    setFile(null);
    setIsFileSelected(false)
    onFileSelect?.(null);
    if (inputRef.current) inputRef.current.value = ''; // allow re-selecting the same file
  };

  return (
    <Stack spacing={2} sx={{ alignSelf: 'center' }}>
      <Box>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accepted}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <label htmlFor={inputId}>
          <Button
            variant="outlined"
            component="span"
            color="primary"
            startIcon={<PhotoCamera />}
          >
            {file ? 'Change image' : label}
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
            sx={{ aspectRatio: '16 / 9', objectFit: 'contain' }}
          />
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600}>
              {file.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type}
            </Typography>
          </CardContent>
        </Card>
      )}

      {imageTimelineItem && (
        <Card variant="outlined" sx={{ maxHeight: 350, p: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {
            isFileSelected && <Typography variant='h6' align='center' sx={{ mb: 2 }}>Previous Image</Typography>
          }
          <CardMedia
            component="img"
            image={imageTimelineItem}
            alt={imageTimelineItem}
            sx={{ flex: 1, minHeight: 0, aspectRatio: '1 / 1', objectFit: 'contain' }}
          />
        </Card>
      )}
    </Stack>
  );
}
