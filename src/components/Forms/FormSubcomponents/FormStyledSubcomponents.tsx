import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

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

export const FormHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  background: '#cad5e2',
  height:'100px',
  padding:'10px'
  // bg-slate-300 h-[100px] flex items-center p-[10px]

}))
