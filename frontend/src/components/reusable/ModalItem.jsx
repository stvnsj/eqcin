import { Grid } from "@mui/material";


export default function ModalItem(props){


    return(
        <Grid item xs={3} m={2}>
            {props.children}
        </Grid>
    )
}