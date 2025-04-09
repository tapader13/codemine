'use client';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import type { ImageType } from '@/types/image';

interface ImagePreviewProps {
  open: boolean;
  image: ImageType | null;
  onClose: () => void;
}

export default function ImagePreview({
  open,
  image,
  onClose,
}: ImagePreviewProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (!image) return null;
  console.log(image);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      fullScreen={fullScreen}
    >
      <IconButton
        aria-label='close'
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'white',
          bgcolor: 'rgba(0,0,0,0.5)',
          zIndex: 1,
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.7)',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0, overflow: 'hidden', bgcolor: 'white' }}>
        <Box sx={{ position: 'relative', width: '100%', height: '80vh' }}>
          <Image
            src={image.url || '/placeholder.svg'}
            alt={image.title || 'Image preview'}
            fill
            style={{ objectFit: 'contain' }}
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(0,0,0,0.7)',
            color: 'white',
            p: 2,
          }}
        >
          <Typography variant='h6'>{image.title || 'Untitled'}</Typography>

          {image.tags && image.tags.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {image.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size='small'
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '& .MuiChip-label': { color: 'white' },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
