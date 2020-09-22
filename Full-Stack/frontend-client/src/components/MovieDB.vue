<template>
  <v-container fluid>
    <!-- <p>{{ selectedMovieId }}</p> -->
    <v-row>
      <v-col
        v-for="movie in popularMovies"
        :key="movie.id"
        :cols="cols"
      >
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
    <v-dialog
      v-model="dialog"
      max-width=900
    >
      <v-card
        v-if="isMovieSelected"
        tile
        class="d-flex flex-no-wrap justify-space-between"
      >
        <v-img
          max-height=700
          max-width=450
          contain
          :src="`https://image.tmdb.org/t/p/w600_and_h900_bestv2${selectedMovieDetails.poster_path}`"
        >
        </v-img>
        <v-card>
          <v-card-title>
            Title: {{ selectedMovieDetails.title }}
          </v-card-title>
          <v-card-subtitle>
            Rating: {{ selectedMovieDetails.vote_average }}/10
          </v-card-subtitle>
          <v-card-text>
            Overview: {{ selectedMovieDetails.overview }}
          </v-card-text>
          <v-card-subtitle>
            Release Date: {{ selectedMovieDetails.release_date }}
          </v-card-subtitle>
          <v-card-text>
            <v-btn
              color="red"
              dark
              :outlined="!isSelectedMovieFavorited"
              @click="handleFavoriteButtonClick(selectedMovieId)"
            > {{ isSelectedMovieFavorited ? 'favorted' : 'favorite' }} </v-btn>
            <!-- @click="addMovieToFavorites(selectedMovieId)" -->
          </v-card-text>
        </v-card>
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
import insertMovieOne from "@/gql/insertMovieOne.gql";
import deleteUserMovieByPk from "@/gql/deleteUserMovieByPk.gql";

const removeIndex = (arr, index) => {
  return arr.splice(index, 1);
};

export default {
  name: "MovieDB",

  data() {
    return {
      favoriteMovies: [],
      popularMovies: [],
      selectedMovieId: null,
      dialog: false,
    };
  },

  computed: {
    ...mapState(["userId"]),

    isSelectedMovieFavorited() {
      return this.favoriteMovies.some((x) => x.id === this.selectedMovieId);
    },

    selectedMovieDetails() {
      return this.popularMovies.find((x) => x.id === this.selectedMovieId);
    },

    isMovieSelected() {
      // return !!this.selectedMovieId;
      return this.dialog;
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
    },
  },

  methods: {
    handleClickMovie(movieId) {
      this.selectedMovieId = movieId;
      this.dialog = true;
    },

    handleFavoriteButtonClick(movieId) {
      if (!this.isSelectedMovieFavorited) {
        this.$apollo.mutate({
          mutation: insertMovieOne,

          variables: {
            userId: this.userId,
            movieId: movieId,
          },

          update: (store, { data: { insert_movie_one } }) => {
            const data = store.readQuery({
              query: userByPk,
              variables: {
                id: this.userId,
              },
            });

            data.user_by_pk.favorite_movies.push({
              movie: insert_movie_one,
              __typename: "user_movie",
            });

            store.writeQuery({
              query: userByPk,
              data,
              variables: {
                id: this.userId,
              },
            });
          },
        });
      } else {
        this.$apollo.mutate({
          mutation: deleteUserMovieByPk,

          variables: {
            userId: this.userId,
            movieId: movieId,
          },

          update: (
            store,
            {
              data: {
                delete_user_movie_by_pk: {
                  movie: { id: removedId },
                },
              },
            }
          ) => {
            const data = store.readQuery({
              query: userByPk,
              variables: {
                id: this.userId,
              },
            });

            removeIndex(
              data.user_by_pk.favorite_movies,
              data.user_by_pk.favorite_movies.findIndex(({ movie }) => {
                return movie.id === removedId;
              })
            );

            store.writeQuery({
              query: userByPk,
              data,
              variables: {
                id: this.userId,
              },
            });
          },
        });
      }
    },
  },

  apollo: {
    popularMovies() {
      return {
        query: getPopularMovies,
        update: (data) => data.getPopularMovies,
      };
    },

    favoriteMovies() {
      return {
        query: userByPk,

        variables() {
          return {
            id: this.userId,
          };
        },

        update: (data) =>
          data.user_by_pk.favorite_movies.map((x) => {
            return {
              ...x.movie.details,
              id: x.movie.id,
            };
          }),
      };
    },
  },
};
</script>
