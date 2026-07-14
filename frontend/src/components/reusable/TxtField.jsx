import { TextField } from "@mui/material";


export default function TxtField
({
    value,
    setter,
    label,
    disabled=false
})
{
    return (
        <TextField
            value={value}
            onChange={e=>setter(e.target.value)}
            style={{ width: "500px" }}
            type="text"
            label={label}
            variant="outlined"
            size="small"
            disabled={disabled}
        />
    );
}
