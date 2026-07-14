import { Typography } from "@mui/material";
import Grd from "../reusable/Grd";
import ListSueldo from "./ListSueldo";


export default function Sueldo(){





  return(

    <Grd>
      <Grd item={true}>
        <Typography variant="h6">
          <b>SUELDOS</b>
        </Typography>
      </Grd>
      <Grd item={true}>
        <ListSueldo/>
      </Grd>



  </Grd>


  );


}