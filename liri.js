require("dotenv").config();

let request = require("request");

let moment = require("moment");

let fs = require("fs");

let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let spotify = new Spotify(keys.spotify);

let command = process.argv[2];
let searchItem = process.argv[3];


function displaySong(song) {
    spotify.search({type: "track", query: song, limit: 1 }, function(err, data){
        if (err) throw err;
        if (!err) {
            
            let songInfo = data.tracks.items[0];
            // console.log(songInfo);

            console.log("\nSong Information:")
            console.log("\nTitle: " + songInfo.name);
            console.log("Artist: " + songInfo.artists[0].name)
            console.log("Album: " + songInfo.album.name);

            if (songInfo.preview_url !== null) {
                console.log("Preview url: " + songInfo.preview_url);
            } else if (songInfo.preview_url === null) {
                console.log("preview not available");
            }
        }
    })
};


function run(){
    if (command === "concert-this") {
        let artist = searchItem;
        let concertUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        request(concertUrl, function(error, response, body){
            if (error) throw error;
            if (!error && response.statusCode === 200) {
                // console.log(JSON.parse(body));
                results = JSON.parse(body);

                console.log("\nUpcoming Events for " + artist + ":");

                results.forEach(
                    function(result) {

                        console.log("\n" + result.venue.name);
                        console.log(result.venue.city + " " + result.venue.region);
                        
                        let date = moment(result.datetime);
                        formattedDate = date.format("MM/DD/YYYY");
                        console.log(formattedDate);
                    }
                )
            }
        })

    } else if (command === "spotify-this-song") {
        let song = searchItem;

        if (song) {
            displaySong(song);
        } else {
            displaySong("The Sign Ace of Base");
        }

    } else if (command === "movie-this") {
        let movie = searchItem;
        let movieUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

        request(movieUrl, function(error, response, body){
            if (error) throw error;
            if (!error && response.statusCode === 200) {
                console.log("\nMovie Information:")
                console.log("\nTile: " + JSON.parse(body).Title);
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
        fs.readFile("random.txt", "utf8", function(error, data){
            if (error) throw error;

            let dataArr = data.split(",");
            // console.log(dataArr);
            command = dataArr[0];
            searchItem= dataArr[1];
            run();

        })

    } else {
        console.log("invalid command, please try again")
    };
};

run();