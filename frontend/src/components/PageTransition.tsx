import { Fade } from '@mui/material';
import { useLocation, useOutlet } from 'react-router-dom';

export function PageTransition() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <Fade key={location.pathname} in timeout={220}>
      <div>{element}</div>
    </Fade>
  );
}