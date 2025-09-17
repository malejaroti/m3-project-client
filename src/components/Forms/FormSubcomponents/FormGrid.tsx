import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';


export const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));


export const FormContainer = styled(Box)(() => ({
    margin: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "30px"

}))


export const FormTitle = styled(Typography)(() => ({

}))