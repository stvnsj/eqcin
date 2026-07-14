


export default function percentFormat(v){

  if(!v) return  0 + '%';
  return v.toFixed(1) + '%';
}