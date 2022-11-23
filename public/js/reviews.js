/* eslint-disable */   //used to disable eslint functionality for this file

import axios from 'axios';
import { showAlert } from './alert';

export const updateReview = async (coursId, userId, reviews, ratings) =>{ // used to export the login function here
    //console.log(`This is cours : ${coursId} and this is user: ${userId}`); right:496px;bottom:80px;
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'PATCH',
            url: `http://127.0.0.1:8000/api/v1/reviews/${coursId}`,
            data:{
                review: reviews,
                rating: ratings
            }
        });
        //console.log(res.data);
        if(res.data.status === 'success'){
            showAlert('success', 'Reviews updated successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                location.assign(`/my-reviews/${userId}`); //used in order to load another page n / here is to go to home page or load home page
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
            //console.log(res.data.data.passwordResetToken);
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const deleteReview = async (coursId, userId) =>{ //userId, reviews, ratings // used to export the login function here
    //console.log(`This is cours : ${coursId} and this is user: ${userId}`); right:496px;bottom:80px;
    try{ //axios is used communicate btw back-end n front-end 
        //const res = 
        await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'DELETE',
            url: `http://127.0.0.1:8000/api/v1/reviews/${coursId}`,
            /*data:{
                review: reviews,
                rating: ratings
            }*/
        }).then(()=>{
            //bts.textContent='Deleted successful';
            showAlert('success', 'Review deleted successfully!');
            window.setTimeout(() =>{
                location.assign(`/my-reviews/${userId}`); //used in order to load another page n / here is to go to home page or load home page
            }, 1500);
        });
        //console.log(res.data);
        /*if(res.data.status === 'success'){
            showAlert('success', 'Reviews deleted successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                location.assign(`/my-reviews/${userId}`); //used in order to load another page n / here is to go to home page or load home page
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
            //console.log(res.data.data.passwordResetToken);
        }*/

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const createReview = async (coursId, userId, reviews, ratings) =>{ // used to export the login function here
    //console.log(`This is cours : ${coursId} and this is user: ${userId}`); right:496px;bottom:80px;
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'POST',
            url: `http://127.0.0.1:8000/api/v1/tours/${coursId}/reviews`,
            data:{
                review: reviews,
                rating: ratings,
                cours: coursId,
                user: userId
            }
        });
        //console.log(res.data);
        if(res.data.status === 'success'){
            showAlert('success', 'Reviews posted successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                location.assign(`/`); //used in order to load another page n / here is to go to home page or load home page
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
            //console.log(res.data.data.passwordResetToken);
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};