/* eslint-disable */   //used to disable eslint functionality for this file
//index.js file here is the centralized js file here for all the dependencies

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { signup, creatUsr } from './signup';
import { createc, topc, searchc, upc, uploadc, delc, updateCours, uploadCours, deleteCours, top5, monthCours, statisticrs } from './createCourse';

import { login, loginAfterSignIn, logout } from './login';
import { searchuser, updtusers, updateUsers, deltusers } from './manageuser';

import { bookTour } from './stripe';
import { forgotpassword, resetpassword } from './resetPass';
import { updateReview, deleteReview, createReview } from './reviews';

import { updateSettings } from './updateSettings';


//creating DOM elt
const mapbox = document.getElementById('map');
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const loginForm1 = document.querySelector('.form--login1');
const loginForm2 = document.querySelector('.form--login2');
const loginForm3 = document.querySelector('.form--login3');
const loginForm4 = document.getElementById('resetToken'); //

//manage user
const top5crs = document.querySelector('.form-user-queryTop');
const monthcrs = document.querySelector('.form-user-queryYear');
const statiscrs = document.querySelector('.form-user-queryStats');
const finduser = document.querySelector('.form-user-queryUsr');
const creatus = document.querySelector('.form--signupUsr');
const updusers = document.querySelector('.form-user-queryUpdUsr');

//courses
const createC = document.querySelector('.form-user-course');
//const createC = document.querySelector('form');
const readTopC = document.querySelector('.form-user-query');
const searchTopC = document.querySelector('.form-user-query1');
const updC = document.querySelector('.form-user-queryU');
const uplC = document.querySelector('.form-user-queryUp'); 
const delC = document.querySelector('.form-user-queryD');
const uC = document.querySelector('.form-user-courseu'); 
const upldcrs = document.querySelector('.form-user-courseI');
const delcrs = document.querySelector('.form-user-coursed'); 

const reviewForm = document.querySelector('.form--reviews');
const reviewForm1 = document.getElementById('user-id'); 
const reviewForm2 = document.getElementById('cours-id');//it's reviews's id 

const reviewFormDel = document.querySelector('.form--reviews1');
/*const reviewFormDel1 = document.getElementById('user-id1'); 
const reviewFormDel2 = document.getElementById('cours-id1');*/

const reviewFormCre = document.querySelector('.form--reviews1');

const logOutBtn = document.querySelector('.nav__el--logout');

const userDataForm1 = document.querySelector('.form-user-data1');
const userDatadelt = document.querySelector('.form-user-queryUsr_del');
const bookBtn = document.getElementById('book-tour')

const userDataForm = document.querySelector('.form-user-data'); 
const userPasswordForm = document.querySelector('.form-user-password');


//user managing
if(finduser){
    finduser.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'Searching...';
        
        const price = document.getElementById('price').value;
        //console.log(price);
        searchuser(price);
    });
};

if(userDatadelt){
    userDatadelt.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'Searching...';
        
        const price = document.getElementById('price').value;
        //console.log(price);
        deltusers(price);
    });
};

if(updusers){
    updusers.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'Searching...';
        
        const price = document.getElementById('price').value;
        //console.log(price);
        updtusers(price);
    });
};

if(top5crs){
    top5crs.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'finding...';

        top5();
    });
}; 
if(statiscrs){
    statiscrs.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'finding...';

        statisticrs();
    });
}; 

if(monthcrs){
    monthcrs.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'finding...';
        const year = document.getElementById('price').value;

        monthCours(year);
    });
};

if(creatus){
    creatus.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'Processing...';
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        //const contact = document.getElementById('contact').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordconfirm').value;//
        const type = document.getElementById('type').value;
        //console.log(type);
        creatUsr(name, email, password, passwordConfirm, type);
    });
};

if(readTopC){
    readTopC.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'Searching...';
        
        const price = document.getElementById('price').value;
        let len = price.length;
        const le = price.substring(0, 2);
        const prc = price.substring(2,(len + 1));
        const average = document.getElementById('average').value;
        let len1 = average.length;
        const ge = average.substring(0, 2);
        const avg = average.substring(2, (len1 + 1)); 
        //console.log(avg*1);

        topc(avg*1, prc*1, le, ge);
    });
};

if(searchTopC){
    searchTopC.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'Searching...';
        
        const price = document.getElementById('price').value;
        searchc(price);
    });
};

if(updC){
    updC.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'Find...';
        
        const price = document.getElementById('price').value;
        upc(price);
    });
};

if(uplC){
    uplC.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'Find...';
        
        const price = document.getElementById('price').value;
        uploadc(price);
    });
};

if(delC){
    delC.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'Finding...';
        
        const price = document.getElementById('price').value;
        delc(price);
    });
};

if(delcrs){
    delcrs.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--reviewUpd1').textContent = 'Deleting...';
        
        const coursId = reviewForm2.value;
        deleteCours(coursId);
    });
};

if(upldcrs){
    upldcrs.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--reviewUpd').textContent = 'uploading...';

        /*
        let selectfile;
        const imageCover = document.getElementById('photo1');
        selectfile = imageCover.files[0];
        //const imageCover1 = document.getElementsByName('imageCover')[0].value;
        //console.log(selectfile);
        //console.log(selectfile.name);*/
        const imageCover = document.getElementById('photo1').value;
        var img = `${imageCover}`;
        //console.log(imageCover1);
        var imgs = img.split('\\')[2];

        const images = document.getElementById('images').value;
        //console.log(images);
        //console.log();

        var imagess = [];
        for(let i = 0; i <(images*1 + 1); i++) {
            if(document.getElementById(`photo_${i}`)){
                let im = `${document.getElementById(`photo_${i}`).value}`;
                let img1 = im.split('\\')[2];
                //img1 = JSON.stringify(img1);
                //console.log(img);
                imagess.push(img1);
                /*const img = document.getElementById(`photo_${i}`);
                selectedfile = img.files[0];
                imagess.push(document.getElementById(`photo_${i}`).value);*/
            }   
        }
        const coursId = reviewForm2.value;
        const formData = new FormData();
        formData.append('imageCover', imgs);
        formData.append('images[]', imagess);

        
        uploadCours(coursId, formData);
    });
}

if(uC){
    uC.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--reviewUpd').textContent = 'Updating...';
        const name = document.getElementById('name').value;
        //console.log(name);
        const duration = document.getElementById('duration').value;
        const maxgroupsize = document.getElementById('maxgroupsize').value;
        const difficulty = document.getElementById('difficulty').value;
        
        const quantity = document.getElementById('quantity').value;
        const guide = document.getElementById('guides').value;
        //console.log(guide);
        var guides = [];
        for(let i = 0; i <guide*1; i++) {
            if(document.getElementById(`guide${i}`).checked){
                guides.push(document.getElementById(`guide${i}`).value);
            }   
        }
        //console.log(guides);
        //console.log();
        
        const starts = document.getElementById('start').value;
        //console.log(starts);
        var startDates = [];
        for(let i = 0; i <starts*1; i++) {
            if(document.getElementById(`startdate_${i}`)){
                if(document.getElementById(`startdate_${i}`).value != ''){
                    startDates.push(document.getElementById(`startdate_${i}`).value); 
                }
            }   
        }
        //console.log(startDates);
        //console.log();
        const price = document.getElementById('price').value;
        const discountprice = document.getElementById('discountprice').value;
        const average = document.getElementById('average').value; 
        const summary = document.getElementById('summary').value;
        const description = document.getElementById('description').value;
        //const course = document.getElementById('course').value;

        //const imageCover = document.getElementById('photo1').files[0];
        //const imageCover = e.target.photo1.files
        //console.log(imageCover);
        const formData = new FormData();
        //console.log('space!!!');
        //var img = `${imageCover}`;
        //var imgs = img.split('\\')[2];

        //const images = document.getElementById('images').value;
        //const images = document.getElementById('photo').value;
        const images = e.target.photo.files;
        //console.log(images);
        if(images.length != 0){
            for (const img of images){
                formData.append('images', img);
            }
        }
        //console.log(formData.getAll('images'));

        /*var imagess = [];
        for(let i = 0; i <(images*1 + 1); i++) {
            if(document.getElementById(`photo_${i}`)){
                let im = `${document.getElementById(`photo_${i}`).value}`;
                let img1 = im.split('\\')[2];
                //img1 = JSON.stringify(img1);
                //console.log(img);
                imagess.push(img1);
                /*const img = document.getElementById(`photo_${i}`);
                selectedfile = img.files[0];
                imagess.push(document.getElementById(`photo_${i}`).value);*/
            /*  }   
        }*/

        const coursId = reviewForm2.value; 
        formData.append('name', name);
        formData.append('duration', duration);
        formData.append('maxGroupSize', maxgroupsize);
        formData.append('difficulty', difficulty);
        formData.append('ratingsAverage', average);
        formData.append('ratingsQuantity', quantity);
        formData.append('price', price);
        formData.append('summary', summary);
        formData.append('description', description);

        const imageCover = e.target.photo1.files;
        //const imgc = `${imageCover.name}`
        //console.log(imgc);
        if(imageCover.length != 0){
            for (const img of imageCover){
                formData.append('imageCover', img);
            }
        }
        //form.append('imageCover', imgc);
        
        //console.log(formData.getAll('imageCover'));
        //formData.append('imageCover', imgs);
        //console.log(imgs)
        //formData.append('images[]', imagess);
        //console.log(imagess)

        //console.log(startDates.length);
        for(var i=0; i < startDates.length; i++){
            formData.append('startDates[]', startDates[i]);
            //console.log(`std: ${formData.getAll('startDates[]')}`);
        }
        // formData.append('category', course);
        for(var i=0; i < guides.length; i++){
            formData.append('guides[]', guides[i]);
            //console.log(`std: ${formData.getAll('startDates[]')}`);
        }
        formData.append('priceDiscount', discountprice);
        //console.log(`std: ${formData.getAll('startDates[]')}`);
        //console.log(`std: ${formData.getAll('guides[]')}`);
        //console.log([...formData]);
        //createc(formData);

        updateCours(coursId, formData);
    });
};

if(createC){
    createC.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'Creation on process...';
        const name = document.getElementById('name').value;
        //console.log(name);
        const duration = document.getElementById('duration').value;
        const maxgroupsize = document.getElementById('maxgroupsize').value;
        const difficulty = document.getElementById('difficulty').value;
        
        const quantity = document.getElementById('quantity').value;
        const guide = document.getElementById('guides').value;
        //console.log(guide);
        var guides = [];
        for(let i = 0; i <guide*1; i++) {
            if(document.getElementById(`guide${i}`).checked){
                guides.push(document.getElementById(`guide${i}`).value);
            }   
        }
        //console.log(guides);
        //console.log();
        
        const starts = document.getElementById('start').value;
        //console.log(starts);
        var startDates = [];
        for(let i = 0; i <starts*1; i++) {
            if(document.getElementById(`startdate_${i}`)){
                if(document.getElementById(`startdate_${i}`).value != ''){
                    startDates.push(document.getElementById(`startdate_${i}`).value); 
                }
            }   
        }
        //console.log(startDates);
        //console.log();
        const price = document.getElementById('price').value;
        const discountprice = document.getElementById('discountprice').value;
        const average = document.getElementById('average').value; 
        const summary = document.getElementById('summary').value;
        const description = document.getElementById('description').value;
        //const course = document.getElementById('course').value;
        const imageCover = document.getElementById('photo1').value;
        var img = `${imageCover}`;
        //console.log(imageCover1);
        var imgs = img.split('\\')[2]; 
        //imgs = JSON.stringify(imgs);
        //console.log(imgs);

        const images = document.getElementById('images').value;
        //console.log(images);
        //console.log();
 
        var imagess = [];
        for(let i = 0; i <(images*1 + 1); i++) {
            if(document.getElementById(`photo_${i}`)){
                let im = `${document.getElementById(`photo_${i}`).value}`;
                let img1 = im.split('\\')[2];
                //img1 = JSON.stringify(img1);
                //console.log(img);
                imagess.push(img1);
                /*const img = document.getElementById(`photo_${i}`);
                selectedfile = img.files[0];
                imagess.push(document.getElementById(`photo_${i}`).value);*/
            }   
        }

        createc(name, duration, maxgroupsize, difficulty, average, quantity, price, summary, description, imgs, imagess, startDates, guides, discountprice);
    });
};

if(signupForm){
    signupForm.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        document.querySelector('.btn--green').textContent = 'Processing...';
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        //const contact = document.getElementById('contact').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordconfirm').value;
        signup(name, email, password, passwordConfirm);
    });
};

if(loginForm1){
    loginForm1.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        loginAfterSignIn(email, password);
    });
};

if(loginForm2){
    loginForm2.addEventListener('submit', e =>{
        e.preventDefault();
        document.querySelector('.btn--green').textContent = 'Processing...';
        //capturing email n passwd
        const email = document.getElementById('email').value;
        forgotpassword(email);
    });
};

if(loginForm3){
    loginForm3.addEventListener('submit', e =>{
        e.preventDefault();
        document.querySelector('.btn--green').textContent = 'Resetting...';
        const tokenId = loginForm4.value;
        //console.log(`welcome dear ${tokenId}`);
        //capturing email n passwd
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordconfirm').value;
        resetpassword(tokenId, password, passwordConfirm);
    });
};

if(reviewForm){
    reviewForm.addEventListener('submit', e =>{
        e.preventDefault();
        document.querySelector('.btn--reviewUpd').textContent = 'Updating...';
        const userId = reviewForm1.value;
        const coursId = reviewForm2.value;
        const review = document.getElementById('review').value;
        const rating = document.getElementById('rating').value;
        updateReview(coursId, userId, review, rating);
    });
};
//const bt = document.querySelector('.btn--reviewUpd1');
if(reviewFormDel){
    reviewFormDel.addEventListener('submit', e =>{
        e.preventDefault();
        document.querySelector('.btn--reviewUpd1').textContent = 'Deleting...';
        const userId = reviewForm1.value;
        const coursId = reviewForm2.value;
        /*const review = document.getElementById('review').value;
        const rating = document.getElementById('rating').value;*/
        deleteReview(coursId, userId); //userId, review, rating
    });
};

if(reviewFormCre){
    reviewFormCre.addEventListener('submit', e =>{
        e.preventDefault();
        document.querySelector('.btn--reviewUpd').textContent = 'Posting...';
        const userId = reviewForm1.value;
        const coursId = reviewForm2.value;
        const review = document.getElementById('review').value;
        const rating = document.getElementById('rating').value;
        createReview(coursId, userId, review, rating);
    });
};


//DELEGATION
if(mapbox){ //if elt exist
    const locations = JSON.parse(mapbox.dataset.locations); //document.getElementById('map').dataset.locations has a value in string bcs of JSON.stringify() in tour.pug n we'll convert to json
    displayMap(locations);
};

//console.log('hello from parcel!');
//used to get data from the user interface n then delegate the action
if(loginForm){
    loginForm.addEventListener('submit', e =>{
        e.preventDefault();
        //capturing email n passwd
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
};

if(logOutBtn) logOutBtn.addEventListener('click', logout);

if(userDataForm){
    userDataForm.addEventListener('submit', e =>{
        e.preventDefault(); //will prevent the form for being submitted
        //capturing name n email
        //const name = document.getElementById('name').value; //document.getElementById('') value is coming from template file attrib id
        //const email = document.getElementById('email').value;
        //updateSettings({name, email}, 'data');
        const form = new FormData(); //new form object
        form.append('name', document.getElementById('name').value); //document.getElementById('') value is coming from template file attrib id
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]); //to received image here we've only 1 image that's y [0]
        console.log(form);
        updateSettings(form, 'data');
    });
}; 

if(userDataForm1){
    userDataForm1.addEventListener('submit', e =>{
        e.preventDefault(); //will prevent the form for being submitted
        //capturing name n email
        //using form with upload file here image
        const user_id = document.getElementById('users-id').value;
        const form = new FormData(); //new form object
        form.append('name', document.getElementById('name').value); //document.getElementById('') value is coming from template file attrib id
        form.append('email', document.getElementById('email').value);
        form.append('role', document.getElementById('type').value);
        form.append('photo', document.getElementById('photo').files[0].name); //to received image here we've only 1 image that's y [0]
        //console.log(user_id);
        //console.log(form.get('photo'));

        /*const name = document.getElementById('name').value; 
        const email = document.getElementById('email').value;
        updateSettings({name, email}, 'data');*/
        updateUsers(form, user_id);
    });
}; 


if(userPasswordForm){
    userPasswordForm.addEventListener('submit', async e =>{
        e.preventDefault(); //will prevent the form for being submitted

        //getting something to user when passwd is getting saved means before save action get completed
        document.querySelector('.btn--save-password').textContent = 'Updating...';

        //capturing passwd,...
        const passwordCurrent = document.getElementById('password-current').value; //document.getElementById('') value is coming from template file attrib id
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({passwordCurrent, password, passwordConfirm}, 'password');

        //getting something(button change) to user when passwd is getting saved means after save action get completed
        document.querySelector('.btn--save-password').textContent = 'Save password';

        //we donn't want passwd values to be showing from output(interface) after getting updated
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
};

if(bookBtn){
    bookBtn.addEventListener('click', e =>{
        e.target.textContent = 'Processing....'; //to be shown as button value when payment on process
        //const tourId = e.target.dataset.tourId, //e.target is basically the elt that was clicked 
        const { tourId } = e.target.dataset; //if we've as above returned it should be taken as this line n e.target.dataset used to get tourId on the button
        //in js whenever we've - it get converted to camel case like tour-id => tourId
        bookTour(tourId);
    });
};