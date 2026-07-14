



export const scrollFunction = (component_id) => {

  const element = document.getElementById(component_id);
  if (element) {
    
    element.scrollIntoView({ behavior: 'smooth', block:'start'});
  }
}