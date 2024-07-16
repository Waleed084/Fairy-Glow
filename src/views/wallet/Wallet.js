import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useAuth } from 'views/pages/authentication/AuthContext';
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

const Wallet = ({ isLoading }) => {
  const { username } = useAuth();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/user-accounts/${username}`);
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchAccounts();
  }, [username]);

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="h3" gutterBottom sx={{ color: 'secondary.main', textAlign: 'center', mt: 2 }}>
                My Wallets
              </Typography>
            </Grid>
            {accounts.map((account) => (
              <Grid item xs={12} sm={6} md={4} key={account._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">{account.gateway}</Typography>
                    <Typography variant="body1">Account Number: {account.accountNumber}</Typography>
                    <Typography variant="body1">Account Title: {account.accountTitle}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardWrapper>
      )}
    </>
  );
};
Wallet.propTypes = {
  isLoading: PropTypes.bool
};

export default Wallet;
