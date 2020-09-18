<template>
  <v-container fluid>
    <!-- <p>{{ selectedMovieId }}</p> -->
    <v-row>
      <v-col v-for="movie in popularMovies" :key="movie.id" :cols="cols">
        <v-card @click="handleClickMovie(movie.id)">
          <v-img
            :src="`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,1)"
            height="400px"
          >
            <v-card-title v-text="movie.title"></v-card-title>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-card v-for="movie in favoriteMovies" :key="movie.id" class="mb-4">
      {{ movie.title }}
    </v-card> -->
    <v-dialog v-model="dialog">
      <v-card v-if="isMovieSelected">
        <div class="d-flex flex-no-wrap justify-space-between">
          <v-img 
            contain
            :src="`https://image.tmdb.org/t/p/w600_and_h900_bestv2${selectedMovieDetails.poster_path}`"
          >
          </v-img>
          <v-card>
            <v-card-title>
              {{ selectedMovieDetails.title }}
            </v-card-title>
            <v-card-text>
              {{ selectedMovieDetails.overview }}
            </v-card-text>
          </v-card>
        </div>
      </v-card>

      <!-- <v-card>
        <v-card-title>Select Country</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-radio-group v-model="dialogm1" column>
            <v-radio label="Burma" value="burma"></v-radio>
            <v-radio label="Burundi" value="burundi"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card> -->
    </v-dialog>
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
      dialog: false
    };
  },

  computed: {
    ...mapState(["userId"]),

    selectedMovieDetails() {
      return this.popularMovies.find(x => x.id === this.selectedMovieId);
    },

    isMovieSelected() {
      return !!this.selectedMovieId;
    },

    cols() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 12;
          break;
        case "sm":
          return 4;
          break;
        case "md":
          return 3;
          break;
        default:
          return 2;
      }
    }
  },

  methods: {
    handleClickMovie(movieId) {
      // deselect movie
      if (this.selectedMovieId === movieId) {
        this.selectedMovieId = null;
        this.dialog = false;
        // select movie
      } else {
        this.selectedMovieId = movieId;
        this.dialog = true;
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
