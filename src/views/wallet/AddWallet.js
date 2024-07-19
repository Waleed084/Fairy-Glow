import React, { useState } from 'react';
import { useAuth } from 'views/pages/authentication/AuthContext';
import { Button, TextField, Typography, Grid, Paper, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import axios from 'axios';

const AddWallet = () => {
  const { username } = useAuth();

  const [gateway, setGateway] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const accountData = {
      username,
      gateway,
      accountNumber,
      accountTitle
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/user-accounts/add`, accountData);
      console.log('Account added:', response.data);
      setSuccessMessage('Account added successfully.');
      setErrorMessage('');

      // Reset form state after submission
      setGateway('');
      setAccountNumber('');
      setAccountTitle('');
    } catch (error) {
      console.error('Error adding account:', error);
      setErrorMessage('Error adding account. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom sx={{ color: 'secondary.main', textAlign: 'center' }}>
          Add Wallet
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} sx={{ padding: 2, background: 'secondary.light' }}>
          <form onSubmit={handleSubmit}>
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
                <MenuItem value="HBL">HBL</MenuItem>
                <MenuItem value="UBL">UBL</MenuItem>
                <MenuItem value="Meezan">Meezan</MenuItem>
                <MenuItem value="MCB">MCB</MenuItem>
                <MenuItem value="Al-Habib">Al-Habib</MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              fullWidth
              id="accountNumber"
              label="Account Number"
              type="number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              required
              fullWidth
              id="accountTitle"
              label="Account Title"
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
              <Button type="submit" variant="contained" color="primary">
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

export default AddWallet;
