/* eslint-disable */   //used to disable eslint functionality for this file

import axios from 'axios';
import { showAlert } from './alert';


export const createc = async (names, durations, MaxGroupSize, difficulties, ratingsAVG, ratingsQu, prices, summarys, descriptions, imageCovers, image, startDate, guide, discountPrices) =>{ 
    //data
    //console.log(imageCovers);

    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/tours',
            data:{
                name: names,
                duration: durations,
                maxGroupSize: MaxGroupSize,
                difficulty: difficulties,
                ratingsAverage: ratingsAVG,
                ratingsQuantity: ratingsQu,
                price: prices,
                summary: summarys,
                description: descriptions,
                imageCover: imageCovers,
                images: image,
                startDates: startDate,
                //category: coursCategorys,
                guides: guide,
                priceDiscount: discountPrices
            }
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Course created successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                //location.assign('/api/v1/users/logout'); // /login //used in order to load another page n / here is to go to home page or load home page
                location.assign('/cours');
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const topc = async (ratingsAVG, prices, l, r) =>{ 
    //console.log(emails, passwords);
    let le;
    let ge;
    if(l === '<') le= 'lt';
    if(l === '<=') le= 'lte';
    if(r === '>') ge= 'gt';
    if(r === '>=') ge= 'gte';
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/tours?price[${le}]=${prices}&ratingsAverage[${ge}]=${ratingsAVG}`,
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Course accessed successfully!');
            console.log(res.data.data.data);
            //console.log(res.data.data);

            /*res.data.status(200).render('topCourFilt', {
                title: 'Top Filter courses',
                //ud: user_data,
                tour: res.data
              });*/
            {
                //var cnt = 0;
                res.data.data.data.map((item) =>{
                    const markup = `<div class="card-container" style="margin-bottom: 40px;">
                        <div class="card">
                            <div class="card__header">
                                <div class="card__picture">
                                    <div class="card__picture-overlay">&nbsp;</div>
                                    <img class="card__picture-img" src=/img/tours/${item.imageCover} alt=${item.name}/>
                                </div>
                                <h2 class="heading-tertirary"><span>${item.name}</span></h2>
                            </div>
                            <div class="card__details">
                                <h4 class="card__sub-heading">${item.difficulty} ${item.duration}-day tours</h4>
                                <p class="card__text">${item.summary}</p>
                                <div class="card__data">
                                    <svg class="card__icon">
                                        <use xlink:href="/img/icons.svg#icon-dollar-sign"></use>
                                    </svg>
                                    <span>${item.price}</span>
                                </div>
                                <div class="card__data">
                                    <svg class="card__icon">
                                        <use xlink:href="/img/icons.svg#icon-calendar"></use>
                                    </svg>
                                    <span>${item.startDates[0].toLocaleString('en-us', {month: 'long', year: 'numeric'})}</span>
                                </div>
                                <div class="card__data">
                                    <svg class="card__icon">
                                        <use xlink:href="/img/icons.svg#icon-user"></use>
                                    </svg>
                                    <span> rating (${item.ratingsQuantity})</span>
                                </div>
                                <div class="card__data">
                                    <a class="edit btn--cours" href=/cours/${item._id}>  
                                        <svg class="card__icon">
                                            <use xlink:href="/img/icons.svg#icon-edit-2"></use>
                                        </svg>
                                    </a>
                            
                                    <a class="edit btn--cours" href=/cour/${item._id}> 
                                        <svg class="card__icon">
                                            <use xlink:href="/img/icons.svg#icon-delete"></use>
                                        </svg>
                                    </a>
                                    <a class="btn btn--green btn--small" href=/tour/${item.slug}>Details</a>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    //select elt where we want to include html elt we just created above 
                    document.querySelector('.user-view__form-container').insertAdjacentHTML('beforebegin', markup);
                    //console.log(item._id);
                    //cnt += 1;
                    
                })  
                //console.log(cnt);
                 
            }
               

            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                //location.assign('/api/v1/users/logout'); // /login //used in order to load another page n / here is to go to home page or load home page
                //location.assign('/read');
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const searchc = async (slg) =>{ 
    //console.log(emails, passwords);
    let slgs = slg.toLowerCase();
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/tours?slug=${slgs}`,
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Course found successfully!');
            //console.log(res.data.data.data);
            //console.log(res.data.data);

            /*res.data.status(200).render('topCourFilt', {
                title: 'Top Filter courses',
                //ud: user_data,
                tour: res.data
              });*/
            {
                //var cnt = 0;
                res.data.data.data.map((item) =>{
                    const markup = `<div class="card-container" style="margin-bottom: 40px;">
                        <div class="card">
                            <div class="card__header">
                                <div class="card__picture">
                                    <div class="card__picture-overlay">&nbsp;</div>
                                    <img class="card__picture-img" src=/img/tours/${item.imageCover} alt=${item.name}/>
                                </div>
                                <h2 class="heading-tertirary"><span>${item.name}</span></h2>
                            </div>
                            <div class="card__details">
                                <h4 class="card__sub-heading">${item.difficulty} ${item.duration}-day cours</h4>
                                <p class="card__text">${item.summary}</p>
                                <div class="card__data">
                                    <svg class="card__icon">
                                        <use xlink:href="/img/icons.svg#icon-dollar-sign"></use>
                                    </svg>
                                    <span>${item.price}</span>
                                </div>
                                <div class="card__data">
                                    <svg class="card__icon">
                                        <use xlink:href="/img/icons.svg#icon-calendar"></use>
                                    </svg>
                                    <span>${item.startDates[0].toLocaleString('en-us', {month: 'long', year: 'numeric'})}</span>
                                </div>
                                <div class="card__data">
                                    <svg class="card__icon">
                                        <use xlink:href="/img/icons.svg#icon-user"></use>
                                    </svg>
                                    <span> rating (${item.ratingsQuantity})</span>
                                </div>
                                <div class="card__data">
                                    <a class="edit btn--cours" href=/cours/${item._id}>  
                                        <svg class="card__icon">
                                            <use xlink:href="/img/icons.svg#icon-edit-2"></use>
                                        </svg>
                                    </a>
                                    
                                    <a class="edit btn--cours" href=/cour/${item._id}> 
                                        <svg class="card__icon">
                                            <use xlink:href="/img/icons.svg#icon-delete"></use>
                                        </svg>
                                    </a>
                                    <a class="btn btn--green btn--small" href=/tour/${item.slug}>Details</a>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    //select elt where we want to include html elt we just created above 
                    document.querySelector('.user-view__form-container').insertAdjacentHTML('beforebegin', markup);
                    //console.log(item._id);
                    //cnt += 1;
                    
                })  
                //console.log(cnt);
                 
            }
               

            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                //location.assign('/api/v1/users/logout'); // /login //used in order to load another page n / here is to go to home page or load home page
                //location.assign('/read');
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const upc = async (names) =>{ 
    //console.log(emails, passwords);
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/tours?name=${names}`,
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Course found successfully!');
            //console.log(res.data.data.data[0]._id); 
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                //location.assign('/api/v1/users/logout'); // /login //used in order to load another page n / here is to go to home page or load home page
                location.assign(`/cours/${res.data.data.data[0]._id}`);
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const uploadc = async (names) =>{ 
    //console.log(emails, passwords);
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/tours?name=${names}`,
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Course found successfully!');
            console.log(res.data.data.data);
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                //location.assign('/api/v1/users/logout'); // /login //used in order to load another page n / here is to go to home page or load home page
                location.assign(`/crs/${res.data.data.data[0]._id}`);
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const delc = async (names) =>{ 
    //console.log(emails, passwords);
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/tours?name=${names}`,
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Course found successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                //location.assign('/api/v1/users/logout'); // /login //used in order to load another page n / here is to go to home page or load home page
                location.assign(`/cour/${res.data.data.data[0]._id}`);
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const updateCours = async (coursId, data) =>{ // used to export the login function here
    try{ //axios is used communicate btw back-end n front-end
        //headers.append('Content-Type', 'application/json'); 
        console.log(data);
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'PATCH',
            url: `http://127.0.0.1:8000/api/v1/tours/${coursId}`,
            dataType: "json",
            data: JSON.stringify({data}),
            //data
            //headers,
           
        });
        //console.log(res.data);
        if(res.data.status === 'success'){
            showAlert('success', 'Course updated successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                location.assign(`/cours`); //used in order to load another page n / here is to go to home page or load home page
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
            //console.log(res.data.data.passwordResetToken);
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const uploadCours = async (coursId, data) =>{ // used to export the login function here
    //names, durations, MaxGroupSize, difficulties, ratingsAVG, ratingsQu, prices, summarys, descriptions, imageCovers, image, startDate, coursCategorys, guide, discountPrices
    //console.log(`This is cours : ${coursId} and this is user: ${userId}`); right:496px;bottom:80px;
    //console.log(coursId);
    //console.log();
    /*console.log(data.getAll('guides[]'));
    console.log(data.getAll('startDates[]'));
    console.log(data.get('category'));
    console.log(data.get('priceDiscount'));*/
    //console.log(data.get('price'));
    try{ //axios is used communicate btw back-end n front-end
        //headers.append('Content-Type', 'application/json'); 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'PATCH',
            url: `http://127.0.0.1:8000/api/v1/tours/${coursId}`,
            /*headers: { 
                'Authorization': 'Bearer ...', 
                'Content-Type': 'multipart/form-data', 
                ...data.getHeaders()
              },*/
            data,
            //headers,
            /*data:{
                imageCover: imageCovers,
                images: image,
                
            }*/
        });
        //console.log(res.data);
        if(res.data.status === 'success'){
            showAlert('success', 'Image uploaded successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                location.assign(`/cours`); //used in order to load another page n / here is to go to home page or load home page
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
            //console.log(res.data.data.passwordResetToken);
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    } 
    /*try {
        const response = await axios.post(`http://127.0.0.1:8000/api/v1/tours/${coursId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });
        console.log(response);
      } catch (error) {
        if (error.response) { // get response with a status code not in range 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) { // no response
          console.log(error.request);
        } else { // Something wrong in setting up the request
          console.log('Error', error.message);
        }
        console.log(error.config);
      } */
};

export const deleteCours = async (coursId) =>{ //userId, reviews, ratings // used to export the login function here
    //console.log(`This is cours : ${coursId} and this is user: ${userId}`); right:496px;bottom:80px;
    try{ //axios is used communicate btw back-end n front-end 
        //const res = 
        await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'DELETE',
            url: `http://127.0.0.1:8000/api/v1/tours/${coursId}`,
           
        }).then(()=>{
            showAlert('success', 'Course deleted successfully!');
            window.setTimeout(() =>{
                location.assign(`/cours`); //used in order to load another page n / here is to go to home page or load home page
            }, 1500);
        });
        /*if(res.data.status === 'success'){
            showAlert('success', 'Course deleted successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                location.assign(`/cours`); //used in order to load another page n / here is to go to home page or load home page
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
            //console.log(res.data.data.passwordResetToken);
        }*/
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

export const top5 = async () =>{ 
    //console.log(emails, passwords);
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/tours/top-5-cheap`,
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Course found successfully!');
            //console.log(res.data.data.data);
            {
                //var cnt = 0;
                res.data.data.data.map((item) =>{
                    const markup = `<div class="card-container" style="margin-bottom: 40px;">
                        <div class="card" style="margin-bottom: 30px;">
                            <div class="card__header">
                                <div class="card__picture">
                                    <div class="card__picture-overlay">&nbsp;</div>
                                    <img class="card__picture-img" src=/img/tours/${item.imageCover} alt=${item.name}/>
                                </div>
                                <h2 class="heading-tertirary"><span>${item.name}</span></h2>
                            </div>
                            <div class="card__details">
                                <h4 class="card__sub-heading">${item.difficulty} ${item.duration}-day cours</h4>
                                <p class="card__text">${item.summary}</p>
                                <div class="card__data">
                                    <svg class="card__icon">
                                        <use xlink:href="/img/icons.svg#icon-dollar-sign"></use>
                                    </svg>
                                    <span>${item.price}</span>
                                </div>
                                <div class="card__data">
                                    <svg class="card__icon">
                                        <use xlink:href="/img/icons.svg#icon-calendar"></use>
                                    </svg>
                                    <span>${item.startDates[0].toLocaleString('en-us', {month: 'long', year: 'numeric'})}</span>
                                </div>
                                <div class="card__data">
                                    <svg class="card__icon">
                                        <use xlink:href="/img/icons.svg#icon-user"></use>
                                    </svg>
                                    <span> rating (${item.ratingsQuantity})</span>
                                </div>
                                <div class="card__data">
                                    <a class="edit btn--cours" href=/cours/${item._id}>  
                                        <svg class="card__icon">
                                            <use xlink:href="/img/icons.svg#icon-edit-2"></use>
                                        </svg>
                                    </a>
                                    
                                    <a class="edit btn--cours" href=/cour/${item._id}> 
                                        <svg class="card__icon">
                                            <use xlink:href="/img/icons.svg#icon-delete"></use>
                                        </svg>
                                    </a>
                                    <a class="btn btn--green btn--small" href=/tour/${item.slug}>Details</a>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    //select elt where we want to include html elt we just created above 
                    document.querySelector('.user-view__content').insertAdjacentHTML('beforebegin', markup);
                    //console.log(item.imageCover);
                    //cnt += 1;
                    
                })  
                //console.log(cnt);
                 
            }    
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const monthCours = async (year) =>{ 
    //console.log(emails, passwords);
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/tours/montly-plan/${year}`,
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Course found successfully!');
            //console.log(res.data.data.plan); //.data.data
            {
                //var cnt = 0;
                res.data.data.plan.map((item) =>{
                    const markup = `<div class="card-container" style="margin-top: 20px;">
                        <div class="card" style="margin-bottom: 30px;">
                            <h2 class="heading-secondary ma-bt-lg"> Month No. ${item.month}</h2>
                           
                            <div class="card__details">
                                <div class="card__data">
                                    <span> Total Nb of course<br/> ${item.numTourStart}</span> &nbsp;
                                </div> 
                                <div class="card__data">
                                    <span> course<br/> ${item.tours} </span>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    //select elt where we want to include html elt we just created above 
                    document.querySelector('.user-view__content').insertAdjacentHTML('beforebegin', markup);
                    //console.log(item.imageCover);
                    //cnt += 1;
                    
                })  
                //console.log(cnt);
                 
            }  
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const statisticrs = async () =>{ 
    //console.log(emails, passwords);
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/tours/tour-stats`,
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Course found successfully!');
            console.log(res.data.data.stats);
            {
                //var cnt = 0;
                res.data.data.stats.map((item) =>{
                    //console.log(item._id);
                    const markup = `<div class="card-container" style="margin-top: 20px;">
                        <div class="card" style="margin-bottom: 30px;">
                            <h2 class="heading-secondary ma-bt-lg"> Difficulty ${item._id}</h2>
                           
                            <div class="card__details">
                                <div class="card__data">
                                    <span> Min Price ${item.minPrice}</span> &nbsp;
                                    <span> Average Price ${item.avgPrice} </span>
                                </div>
                                <div class="card__data">
                                    <span> Average Rating ${item.avgRating} </span>
                                </div>
                                <div class="card__data">
                                    <span> Total Rating ${item.numRatings} </span>
                                </div>
                                <div class="card__data">
                                    <span> Total Nb Course ${item.numTours} </span>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    //select elt where we want to include html elt we just created above 
                    document.querySelector('.user-view__content').insertAdjacentHTML('beforebegin', markup);
                    //console.log(item.imageCover);
                    //cnt += 1;
                    
                })  
                //console.log(cnt);
                 
            }  
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

