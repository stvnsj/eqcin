



import { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from '../reusable/Toast';
import toast from 'react-hot-toast';


export default function Compare(props){

    const [selectedFile,setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [options, setOptions] = useState([]);


    const onFileChange = event => {

        setSelectedFile(event.target.files[0]);
    }


    const proyectoOptions = (query) => {

        let opt = query.map( proyecto =>(
            {id: proyecto.id, label: proyecto.nombre + "; ID:" + proyecto.id}
        ))
        
        setOptions(opt);
    }




    const upload_file = async function () {

        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("avatar", selectedFile);   // same key as backend

        const url = "http://localhost:8000/factura/compare";

        try {
            const res = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: "blob"     // <-- IMPORTANT for receiving file
            });

            // Trigger the download of the Excel file
            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "Resultado.xlsx";   // Customize filename
            a.click();
            window.URL.revokeObjectURL(downloadUrl);

            toast.success("Archivo procesado y descargado correctamente.");

        } catch (err) {
            // Backend sends a blob by default → Must extract JSON error if needed
            try {
                const reader = new FileReader();
                reader.onload = () => {
                    const errorJson = JSON.parse(reader.result);
                    toast.error(errorJson.message || "Error desconocido");
                };
                reader.readAsText(err.response.data);
            } catch (e) {
                toast.error("Error procesando archivo.");
            }
        }

        setSelectedFile(null);

    }






    


    useEffect(()=>{

        const url = `http://localhost:8000/proyecto`;
        
        const requestOptions = {
            method: 'GET',
        }
        fetch(url,requestOptions)
            .then((res)=>res.json())
            .then((json)=>{proyectoOptions(json.data)});

    }, []);
    







    return(

        <div>
            <Toast/>
            <input type="file" onChange={onFileChange}/>
            <br/><br/>
            <button onClick={upload_file}>
                Upload!
            </button>
        </div>

    )


}
