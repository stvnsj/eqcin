import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';

export default function SideOption(props){

  return(

    /* Option for the sidebar */
    <ListItem sx={props.colorProps}  key={props.key} disablePadding>
      <ListItemButton onClick={()=>props.clickFunction()}>
        <ListItemIcon>
          {props.icon}
        </ListItemIcon>
        <ListItemText primary={props.primary} />
      </ListItemButton>
    </ListItem>
  )
}