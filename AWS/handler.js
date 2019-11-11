'use strict';
const axios = require("axios")
 
module.exports.getActor= async (event) => {
  const keyword = event.currentIntent.slots["Actor"];
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"search/person?api_key=5e3c4a05e6db9436d1ae340d69fdb46e&query=" + keyword;
  var answer = "";
 
  try {
    const response = await axios.get(url);
    const data=response.data;
 
    /**
     * If no people are found, return error message
     */
    if (data.total_results <= 0){
      answer = answer + "No actor with name " + keyword + " found. Please make sure you write the name correctly."
    }
 
    /**
     * If different people are found, return list of possible people
     */
     else if (data.total_results > 1){
  /**   answer = answer + "Your actor query lead to more than one result. Please specify which person you want to search for: ";  
 */  
        answer = answer + data.results[data.results.length-1].name
    /*  for (var i=0;i<data.results.length-1;i++){
          if (data.results[i].known_for_department == "Directing")
            answer = answer + data.results[i].name + ", ";
      }
       */
      answer = answer + data.results[data.results.length-1].name;
    }

    /**
     * If exactly one match found, print movie recommendation
     */
    else if (data.total_results == 1){
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
 
module.exports.getGenre = async (event) => {
 
  const keyword= event.currentIntent.slots["Genre"];
  //const keyword= "action";
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"search/movie?api_key=5e3c4a05e6db9436d1ae340d69fdb46e" +"&query="+ keyword;
  var movieName="";
  try {
    const response = await axios.get(url);
    const data=response.data;
    for (var i=0;i<5;i++){
      var movieName= movieName + "Title: "+ data.results[i].title+"; ";
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
 
 
module.exports.getDirector= async (event) => {
  const keyword = event.currentIntent.slots["Director"];
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"search/person?api_key=5e3c4a05e6db9436d1ae340d69fdb46e&query=" + keyword;
  var answer = "";
 
  try {
    const response = await axios.get(url);
    const data=response.data;
 
    /**
     * If no people are found, return error message
     */
    if (data.total_results <= 0){
      answer = answer + "No director with name " + keyword + " found. Please make sure you write the name correctly."
    }
 
    /**
     * If different people are found, return list of possible people
     */

 
    /**
     * If exactly one match found, print movie recommendation
     */
    else if (data.total_results >= 1 && data.results[0].known_for_department == "Directing"){
      var director_id = data.results[0].id;
      try {
        const url_director = baseURL + "discover/movie?api_key=5e3c4a05e6db9436d1ae340d69fdb46e&with_crew=" + director_id + "&sort_by=popularity.desc";
        const response_director = await axios.get(url_director);
        const data_director=response_director.data;
        answer = answer + "I recommend this movie with " + keyword + ": " + data_director.results[0].original_title;
      } catch (error) {
        console.log(error);
      }
    }
    else{
      answer = answer + "No director with name " + keyword + " found. Please make sure you write the name correctly."
    }
 
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
