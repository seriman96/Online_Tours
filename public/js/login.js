/* eslint-disable */   //used to disable eslint functionality for this file

import axios from 'axios';
import { showAlert } from './alert';


export const login = async (emails, passwords) =>{ //used to export the login function here
    //console.log(emails, passwords);
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/login',
            data:{
                email: emails,
                password: passwords
            }
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Logged in successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                location.assign('/'); //used in order to load another page n / here is to go to home page or load home page
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const loginAfterSignIn = async (email, password) =>{ // used to export the login function here
    //console.log(email, password);
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/login',
            data:{
                email,
                password
            }
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Logged in successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                location.assign('/'); //used in order to load another page n / here is to go to home page or load home page
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

/*
document.querySelector('.form').addEventListener('submit', e =>{
    e.preventDefault();
    //capturing email n passwd
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});
*/ //that block of code should be placed into index.js file n to be link with this local file here


export const logout = async () => {
    try {
        const res = await axios({ 
            method: 'GET',
            url: 'http://127.0.0.1:8000/api/v1/users/logout',
        });
        if(res.data.status = 'success') location.reload(true);  //this reload will happen from server side n not from browser cache n passing true value here is important here without that it will reload same page from the cache which would still have our user menu up there
    } catch (err) {
        showAlert('error', 'Error logging out! Try again');
    }
};