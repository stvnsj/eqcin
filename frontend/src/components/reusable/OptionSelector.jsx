import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function OptionSelector({
    
    value,
    setter,
    label,
    options,
    disabled=false,

})

{


  const handleChange = (event) => {
    setter(event.target.value);
  };

  return (



    <FormControl size='small' style={{ width:'500px'}}>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select value={value} label={label} onChange={handleChange} disabled={disabled}>
          {options.map(opt=> <MenuItem value={opt.value}>{opt.label}</MenuItem>)}
      </Select>
    </FormControl>



  );
}
