"use client"
import { useState } from "react"
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Chip, Box, Skeleton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import type { ImageType } from "@/types/image"

interface ImageCardProps {
  image: ImageType
  onImageClick: () => void
  onDeleteClick: () => void
}

export default function ImageCard({ image, onImageClick, onDeleteClick }: ImageCardProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ position: "relative", pt: "75%" }}>
        {!loaded && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}
        <CardMedia
          component="img"
          image={image.url}
          alt={image.title || "Gallery image"}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: loaded ? "block" : "none",
          }}
          onLoad={() => setLoaded(true)}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" noWrap>
          {image.title || "Untitled"}
        </Typography>

        {image.tags && image.tags.length > 0 && (
          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {image.tags.slice(0, 3).map((tag, index) => (
              <Chip key={index} label={tag} size="small" />
            ))}
            {image.tags.length > 3 && <Chip label={`+${image.tags.length - 3}`} size="small" variant="outlined" />}
          </Box>
        )}
      </CardContent>

      <CardActions disableSpacing>
        <IconButton aria-label="view image" onClick={onImageClick}>
          <ZoomInIcon />
        </IconButton>
        <IconButton aria-label="delete image" onClick={onDeleteClick} sx={{ marginLeft: "auto" }}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
