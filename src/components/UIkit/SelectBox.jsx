import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  formControl: {
    marginBottom: 16,
    minWidth: 128,
    width: '100%'
  }
});

const SelectBox = (props) => {
  const classes = useStyles();
  return (
    <FormControl required={props.isRequired} className={classes.formControl} variant="standard">
        <InputLabel>{props.label}</InputLabel>
        <Select
          value={props.value}
          onChange={(event) => props.select(event.target.value)}
        >
          {props.options.map((option) => (
            <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
  )
}

export default SelectBox
