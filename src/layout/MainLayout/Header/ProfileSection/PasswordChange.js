import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useAuth } from 'views/pages/authentication/AuthContext';

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: '20px',
      borderColor: '#8e44ad' // Purple berry color
    },
    '&:hover fieldset': {
      borderColor: '#8e44ad'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8e44ad'
    }
  }
});

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { username } = useAuth();
  const navigate = useNavigate();

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
      setSuccess('Password changed successfully');
      setTimeout(() => {
        navigate('/dashboard/default');
      }, 2000);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h3" color="secondary.dark" gutterBottom>
        Change Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <CustomTextField
          label="Current Password"
          type="password"
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          margin="normal"
        />
        <CustomTextField
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
        />
        <CustomTextField
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
        {success && (
          <Typography variant="h4" color="success.main">
            {success}
          </Typography>
        )}
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, borderRadius: '14px' }}>
          Change Password
        </Button>
      </form>
    </Box>
  );
}
