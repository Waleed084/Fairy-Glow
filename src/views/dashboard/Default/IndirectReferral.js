import PropTypes from 'prop-types';
import { useAuth } from 'views/pages/authentication/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import PersonPinTwoToneIcon from '@mui/icons-material/PersonPinTwoTone';

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

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const IndirectReferral = ({ isLoading }) => {
  const theme = useTheme();
  const { username } = useAuth();
  const [indirectReferralsCount, setIndirectReferralsCount] = useState(0);

  useEffect(() => {
    const fetchDirectReferralsCount = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/referrals`, {
          params: { username }
        });
        setIndirectReferralsCount(response.data.IndirectCount);
      } catch (error) {
        console.error('Error fetching direct referrals count:', error);
      }
    };

    if (username) {
      fetchDirectReferralsCount();
    }
  }, [username]);

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      backgroundColor: theme.palette.warning.light,
                      color: theme.palette.warning.dark
                    }}
                  >
                    <PersonPinTwoToneIcon fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    py: 0,
                    mt: 0.45,
                    mb: 0.45
                  }}
                  primary={<Typography variant="h4">Indirect Referrals {indirectReferralsCount}</Typography>}
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

IndirectReferral.propTypes = {
  isLoading: PropTypes.bool
};

export default IndirectReferral;
