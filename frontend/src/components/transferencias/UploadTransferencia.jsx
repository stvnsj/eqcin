
import { useEffect, useState } from 'react';
import axios from 'axios';
import statusPOST from '../../utils/statusPOST';
import { Typography } from '@mui/material';
import toast, {Toaster} from 'react-hot-toast';
import Toast from '../reusable/Toast';

export default function UploadTransferencia(props){

    const [selectedFile,setSelectedFile] = useState(null);

    const [error, setError] = useState(null);
    const [options, setOptions] = useState([]);
    const [proyecto, setProyecto] = useState(null);


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
        formData.append("avatar",selectedFile);
        const url = 'http://localhost:8000/transferencia/upload';

        try {

            const res = await axios.post(url, formData);
            toast.success(res.data.message);


            
        } catch (err) {
            const err_message = err.response.data.message;
            toast.error(err_message)
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
