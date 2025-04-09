'use client';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component='footer'
      sx={{
        py: 3,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth='lg'>
        <Typography variant='body2' color='text.secondary' align='center'>
          {'© '}
          {new Date().getFullYear()}{' '}
          <MuiLink color='inherit' href='/'>
            Image Gallery
          </MuiLink>
          {' - Built with Next.js, TypeScript, and Material UI'}
        </Typography>
      </Container>
    </Box>
  );
}
