import { Grid } from "@mui/material";


export default function Grd
({
  children,
  item=false,
  mt=0,
})
{
  if (!item)
  return(


    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      alignContent="center"
      justifyContent="center"
      style={{ minHeight: '20vh', minWidth:'130vh'}}
    >
      {children}

    </Grid> 
  )

  else
  return(

    <Grid item xs={5} marginTop={mt}>
      {children}
    </Grid>

  )
}
