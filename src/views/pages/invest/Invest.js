import React, { useState, useEffect } from 'react';
import { Typography, Grid, IconButton, Box } from '@mui/material';
import axios from 'axios';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InvestCard from './InvestCard';

const Invest = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_HOST}/api/plans`)
      .then((response) => {
        setPlans(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the plans!', error);
        setLoading(false);
      });
  }, []);

  const handlePlanClick = (plan) => {
    // Store plan in a persistent state
    localStorage.setItem('selectedPlan', JSON.stringify(plan));
    navigate('/payments/referral/upload');
  };

  return (
    <div>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} color="primary">
          <ArrowBack />
        </IconButton>
        <Typography variant="h3" gutterBottom sx={{ marginLeft: 2, paddingTop: '7px', color: 'secondary.dark' }}>
          Choose Investment Plan for Referral
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <InvestCard plan={plan} onClick={() => handlePlanClick(plan)} isLoading={loading} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Invest;
