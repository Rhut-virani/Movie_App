const express = require('express'),
      app = express();
var request = require("request");

app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/movie', (req, res)=>{
    var options = 
    { 
    method: 'GET',
    url: 'https://api.themoviedb.org/3/movie/top_rated',
    qs: 
        { page: '1',
        language: 'en-US',
        api_key: '9fedd0c8b577f3ffc23a28a67e0a144d' },
        body: '{}' 
    }
    request(options, (error, response, body) =>{
        if (error) throw new Error(error);

        let jsonbody = JSON.parse(body);
        let moviesarr = jsonbody.results;
        res.render('index', {movies: moviesarr,});
    });
});


app.get('/movie/:movieId', (req, res)=>{
    var iD = parseInt(req.params.movieId);
    var options = { method: 'GET',
                    url: 'https://api.themoviedb.org/3/movie/' + iD ,
                    qs: 
                        { language: 'en-US',
                        api_key: '9fedd0c8b577f3ffc23a28a67e0a144d' },
                    body: '{}' 
    };

    request(options, (error, response, body) =>{
        if (error) throw new Error(error);
        let jsonbody = JSON.parse(body);
        let moviesarr = jsonbody;
        
            var options = { method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/' + iD +'/images',
            qs: { api_key: '9fedd0c8b577f3ffc23a28a67e0a144d' },
            body: '{}' };
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
            let posterjson = JSON.parse(body);
            let posterarr= posterjson;
            
                var options = { method: 'GET',
                                url: 'https://api.themoviedb.org/3/movie/' + iD +  '/videos',
                                qs: 
                                { language: 'en-US',
                                api_key: '9fedd0c8b577f3ffc23a28a67e0a144d' },
                                body: '{}' };

                            request(options, function (error, response, body) {
                                if (error) throw new Error(error);
                                let trailerjson = JSON.parse(body);
                                let trailerarr= trailerjson;

                                var options = { method: 'GET',
                                url: 'https://api.themoviedb.org/3/movie/'+ iD + '/credits',
                                qs: { api_key: '9fedd0c8b577f3ffc23a28a67e0a144d' },
                                body: '{}' };
                            
                            request(options, function (error, response, body) {
                                if (error) throw new Error(error);
                                let creditjson = JSON.parse(body);
                                let creditarr= creditjson;

                             res.render('movie', {movies: moviesarr, posters:posterarr, trailers:trailerarr, credits:creditarr} );

                            });
                });

    });
});
});

app.get('/search?', (req,res)=>{
    var search = req.query.searchTerm;
    var options = { 
        method: 'GET',
        url: 'https://api.themoviedb.org/3/search/movie',
        qs: 
            {   include_adult : 'false',
                page: '1',
                query: search,
                language: 'en-US',
                api_key: '9fedd0c8b577f3ffc23a28a67e0a144d'
            },
        body: '{}' 
    }; 
    request(options, (error, response, body) =>{
        if (error) { throw new Error(error); } // just checking for Error
    
        var jsonbody = JSON.parse(body);

        if (jsonbody.total_results > 0){                         
        let moviesarr = jsonbody.results; 
        res.render('search', {movies: moviesarr});  
        }        
        else{
            let moviesarr = 
                    {
                        "vote_count": 5,
                        "id": 71481,
                        "video": false,
                        "vote_average": 4.3,
                        "title": "404: Error Not Found",
                        "popularity": 1.494888,
                        "poster_path": "/zPhsCyhmRLNl8Fbr8EUccXVGvtu.jpg",
                        "original_language": "en",
                        "original_title": "404: Error Not Found",
                        "backdrop_path": "/ntl8zlkalqgDvQo7GgcSSiaIua7.jpg",
                        "adult": false,
                        "overview": "A brilliant student starts hallucinating after moving into a room that was occupied by another who committed suicide.",
                        "release_date": "2011-05-20",
                        "tagline": "Can you survive from your own mind.",
                        "imdb_id" : "tt1883121",
                        "genres":[{"name":"Drama"},
                                {"name":"Mystery"},
                                {"name":"Thriller"}
                        ],
                    };
            res.render('movie-error', {movies: moviesarr});  

        }
});
});

app.get('/myfavs', (req,res)=>{
    var options = { 
    method: 'GET',
    url: 'https://api.themoviedb.org/3/list/64279',
    qs: 
     { language: 'en-US',
       api_key: '9fedd0c8b577f3ffc23a28a67e0a144d' },
    body: '{}' 
};
  
    request(options, function (error, response, body) {
    if (error) throw new Error(error); // just checking for Error
        var jsonbody = JSON.parse(body);
        let moviesarr = jsonbody.items; 
        res.render('myfavs', {movies: moviesarr});  
});
});


app.listen(8080, ()=>{
    console.log('Server Is running');
    console.log('Press Ctrl+C to exit');
});