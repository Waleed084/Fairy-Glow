import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Button, CircularProgress } from '@mui/material';
import CompanyCard from 'ui-component/cards/CompanyCard';

const InvestCard = ({ plan, onClick, isLoading }) => {
  const { name, price, parent, grandParent } = plan;

  return (
    <CompanyCard onClick={onClick}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h3" sx={{ color: '#fff', mb: 2 }}>
            {name}
          </Typography>
          <Typography variant="h3" sx={{ color: '#fff', mb: 1 }}>
            Price: pkr {price}
          </Typography>
          <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
            Direct: {parent * 100}%
          </Typography>
          <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
            Indirect: {grandParent * 100}%
          </Typography>
          <Button variant="contained" color="primary">
            Choose
          </Button>
        </Box>
      )}
    </CompanyCard>
  );
};

InvestCard.propTypes = {
  plan: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    parent: PropTypes.number.isRequired,
    grandParent: PropTypes.number.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default InvestCard;
