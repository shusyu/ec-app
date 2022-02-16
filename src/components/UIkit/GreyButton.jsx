import React from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    fontSize: 16,
    height: 48,
    marginBottom: 16,
    width: 256
  }
}));

const GreyButton = (props) => {
  const classes = useStyles();
  return (
    <Button sx={{backgroundColor: "#e0e0e0"}} color='grey' className={classes.button} variant="contained" onClick={() => props.onClick()}>
      {props.label}
    </Button>
  )
}

export default GreyButton
