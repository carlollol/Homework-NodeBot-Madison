//files required
var runKey = require("./keys.js");
var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require("request");

// key stored in variable
var twitterKeys = runKey.twitterKeys;

//command line key
var arg = process.argv[2];

// Twitter function
var findTweets = function (twitterAccount)  {
	var client = new Twitter(twitterKeys);
	var params = {screen_name: twitterAccount};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (tweets.length < 20) {
    		for (var i = 0; (i < tweets.length); i++) {
    			console.log(" ");
    			console.log("Tweet: " + tweets[i].text);
    			console.log("	-" + tweets[i].created_at);
    			console.log(" ");
    			console.log("------------------------------------------------");
    		}
    	}
    	else {
    		for (var i = 0; (i < 20); i++) {
    			console.log(" ");
    			console.log("Tweet: " + tweets[i].text);
    			console.log("	-" + tweets[i].created_at);
    			console.log(" ");
    			console.log("-----------------------------------------------");
    		}
    	}
	});
}

// Spotify function
var findSong = function (songTitle) {
	spotify.search({ type: 'track', query: songTitle }, function(err, data) {
    	var artist = data.tracks.items[0].album.artists[0].name;
    	var album = data.tracks.items[0].album.name;
    	console.log(" ");
    	console.log("-----------------------------------------------------");
    	console.log(" ");
    	console.log("Artist(s): " + artist);
    	console.log("Song: " + data.tracks.items[0].name);
    	console.log("Preview: " + data.tracks.items[0].preview_url);
    	console.log("Album: "+ album);
    	console.log(" ");
    	console.log("-----------------------------------------------------");
    	console.log(" ");
	});
}

var findMovie = function (movieName) {
		var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";
		// Then run a request to the OMDB API with the movie specified
		request(queryUrl, function(error, response, body) {
  		// If the request is successful
  		if (!error && response.statusCode === 200) {

	    console.log("-----------------------------------------------------");
	    console.log(" ");
	    console.log("Title: " + JSON.parse(body).Title);
	    console.log("Release Date: " + JSON.parse(body).Year);
	    console.log("Rating: " + JSON.parse(body).imdbRating);
	    console.log("Country: " + JSON.parse(body).Country);
	    console.log("Language: " + JSON.parse(body).Language);
	    console.log("Actors: " + JSON.parse(body).Actors);
	    console.log("Plot: " + JSON.parse(body).Plot);
	    console.log(" ");
	    console.log("-----------------------------------------------------");
  }
});
}

var doIt = function () {
	fs.readFile("random.txt", "utf8", function(error, data) {
		var dataArr = data.split(",");
		switch(dataArr[0]) {
            case "my-tweets" :
                findTweets(dataArr[1]);
                break;
            case "spotify-this-song" :
                findSong(dataArr[1]);
                break;
            case "movie-this" :
                findMovie(dataArr[1]);
                break;
        }        
	});
}

// Switch to handle multiple arguments
switch(arg) {
    case "my-tweets" :
        findTweets(process.argv[3]);
        break;
    case "spotify-this-song" :
        findSong(process.argv.splice(3));
        break;
    case "movie-this" :
        findMovie(process.argv.splice(3).join("+"));
        break;
    case "do-what-it-says" :
        doIt();
        break;
    default :
        console.log("Opps, that's not good! Try Again.");                
}
