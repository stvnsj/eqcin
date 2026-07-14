
/*
  Returns a date one year of the present date.
*/
export function nextYear () {
    let d  = new Date(); 
    let d1 = d.setFullYear(d.getFullYear() + 1);
    return new Date(d1);
}



export function dateToDate(d) {

  const year  =  d.getFullYear();
  const month = d.getMonth();
  const date  = d.getDate();

  return numberToDate(year,month+1,date);
}

export function numberToDate (year,month,day=1) {

  let date = year + '-';
  
  if(month < 10){

    date = date + '0' + month + '-';
  }
  else{

    date = date + month + '-';
  }

  if(day < 10){

    date = date + '0' + day;
  }

  else{

    date = date + day;
  }

  return date;

}


export function stringToDate (year,month,day='01') {

  
  let date = year + '-';
  
  if(month.length < 2){

    date = date + '0' + month + '-';
  }

  else{

    date = date + month + '-';
  }

  if(day.length < 2){

    date = date + '0' + day;
  }

  else{

    date = date + day;
  }

  return date;


}
