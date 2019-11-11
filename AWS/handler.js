'use strict';
//axios helps to send a API request to openweathermap API and get info for a city
const axios = require("axios");

module.exports.getWeather = async (event) => {
  const city = event.currentIntent.slots["City"];
  const url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&APPID=0dea7a5415d85ef421ea2315c3e9bfd4";

  try {
    const response = await axios.get(url);
    const data = response.data;

    const answer = "The temperature is " + data.main.temp + "C and Humidity is " + data.main.humidity + "% and " + data.weather[0].description + " is expected.";
    
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content": answer
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};


/// show the available  genre list

module.exports.getGenreList = async (event) => {
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"genre/movie/list?language=en-US&api_key=066b155baf4b9fc58ac620023fb8b5e5";
  var genreName="";
  try {
    const response = await axios.get(url);
    const data=response.data;
    for (var i=0;i<data.genres.length;i++){
      var genreName=genreName+data.genres[i].name+";";
    }
  
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":  genreName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/// show the movies with genre type

module.exports.getMoviesByGenre = async (event) => {

  const keyword= event.currentIntent.slots["genre"];
  //const keyword= "Action";
  //const keyword= "action";
  const baseURL="https://api.themoviedb.org/3/";
  const genreUrl = baseURL+"genre/movie/list?api_key=066b155baf4b9fc58ac620023fb8b5e5&language=en-US";
  var movieName="";
  try {
    const response = await axios.get(genreUrl);
    const data=response.data;

    if (data.genres.length <= 0){
      answer = answer + "No genre with name " + keyword + " found. Please make sure you type the name correctly."
    }
    for (var i=0;i<data.genres.length;i++){
      if(data.genres[i].name == keyword){
        var genreId=data.genres[i].id;
      }
    }
   console.log(genreId)
   const movieUrl="https://api.themoviedb.org/3/discover/movie?with_genres="+genreId+"&api_key=066b155baf4b9fc58ac620023fb8b5e5&sort_by=popularity.desc";
   const newResponse = await axios.get(movieUrl);
   const newData=newResponse.data;

    if (newData.results.length <= 0){
      answer = answer + "No genre with name " + keyword + " found. Please make sure you type the name correctly."
    }

    for (var i=0;i<5;i++){  
        var movieName= movieName+newData.results[i].original_title+";";
    }
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":  movieName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};


/// show the latest playing movie

module.exports.getLatestMovies = async (event) => {

  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"movie/now_playing?page=1&language=en-US&api_key=066b155baf4b9fc58ac620023fb8b5e5&language=en-US&sort_by=popularity.desc";
  var movieName="";
  try {
    const response = await axios.get(url);
    const data=response.data;
    for (var i=0;i<5;i++){
      var movieName= "Name :"+ data.results[i].original_title + "; Description : "+ data.results[i].overview + "; Release Date : "+data.results[i].release_date ;
  
    }
 
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":   movieName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};


/// show the list of upcoming  movies

module.exports.getUpcomingMovies = async (event) => {

  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"movie/upcoming?api_key=066b155baf4b9fc58ac620023fb8b5e5&language=en-US&page=1&sort_by=popularity.desc";
  var movieName="";
  try {
    const response = await axios.get(url);
    const data=response.data;
    for (var i=0;i<5;i++){
      var movieName= movieName+"Name :"+data.results[i].title+", Release Date : " +data.results[i].release_date+",";
    }
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":   movieName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};



/// show the details of upcoming  movies

module.exports.getMovieDetails = async (event) => {

  const name= event.currentIntent.slots["nameofmovie"];
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"discover/movie?api_key=066b155baf4b9fc58ac620023fb8b5e5&sort_by=popularity.desc";
  var details="";
  try {
    const response = await axios.get(url);
    const data=response.data;
    for (var i=0;i<data.results.length;i++){
      var detailsVal=data.results[i].title;
      if(detailsVal== name){
        var details= details + "Details of the movie :"+data.results[i].overview +"; Release Date:"+data.results[i].release_date;        
      }   
    }

    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":   details
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};


/// show the list of  movies that came in year  "X"

module.exports.getMoviesByYear = async (event) => {
  
  const yearInput= event.currentIntent.slots["Year"];
  console.log(yearInput)
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"movie/top_rated?page=1&language=en-US&api_key=066b155baf4b9fc58ac620023fb8b5e5" ;
  var movieName="";
  var flag=0;
  try {
    const response = await axios.get(url);
    const data=response.data;
    for (var i=0;i<data.results.length;i++){
      var year=data.results[i].release_date.substring(0, 4);
      if (year ==yearInput){
         flag=1;
         var movieName= movieName + "Name :" + data.results[i].original_title + "; Release Date : " +data.results[i].release_date + "; Description : "+ data.results[i].overview ;
    }
  }
  if (flag==0){
    var movieName= "Sorry I couldn't find any";
  }
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState":  "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":   movieName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Show similar movies

module.exports.getSimilarMovies = async (event) => {
  const baseURL="https://api.themoviedb.org/3/";
  const namemovie= event.currentIntent.slots["nameMovie"];
  const popularURL = baseURL+"movie/popular?page=1&language=en-US&api_key=066b155baf4b9fc58ac620023fb8b5e5";
  var idVal;
  var name="El Camino: A Breaking Bad Movie"
  try {
    const response = await axios.get(popularURL);
    const data = response.data;
    for (var i=0;i<data.results.length;i++){
      var val=data.results[i].original_title;
      if (val==movieName)
      {
         idVal=data.results[i].id;
      }
    }
    console.log(idVal);
    const similarURL = baseURL+"movie/"+idVal+"/similar?api_key=066b155baf4b9fc58ac620023fb8b5e5&language=en-US&page=1";
    
    var similarMovies="";
    const new_response = await axios.get(similarURL);
    const new_data = new_response.data;
    for (var i=0;i<5;i++){
      similarMovies = similarMovies+new_data.results[i].title +";";

    }
    
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState":  "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":   name
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// show movies by actor
module.exports.getMoviesByActor= async (event) => {
  const keyword = event.currentIntent.slots["Actor"];

  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"search/person?api_key=066b155baf4b9fc58ac620023fb8b5e5&query=" + keyword+"&sort_by=popularity.desc";
  var answer = "";
  try {
    const response = await axios.get(url);
    const data=response.data;
 
    /**
     * Filter actors
     */
    var data_final = [];
    for(var i=0;i<data.results.length;i++){
      if(data.results[i].known_for_department=="Acting"){
        data_final.push(data.results[i]);
      }
    }
 
    /**
     * If no people are found, return error message
     */
    if (data_final.length <= 0){
      answer = answer + "No actor with name " + keyword + " found. Please make sure you write the name correctly."
    }
 
    /**
     * If different people are found, return list of possible people
     */
    else if (data_final.length > 1){
      answer = answer + "Your actor query lead to more than one result. Please specify which person you want to search for: ";  
 
      for (var i=0;i<data.results.length-1;i++){
          if (data.results[i].known_for_department == "Acting")
            answer = answer + data.results[i].name + ", ";
      }
      answer = answer + data.results[data.results.length-1].name;
    }
 
    /**
     * If exactly one match found, print movie recommendation
     */
    else if (data_final.length == 1){
      var actor_id = data.results[0].id;
      try {
        const url_actor = baseURL + "discover/movie?api_key=5e3c4a05e6db9436d1ae340d69fdb46e&with_cast=" + actor_id + "&sort_by=popularity.desc";
        const response_actor = await axios.get(url_actor);
        const data_actor=response_actor.data;
 
        answer = answer + "I recommend this movie with " + keyword + ": " + data_actor.results[0].original_title;
 
      } catch (error) {
        console.log(error);
      }
    }
    console.log(answer);
 
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content": answer
        }
      }
    }
   
  } catch (error) {
    console.log(error);
  }
};

module.exports.getTopRatedMovieList = async (event) => {
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"movie/top_rated?api_key=0b12f23e4febcbc3cfa1544d420ca7ea&language=en-US&page=1";
  topMovieName=" ";
  try {
    const response = await axios.get(url);
    const data = response.data;
    for (var i=0;i<data.results.length;i++){
      var topMovieName=topMovieName+data.results[i].title+"\n" ;
      topMovieName=topMovieName.replace(/\n/g, "  ");
    }
   
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":" The list of top rated movies in the database are:  " + topMovieName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.getMovieDetail = async (event) => {
  const key = event.currentIntent.slots["key"];
  const baseURL="https://api.themoviedb.org/3/";
  //const key="Joker";
  
  const url = baseURL+"search/movie?api_key=0b12f23e4febcbc3cfa1544d420ca7ea&query="+key;
  var MovieDetail=" ";
  try {
    const response = await axios.get(url);
    const data = response.data;
    
      var MovieDetail=MovieDetail+"From the year "+"\n"+data.results[0].release_date+"is as follows: "+data.results[0].overview+"\n" ;
      MovieDetail=MovieDetail.replace(/\n/g, "  ");
    
   
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":" Movie plot of:  "+key+ MovieDetail
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};