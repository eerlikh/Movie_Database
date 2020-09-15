const { RESTDataSource } = require('apollo-datasource-rest');

// const https://api.themoviedb.org/3/movie/550?api_key=blooblahbleh

class TheMovieDBAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.themoviedb.org/3/'
  }

  async getMovieDetails(id) {
    return this.get(
      `movie/${id}`,
      { 
        api_key: process.env.THE_MOVIE_DB_KEY
      }
    )
  }
}

module.exports = TheMovieDBAPI;
