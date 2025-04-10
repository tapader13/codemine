'use client';
import { useState, useRef, type ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Chip,
  IconButton,
  Grid,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';

interface ImageUploadProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PreviewImage {
  file: File;
  preview: string;
  title: string;
  tags: string[];
}

export default function ImageUpload({
  open,
  onClose,
  onSuccess,
}: ImageUploadProps) {
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [tag, setTag] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter((file) =>
      file.type.startsWith('image/')
    );

    if (validFiles.length === 0) {
      setError('Please select valid image files');
      return;
    }

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.split('.')[0],
      tags: [],
    }));

    setImages([...images, ...newImages]);
    setActiveImageIndex(images.length);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);

    if (activeImageIndex >= newImages.length) {
      setActiveImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  const handleTitleChange = (value: string) => {
    if (images.length === 0) return;

    const newImages = [...images];
    newImages[activeImageIndex].title = value;
    setImages(newImages);
  };

  const handleAddTag = () => {
    if (!tag.trim() || images.length === 0) return;

    const newImages = [...images];
    if (!newImages[activeImageIndex].tags.includes(tag.trim())) {
      newImages[activeImageIndex].tags.push(tag.trim());
      setImages(newImages);
    }
    setTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (images.length === 0) return;

    const newImages = [...images];
    newImages[activeImageIndex].tags = newImages[activeImageIndex].tags.filter(
      (t) => t !== tagToRemove
    );
    setImages(newImages);
  };

  const handleUpload = async () => {
    if (images.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const uploadPromises = images.map(async (img) => {
        const formData = new FormData();
        formData.append('file', img.file);
        formData.append('title', img.title);
        formData.append('tags', JSON.stringify(img.tags));
        console.log(`formData`, formData, img.file, img.title, img.tags);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Failed to upload ${img.file.name}`);
        }

        return await res.json();
      });
      console.log(`uploadPromises`, uploadPromises);
      await Promise.all(uploadPromises);

      // Clean up previews
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (uploading) return;

    // Clean up previews
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setError('');
    setTag('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
      PaperProps={{ sx: { height: { sm: 'auto', md: '80vh' } } }}
    >
      <DialogTitle>
        Upload Images
        <IconButton
          aria-label='close'
          onClick={handleClose}
          disabled={uploading}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Button
            variant='outlined'
            component='label'
            startIcon={<CloudUploadIcon />}
            disabled={uploading}
            fullWidth
          >
            Select Images
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              multiple
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </Box>

        {images.length > 0 ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 200, sm: 300, md: 400 },
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  overflow: 'hidden',
                  mb: 2,
                }}
              >
                <Image
                  src={images[activeImageIndex].preview || '/placeholder.svg'}
                  alt='Preview'
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {images.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border:
                        index === activeImageIndex
                          ? '2px solid primary.main'
                          : 'none',
                      opacity: index === activeImageIndex ? 1 : 0.7,
                      '&:hover': { opacity: 1 },
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={img.preview || '/placeholder.svg'}
                      alt={`Thumbnail ${index}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <IconButton
                      size='small'
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        p: 0.5,
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                    >
                      <CloseIcon fontSize='small' />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant='subtitle1' gutterBottom>
                Image Details
              </Typography>

              <TextField
                label='Title'
                fullWidth
                margin='normal'
                value={images[activeImageIndex]?.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                disabled={uploading || images.length === 0}
              />

              <Box sx={{ mt: 2 }}>
                <Typography variant='subtitle2' gutterBottom>
                  Tags
                </Typography>

                <Box sx={{ display: 'flex', mb: 1 }}>
                  <TextField
                    size='small'
                    placeholder='Add a tag'
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    disabled={uploading || images.length === 0}
                    fullWidth
                  />
                  <Button
                    onClick={handleAddTag}
                    disabled={uploading || !tag.trim() || images.length === 0}
                    sx={{ ml: 1 }}
                  >
                    <AddIcon />
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {images[activeImageIndex]?.tags.map((t, i) => (
                    <Chip
                      key={i}
                      label={t}
                      onDelete={() => handleRemoveTag(t)}
                      disabled={uploading}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 300,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <CloudUploadIcon
              sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant='h6' color='text.secondary'>
              No images selected
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Click &quot;Select Images&quot; to upload
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant='contained'
          disabled={uploading || images.length === 0}
          startIcon={uploading ? <CircularProgress size={20} /> : null}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
