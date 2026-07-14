
const {queryAsync} = require("../../services/dbv2")


async function proyectosDictionary () {
    
    const raw_query = "SELECT id, nombre FROM proyectos;";

    return await queryAsync(raw_query);
}


module.exports = {
    proyectosDictionary
}
