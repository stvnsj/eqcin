/** 

    Params
    options: It is a an array with objects of the form {id: int, label: str}.
    value:   It is the initial value of the selection. It may be NULL.
    Change : It is the function that sets the option change.
    Label :  Is is the name of the Dropdown menu.

*/

import { Autocomplete, TextField } from "@mui/material";

export default function Dropdown
({
  options,
  value,
  changeHandler,
  label,
  width="500px",
}) 
{

    
  return (
    <Autocomplete
      disablePortal
      options={options}
      value={value}
      onChange={(event, newValue) => {changeHandler(newValue);}}
      isOptionEqualToValue={(option, value) => option.id === Number(value.id)} // Compare based on `id`
      getOptionLabel={(option)=>option.label}
      getOptionSelected={(option, value) => option.id === value.id}
      renderInput={(params) => 

        <TextField
          variant="outlined"
          style={{ width }}
          {...params} 
          label={label}
          size="small"
        />
      }
    />
  )
}
