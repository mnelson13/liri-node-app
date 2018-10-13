require("dotenv").config();

let request = require("request");

let spotifyID = require("./keys.js");

// console.log(spotifyID);

let command = process.argv[2];
let searchItem = process.argv[3];
debugger;
if (command === "concert-this") {
    let artist = searchItem;
    let concertUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(concertUrl, function(error, response, body){
        if (error) throw error;
        if (!error && response.statusCode === 200) {
            results = JSON.parse(body);
            // console.log(results);

            results.forEach(
                function(result) {
                    console.log(result.venue.name);
                    console.log(result.venue.city + " " + result.venue.region);
                    console.log(result.datetime);
                }
            )
        }
    })
} else if (command === "spotify-this") {

} else if (command === "movie-this") {
    let movie = searchItem;
    let movieUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(movieUrl, function(error, response, body){
        if (error) throw error;
        if (!error && response.statusCode === 200) {
            console.log("Tile: " + JSON.parse(body).Title);
            console.log("Released: " + JSON.parse(body).Released);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating:  " + JSON.parse(body).Ratings[1].Value);
            console.log("Country Produced: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    })

} else if (command === "do-what-it-says") {

} else {
    console.log("invalid command, please try again")
};