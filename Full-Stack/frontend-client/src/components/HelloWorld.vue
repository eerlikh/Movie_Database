<template>
  <v-container>
      <v-card v-for="movie in popularMovies" :key="movie.id">
          {{ movie.title }}
      </v-card>
      <v-card v-for="movie in favoriteMovies"
            :key="movie.id" class="mb-4">

            {{ movie.title }}
      </v-card>

  </v-container>
</template>

<script>
import { mapState } from "vuex";
import userByPk from "@/gql/userByPk.gql";
import getPopularMovies from "@/gql/getPopularMovies.gql";


export default {
  name: "HelloWorld",

  data() {
    return {
      favoriteMovies: [],
      popularMovies: []
    };
  },

  computed: {
    ...mapState(["userId"])
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
        update: data =>
          data.user_by_pk.favorite_movies.map(x => x.movie.details)
      };
    }
  }
};
</script>
