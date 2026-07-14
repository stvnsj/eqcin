import { createTheme } from "@mui/material/styles";


const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

export const theme = createTheme({
  palette: {
    create            : createColor('#F40B27'),
    edit              : createColor('#fff257'),
    terminate         : createColor('#ff3838'),
    pay               : createColor('#28e341'),
    old               : createColor('#BC00A3'),
    view              : createColor('#077fcd'),
    green             : createColor('#2a6d29'),
    yellow            : createColor('#ffd100'),
    unselected        : createColor('#267aff'),
    selected          : createColor('#003890'),
    close             : createColor('#ed2020'),
    gasto             :createColor('#d8fbff'),
    delete            : createColor('#ef281e'),
  },
});


export const myTheme={
    palette: {
        primary: {
            main: '#b0d3ff',
            dark: '#0066CC',
        },
    },
}
