/* eslint-disable */   //used to disable eslint functionality for this file

//hide alert elt
export const hideAlert = () =>{
    const el = document.querySelector('.alert'); //alert here comes from below div class
    if(el) el.parentElement.removeChild(el);
};

//TYPE param here is either 'success' or 'error'
export const showAlert = (type, msg) =>{ 
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    //select elt where we want to include html elt we just created above
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup); //here place elt created inside the body just right the begining
    //hide all alert after 5 seconds
    window.setTimeout(hideAlert, 5000); //5000 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
};