import { Container, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Image Gallery
      </Typography>
      <ImageGallery />
    </Container>
  );
}
