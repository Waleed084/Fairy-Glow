import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { ButtonBase, Typography, Box } from '@mui/material';

// project imports
import config from 'config';
import fairyglowberry from 'assets/images/fairyglowberry.svg'; // Adjust the path to where your SVG file is located
import { MENU_OPEN } from 'store/actions';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();

  return (
    <ButtonBase
      disableRipple
      onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
      component={Link}
      to={config.defaultPath}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <Box sx={{ mt: 1, marginTop: 1, mr: -4 }}>
        <img src={fairyglowberry} alt="Logo" width="92" height="32" />
      </Box>
      <Box sx={{ ml: 1, display: 'flex' }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Museo Sans',
            fontSize: 16,
            fontWeight: 700,
            color: 'secondary.main'
          }}
        >
          Fairy
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Museo Sans',
            fontSize: 16,
            fontWeight: 400,
            color: 'primary.main',
            ml: 0,
            mr: 4
          }}
        >
          Glow
        </Typography>
      </Box>
    </ButtonBase>
  );
};

export default LogoSection;
