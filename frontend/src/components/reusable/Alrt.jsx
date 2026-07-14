import { Alert, AlertTitle, Grid } from "@mui/material";

import { Box } from "@mui/system";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const alrtIcon = { 

    'error'     : <ErrorOutlineIcon fontSize="large"/>,
    'success'   : <CheckCircleOutlineIcon fontSize="large"/>

}

const alrtTitle = {
    'error'     : 'Error',
    'success'   : 'Éxito'
}

export default function Alrt({
    severity,
    children,
})
{





    return(
        <Grid container justifyContent="center">
            <Alert icon={alrtIcon[severity]} sx={{ width: '500px','& .MuiAlert-message':{textAlign:"center", width:"inherit"}}} severity={severity}>
                <AlertTitle>
                    {alrtTitle[severity]}    
                </AlertTitle>
                {children}
            </Alert>
        </Grid>
    )
}