import React from 'react';
import { Button, Typography, Card, Grid } from '@mui/material';
import CompanyCard from 'ui-component/cards/CompanyCard'; // Adjust the import path as necessary
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const CardContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  width: '100%' // Ensures the content stretches to full width
}));

const InnerCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#a256f8',
  padding: theme.spacing(2),
  width: '100%', // Ensures the inner card stretches to full width
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center' // Center content vertically
}));

const ClaimButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

const TrainingBonus = () => {
  const trainingBonus = process.env.REACT_APP_TRAINING_BONUS;
  const trainingFee = process.env.REACT_APP_TRAINING_FEE;
  const navigate = useNavigate();

  const handleClaimButtonClick = () => {
    navigate('/payments/upload');
  };

  return (
    <Grid item xs={12} sm={12} md={4} lg={4}>
      <CompanyCard style={{ width: '100%' }}>
        <CardContent>
          <InnerCard>
            <Typography
              variant="h3"
              sx={{
                fontSize: 18,
                mb: 1,
                color: '#FFFFFF',
                textAlign: 'center' // Center text horizontally
              }}
            >
              Training Bonus
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: 18,
                color: '#FFFFFF',
                mb: 3,
                textAlign: 'center' // Center text horizontally
              }}
            >
              PKR {trainingBonus}
            </Typography>
            <Typography
              variant="h5"
              style={{
                color: '#FFFFFF',
                textAlign: 'center' // Center text horizontally
              }}
            >
              Training Fee: PKR {trainingFee}
            </Typography>
          </InnerCard>
          <ClaimButton variant="contained" onClick={handleClaimButtonClick}>
            Claim Now
          </ClaimButton>
        </CardContent>
      </CompanyCard>
    </Grid>
  );
};

export default TrainingBonus;
