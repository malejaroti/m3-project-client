import { useState } from 'react';
import api from '../services/config.services';
import { useNavigate } from 'react-router';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteOutline from '@mui/icons-material/DeleteOutline';

function CloudinaryImageUploader() {
  // below state will hold the image URL from cloudinary. This will come from the backend.
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // for a loading animation effect
  const navigate = useNavigate();

  // below function should be the only function invoked when the file type input changes => onChange={handleFileUpload}
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || !event.target.files[0]) {
      // to prevent accidentally clicking the choose file button and not selecting a file
      return;
    }
    console.log('The file to be uploaded is: ', event.target.files[0]);

    setIsUploading(true); // to start the loading animation

    const uploadData = new FormData(); // images and other files need to be sent to the backend in a FormData
    uploadData.append('image', event.target.files[0]);
    //                   |
    //     this name needs to match the name used in the middleware in the backend => uploader.single("image")

    try {
      const response = await api.post('/upload', uploadData);
      console.log('response image upload: ', response);

      setImageUrl(response.data.imageUrl);
      //                          |
      //     this is how the backend sends the image to the frontend => res.json({ imageUrl: req.file.path });

      setIsUploading(false); // to stop the loading animation
    } catch (error) {
      navigate('/error');
    }
  };

  const resetFileInput = () => {
    setImageUrl(null);
    // onFileSelect?.(null);
    // if (inputRef.current) inputRef.current.value = ""; // allow re-selecting the same file
  };

  return (
    <>
      <Typography variant="h6">Attemps Cloudinary</Typography>
      <div>
        <label>IMAGE: </label>
        <input
          type="file"
          name="image"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="border p-2"
        />
        {/* below disabled prevents the user from attempting another upload while one is already happening */}
      </div>

      {/* to render a loading message or spinner while uploading the picture */}
      {isUploading ? <h3>... uploading image</h3> : null}

      {/* below line will render a preview of the image from cloudinary */}
      {imageUrl ? (
        <div>
          <img src={imageUrl} alt="img" width={200} />
        </div>
      ) : null}

      <Stack spacing={2} sx={{ alignSelf: 'center' }}>
        <Box>
          <input
            // id={inputId}
            id="image-invisible-input"
            // ref={inputRef}
            type="file"
            // accept={accepted}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-invisible-input">
            <Button
              variant="outlined"
              component="span"
              color="primary"
              startIcon={<PhotoCamera />}
              loading={isUploading}
              loadingPosition="end"
              // onClick={handleFileUpload}
            >
              {imageUrl ? 'Change image' : 'Upload image (through Cloudinary)'}
            </Button>
          </label>
          {imageUrl && (
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

        {/* {error && (
            <Typography color="error" variant="body2">
            {error}
            </Typography>
        )} */}

        {imageUrl && (
          <Card variant="outlined" sx={{ maxWidth: 420 }}>
            <CardMedia
              component="img"
              image={imageUrl}
              // alt={file.name}
              sx={{ aspectRatio: '16 / 9', objectFit: 'contain' }}
            />
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>
                {/* {file.name} */}
                file name
              </Typography>
              {/* <Typography variant="body2" color="text.secondary">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type}
                </Typography> */}
            </CardContent>
          </Card>
        )}
      </Stack>
    </>
  );
}
export default CloudinaryImageUploader;
