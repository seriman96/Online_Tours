/* eslint-disable */   //used to disable eslint functionality for this file

import axios from 'axios';
import { showAlert } from './alert';


export const signup = async (names, emails, passwords, passwordconfirms) =>{ // used to export the login function here
    //console.log(emails, passwords);
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/signup',
            data:{
                name: names,
                email: emails,
                //contact: contacts,
                password: passwords,
                passwordConfirm: passwordconfirms
            }
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Signed in successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                //location.assign('/api/v1/users/logout'); // /login //used in order to load another page n / here is to go to home page or load home page
                location.assign('/sign');
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const creatUsr = async (names, emails, passwords, passwordconfirms, types) =>{ // used to export the login function here
    //console.log(emails, passwords);
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users',
            data:{
                name: names,
                email: emails,
                //contact: contacts,
                password: passwords,
                passwordConfirm: passwordconfirms,
                role: types
            }
        });

        if(res.data.status === 'success'){
            showAlert('success', 'User created successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                //location.assign('/api/v1/users/logout'); // /login //used in order to load another page n / here is to go to home page or load home page
                location.assign('/usr');
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};


