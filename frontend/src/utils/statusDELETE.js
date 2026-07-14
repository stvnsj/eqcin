

export default function statusDELETE(response){


    return new Promise((resolve,reject)=>{

        if (response.status == 200) resolve(response);
        else reject(response.status);
    })
}