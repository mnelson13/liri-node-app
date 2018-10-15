require("dotenv").config();

let request = require("request");

let moment = require("moment");

let fs = require("fs");

let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let spotify = new Spotify(keys.spotify);

let command = (process.argv[2]).toLowerCase();
let searchItem = process.argv[3];


function run(){
    if (command === "concert-this") {
        let artist = searchItem;
        let concertUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        request(concertUrl, function(error, response, body){
            if (error) throw error;
            if (!error && response.statusCode === 200) {
                // console.log(JSON.parse(body));
                results = JSON.parse(body);

                let heading = "\nUpcoming Events for " + artist + ":";
                console.log(heading);
                
                fs.appendFile("log.txt", "\n===============================\n" + heading, function(err){
                    if(err) throw err;
                });

                results.forEach(
                    function(result) {

                        let venue = ("\n" + result.venue.name);
                        let location = (result.venue.city + " " + result.venue.region);
                        let date = moment(result.datetime);
                        formattedDate = date.format("MM/DD/YYYY");

                        console.log(venue);
                        console.log(location);
                        console.log(formattedDate);

                        fs.appendFile("log.txt", "\n" + venue + "\n" + location + "\n" +formattedDate, function(err){
                            if(err) throw err;
                        })
                    }
                )
            }
        })

    } else if (command === "spotify-this-song") {
        let song = searchItem;

        if (searchItem === undefined) {
            song = "The Sign Ace of Base"
        }

        spotify.search({type: "track", query: song, limit: 1 }, function(err, data){
            if (err) throw err;
            if (!err) {
                
                let songInfo = data.tracks.items[0];
                // console.log(songInfo);
    
                let heading = ("\nSong Information:")
                let title = ("\nTitle: " + songInfo.name);
                let artist = ("Artist: " + songInfo.artists[0].name)
                let album = ("Album: " + songInfo.album.name);

                console.log(heading);
                console.log(title);
                console.log(artist);
                console.log(album);

                fs.appendFile("log.txt", "\n===============================\n" + heading + title + "\n" + artist + "\n" + album + "\n", function(err){
                    if (err) throw err;
                });
    
                if (songInfo.preview_url !== null) {
                    let preview = ("Preview url: " + songInfo.preview_url);
                    console.log(preview);
                    fs.appendFile("log.txt", preview, function(err){
                        if(err) throw err;
                    });
                } else if (songInfo.preview_url === null) {
                    let preview = ("Preview not available");
                    console.log(preview);
                    fs.appendFile("log.txt", preview, function(err){
                        if(err) throw err;
                    });
                }

                
            }
        })

    } else if (command === "movie-this") {
        let movie = searchItem;

        if (searchItem === undefined) {
            movie = "Mr. Nobody"
        }

        let movieUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

        request(movieUrl, function(error, response, body){
            if (error) throw error;
            if (!error && response.statusCode === 200) {
                let heading = ("\nMovie Information:")
                let title = ("\nTile: " + JSON.parse(body).Title);
                let released = ("Released: " + JSON.parse(body).Released);
                let imdbRating = ("IMDB Rating: " + JSON.parse(body).imdbRating);
                let tomatoesRating = ("Rotten Tomatoes Rating:  " + JSON.parse(body).Ratings[1].Value);
                let country = ("Country Produced: " + JSON.parse(body).Country);
                let language = ("Language: " + JSON.parse(body).Language);
                let plot = ("Plot: " + JSON.parse(body).Plot);
                let actors = ("Actors: " + JSON.parse(body).Actors);

                console.log(heading);
                console.log(title);
                console.log(released);
                console.log(imdbRating);
                console.log(tomatoesRating);
                console.log(country);
                console.log(language);
                console.log(plot);
                console.log(actors);

                fs.appendFile("log.txt", "\n===============================\n" + heading + title + "\n" + released + "\n" + imdbRating + "\n" + tomatoesRating + "\n" + country + "\n" + language + "\n" + plot + "\n" + actors, function(err){
                    if(err) throw err;
                });
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