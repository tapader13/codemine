'use client';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <AppBar position='static' color='default' elevation={1}>
      <Container maxWidth='lg'>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Link
            href='/'
            passHref
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='h6'
                component='div'
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1,
                  mr: 5,
                }}
              >
                Minhaj
              </Typography>
              <Typography variant='h6' component='div'>
                Image Gallery
              </Typography>
            </Box>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
