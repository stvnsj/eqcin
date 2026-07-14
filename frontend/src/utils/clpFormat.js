

export default function clpFormat(quant) {

    
    if (quant == null || quant == undefined ) 
    return (0).toLocaleString('es-CL',{style:'currency',currency:'CLP',});
    if (quant < 0)
    return '-' + (-1  * quant).toLocaleString('es-CL',{style:'currency',currency:'CLP',});
    return quant.toLocaleString('es-CL',{style:'currency',currency:'CLP',});
}