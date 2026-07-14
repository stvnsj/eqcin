import { Drawer, Toolbar } from "@mui/material";
import SideOptionList from "./SideOptionList";

const drawerWidth = 240;

export default function Sidebar(props){

    return(

        <Drawer
            variant="permanent"
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            
            {/* Serves only a formatting purpose.
            It keeps the sidebar to the left. */}
            <Toolbar />

            {/* Options on side bar */}
            <SideOptionList {...props}/>

        </Drawer>
    )
}
