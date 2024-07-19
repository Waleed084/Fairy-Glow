import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Grid, Card, CardMedia, Paper, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'views/pages/authentication/AuthContext';

const ReferralPaymentVerification = () => {
  const navigate = useNavigate();
  const { username } = useAuth(); // Assuming you have an authentication context providing username
  // Fetch selected plan details from localStorage
  const selectedPlan = JSON.parse(localStorage.getItem('selectedPlan'));

  const [transactionId, setTransactionId] = useState('');
  const [transactionAmount, setTransactionAmount] = useState(0); // Default value
  const [gateway, setGateway] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Effect to set transactionAmount initially from selectedPlan
  useEffect(() => {
    if (selectedPlan && selectedPlan.price) {
      setTransactionAmount(selectedPlan.price);
    }
  }, [selectedPlan]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('transactionId', transactionId);
    formData.append('transactionAmount', selectedPlan.price); // Use selected plan's price
    formData.append('gateway', gateway);
    formData.append('image', image);

    // Append selected plan details to formData
    formData.append('planName', selectedPlan.name);
    formData.append('planPRICE', selectedPlan.price);
    formData.append('advancePoints', selectedPlan.advancePoints);
    formData.append('DirectPoint', selectedPlan.DirectPoint);
    formData.append('IndirectPoint', selectedPlan.IndirectPoint);
    formData.append('parent', parseFloat(selectedPlan.parent));
    formData.append('grandParent', parseFloat(selectedPlan.grandParent));

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/referral-payment/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Form submitted:', response.data);
      setSuccessMessage('Referral Payment details uploaded successfully.');
      setErrorMessage('');

      // Reset form state after submission
      setTransactionId('');
      setTransactionAmount(0); // Reset to default
      setGateway('');
      setImage(null);

      // Remove selectedPlan from localStorage
      localStorage.removeItem('selectedPlan');

      // Navigate to success page or previous page
      setTimeout(() => {
        navigate('/payments/referral/plans'); // Navigate to success page after submission
      }, 2000); // Adjust timing as needed
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Error submitting form. Please try again.');
      setSuccessMessage('');
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      alert('Please select an image file.');
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom sx={{ color: 'secondary.main', textAlign: 'center' }}>
          Upload Payment Verification Details
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              id="transactionId"
              label="Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel id="transactionAmount-label">Transaction Amount</InputLabel>
              <Select
                labelId="transactionAmount-label"
                id="transactionAmount"
                value={transactionAmount} // Use selected plan's price
                onChange={(e) => setTransactionAmount(e.target.value)}
                label="Transaction Amount"
              >
                <MenuItem value={transactionAmount}>{transactionAmount}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel id="gateway-label">Gateway/Bank</InputLabel>
              <Select
                labelId="gateway-label"
                id="gateway"
                value={gateway}
                onChange={(e) => setGateway(e.target.value)}
                label="Gateway/Bank"
              >
                <MenuItem value="JazzCash">JazzCash</MenuItem>
                <MenuItem value="Easypaisa">Easypaisa</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              </Select>
            </FormControl>
            <input accept="image/*" id="image-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span" sx={{ marginTop: 2 }}>
                Upload Screenshot (Image)
              </Button>
            </label>
            {image && (
              <Card sx={{ maxWidth: 300, marginTop: 2 }}>
                <CardMedia component="img" height="auto" image={URL.createObjectURL(image)} alt="Uploaded Screenshot" />
              </Card>
            )}
            <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!transactionId || !transactionAmount || !gateway || !image}
              >
                Submit
              </Button>
            </Box>
          </form>
          {successMessage && (
            <Typography variant="h4" color="success.main" sx={{ marginTop: 2, textAlign: 'center' }}>
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography variant="h6" color="error.main" sx={{ marginTop: 2, textAlign: 'center' }}>
              {errorMessage}
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ReferralPaymentVerification;
