<template>
  <v-container fluid>
    <p>{{ selectedMovieId }}</p>
    <v-row>
      <v-col v-for="movie in popularMovies" :key="movie.id" :cols="cols">
        <!-- <v-card @click="selectedMovieId = movie.id"> -->
        <v-card @click="handleClickMovie(movie.id)">
          <v-img
            :src="`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,1)"
            :height="(selectedMovieId === movie.id) ? '700' : '400px'"
          >
            <v-card-title v-text="movie.title"></v-card-title>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-card v-for="movie in favoriteMovies" :key="movie.id" class="mb-4">
      {{ movie.title }}
    </v-card> -->
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import userByPk from "@/gql/userByPk.gql";
import getPopularMovies from "@/gql/getPopularMovies.gql";

export default {
  name: "MovieDB",

  data() {
    return {
      favoriteMovies: [],
      popularMovies: [],
      selectedMovieId: null,
    };
  },

  computed: {
    ...mapState(["userId"]),

    cols() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 12
          break;
        case 'sm':
          return 4
          break;
        case 'md':
          return 3
          break;
        default:
          return 2
      }
    }
  },

  methods: {
    handleClickMovie(movieId) {
      if (this.selectedMovieId === movieId) {
        this.selectedMovieId = null
      } else {
        this.selectedMovieId = movieId
      }
    }
  },

  apollo: {
    popularMovies() {
      return {
        query: getPopularMovies,
        update: data => data.getPopularMovies
      };
    },
    favoriteMovies() {
      return {
        query: userByPk,
        variables() {
          return {
            id: this.userId
          };
        },
        update: data => data.user_by_pk.favorite_movies.map(x => x.movie.details)
      };
    }
  }
};
</script>