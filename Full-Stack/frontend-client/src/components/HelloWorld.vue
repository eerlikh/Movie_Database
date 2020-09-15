<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        asldfkjasldfkjaskldfj
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import userByPk from "@/gql/userByPk.gql";

export default {
  name: "HelloWorld",

  data() {
    return {
      favoriteMovies: null
    };
  },

  computed: {
    ...mapState(["userId"])
  },

  apollo: {
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
