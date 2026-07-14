

import {Toaster} from 'react-hot-toast';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';




export default function Toast (){



    return (

        <Toaster
            toastOptions={{


                duration: 5000,

                style: { background: '#343434',
                         color: '#fff',
                         fontSize: '18px',
                         //fontWeight: 'bold'
                       },

                // Success notification options
                success : {
                    icon: <CheckCircleOutlineIcon fontSize='large'/>,
                    duration: 3000,
                    style: {

                        border: '1px solid #9bffbe',
                        //padding: '16px',
                        color: '#9bffbe',
                    },
                },

                // Error notification options
                error: {
                    icon: <ErrorOutlineIcon fontSize='large'/>,
                    duration: 5000,
                    style: {

                        border: '1px solid #ff5656',
                        //padding: '16px',
                        color: '#ff5656',
                    },                    
                },

                // Loading notification options
                loading : {

                }

            }}

        />
    )
}

