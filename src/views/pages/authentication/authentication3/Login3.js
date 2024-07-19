import React from 'react';
import { CssBaseline, Container, useMediaQuery, useTheme } from '@mui/material';
import LoginForm from '../LoginForm';
import loginAnimation from './loginAnimation.mp4';

const Login3 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ padding: 0 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5'
          }}
        >
          {!isMobile && (
            <div
              style={{
                flex: '1',
                backgroundColor: 'white',
                height: '100%',
                boxSizing: 'border-box',
                order: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '1px solid #e0e0e0'
              }}
            >
              <video style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={loginAnimation} autoPlay muted loop />
            </div>
          )}
          <div
            style={{
              flex: '1',
              backgroundColor: 'white',
              padding: isMobile ? '2rem 1rem' : '3rem',
              boxSizing: 'border-box',
              order: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeft: !isMobile ? '1px solid #e0e0e0' : 'none',
              boxShadow: isMobile ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <LoginForm />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login3;
