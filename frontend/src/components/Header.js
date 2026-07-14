import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ComponentSelector from './ComponentSelector';
import verboseDate from '../utils/verboseDate';


export default function Header(){



    return (

        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx= {{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    <Typography variant='h6' sx= {{display: 'flex', justifyContent: 'space-between'}}>
                        EQC - Registro de Gastos
                    </Typography>
                </div>
                <div>
                    {verboseDate()}
                </div>

            </Toolbar>
        </AppBar>

    )
}