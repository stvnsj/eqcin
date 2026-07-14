


export default function statusPOST(response){


    return new Promise((resolve,reject)=>{

        if (response.status == 201) resolve(response);
        else reject(response.status);
    })
}