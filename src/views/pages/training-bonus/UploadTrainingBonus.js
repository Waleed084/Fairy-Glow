import React, { useState } from 'react';
import { Button, TextField, Typography, Grid, Card, CardMedia, Paper, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import { useAuth } from 'views/pages/authentication/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory

const UploadTrainingBonus = () => {
  const { username } = useAuth(); // Get the username from authcontext
  const navigate = useNavigate(); // Initialize useHistory

  const [transactionId, setTransactionId] = useState('');
  const [transactionAmount, setTransactionAmount] = useState(500);
  const [gateway, setGateway] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // Success message state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      alert('Please select an image file.');
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('transactionId', transactionId);
    formData.append('transactionAmount', transactionAmount);
    formData.append('gateway', gateway);
    formData.append('image', image);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/training-bonus/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Form submitted:', response.data);
      setSuccessMessage('Training bonus approval data uploaded successfully.');
      setErrorMessage('');

      // Reset form state after submission
      setTransactionId('');
      setTransactionAmount(500);
      setGateway('');
      setImage(null);

      // Navigate after 2-3 seconds
      setTimeout(() => {
        navigate('/payments/training-bonus');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Error submitting form. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom sx={{ color: 'secondary.main', textAlign: 'center' }}>
          Upload Training Bonus Details
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
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                label="Transaction Amount"
              >
                <MenuItem value={500}>500</MenuItem>
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

export default UploadTrainingBonus;
