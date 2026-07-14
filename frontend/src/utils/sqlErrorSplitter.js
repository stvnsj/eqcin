import { Typography } from "@mui/material"



export default function sqlErrorSplitter(str) {

    return <div>{str.split(':')[2]}</div>
}