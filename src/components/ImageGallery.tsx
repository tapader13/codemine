'use client';
import { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import ImageCard from './ImageCard';
import ImagePreview from './ImagePreview';
import type { ImageType } from '@/types/image';
import InfiniteScroll from './InfiniteScroll';
import ImageUpload from './ImageUpload';
import DeleteConfirmation from './DeleteConfirmation';

export default function ImageGallery() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchImages = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/images?page=${pageNum}&limit=12`);

      if (!res.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await res.json();
      console.log(data);
      if (reset) {
        setImages(data.images);
      } else {
        setImages(data.images);

        // setImages((prev) => [...prev, ...data.images]);
      }

      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load images. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredImages(images);
    } else {
      const filtered = images.filter(
        (img) =>
          img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (img.tags &&
            img.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
      setFilteredImages(filtered);
    }
  }, [searchTerm, images]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchImages(page + 1);
    }
  };

  const handleUploadSuccess = () => {
    setUploadOpen(false);
    setTimeout(() => {
      fetchImages(1, true);
    }, 2000);
  };
  const handleImageClick = (image: ImageType) => {
    setSelectedImage(image);
  };

  const handleDeleteClick = (image: ImageType) => {
    setImageToDelete(image);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;

    try {
      const res = await fetch(`/api/images/${imageToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete image');
      }

      setImages(images.filter((img) => img.id !== imageToDelete.id));
      setDeleteConfirmOpen(false);
      setImageToDelete(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete image. Please try again.');
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Button
          variant='contained'
          startIcon={<CloudUploadIcon />}
          onClick={() => setUploadOpen(true)}
        >
          Upload Images
        </Button>

        <TextField
          placeholder='Search by title or tags'
          size='small'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        />
      </Box>

      {error && (
        <Typography color='error' sx={{ my: 2 }}>
          {error}
        </Typography>
      )}

      <InfiniteScroll
        loadMore={handleLoadMore}
        hasMore={hasMore}
        loading={loading}
        endMessage={
          filteredImages.length === 0 ? (
            <Typography align='center' sx={{ my: 4 }}>
              {searchTerm
                ? 'No images match your search'
                : 'No images uploaded yet'}
            </Typography>
          ) : (
            <Typography align='center' sx={{ my: 4 }}>
              You&apos;ve reached the end!
            </Typography>
          )
        }
      >
        <Grid container spacing={3}>
          {filteredImages.map((image) => (
            <Grid item key={image.id} xs={12} sm={6} md={4} lg={3}>
              <ImageCard
                image={image}
                onImageClick={() => handleImageClick(image)}
                onDeleteClick={() => handleDeleteClick(image)}
              />
            </Grid>
          ))}
        </Grid>

        {loading && page === 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </InfiniteScroll>

      <ImageUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      <ImagePreview
        open={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <DeleteConfirmation
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}
