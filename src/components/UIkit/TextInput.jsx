import React from 'react';
import TextField from '@mui/material/TextField';

const TextInput = (props) => {
  return (
    <TextField
      fullWidth={props.fullWidth}
      label={props.label}
      margin={'dense'}
      multiline={props.multiline}
      required={props.required}
      rows={props.rows}
      value={props.value}
      type={props.type}
      onChange={props.onChange}
      variant="standard"
    />
  )
}

export default TextInput
