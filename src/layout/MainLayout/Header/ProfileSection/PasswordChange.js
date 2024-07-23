import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useAuth } from 'views/pages/authentication/AuthContext';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const { username } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }
    try {
      await axios.put(`${process.env.REACT_APP_API_HOST}/api/change-password`, {
        username,
        currentPassword,
        newPassword
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Change Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Current Password"
          type="password"
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Confirm New Password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
        />
        {error && (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          Change Password
        </Button>
      </form>
    </Box>
  );
}
