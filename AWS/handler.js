module.exports.getDirector= async (event) => {
  const keyword = event.currentIntent.slots["Director"];
  //const keyword = "James+Cameron";
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"search/person?api_key=5e3c4a05e6db9436d1ae340d69fdb46e&query=" + keyword;
  var answer = "";
 
  try {
    const response = await axios.get(url);
    const data=response.data;
 
    /**
     * Filter actors
     */
    var data_final = [];
    for(var i=0;i<data.results.length;i++){
      if(data.results[i].known_for_department=="Directing"){
        data_final.push(data.results[i]);
      }
    }
 
    /**
     * If no people are found, return error message
     */
    if (data_final.length <= 0){
      answer = answer + "No Director with name " + keyword + " found. Please make sure you write the name correctly."
    }
 
    /**
     * If different people are found, return list of possible people
     */
    else if (data_final.length > 1){
      answer = answer + "Your director query lead to more than one result. Please specify which person you want to search for: ";  
 
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
      var director_id = data.results[0].id;
      try {
        const url_director = baseURL + "discover/movie?api_key=5e3c4a05e6db9436d1ae340d69fdb46e&with_people=" + director_id + "&sort_by=popularity.desc";
        const response_director = await axios.get(url_director);
        const data_director=response_director.data;
 
        answer = answer + "I recommend this movie with " + keyword + ": " + data_director.results[0].original_title;
 
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
