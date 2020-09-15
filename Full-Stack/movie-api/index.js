require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const resolvers = require('./resolvers');

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'typeDefs.gql'), 'utf-8'
);

const TheMovieDBAPI = require('./datasources/TheMovieDBAPI');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  debug: true,
  dataSources: () => ({ theMovieDBAPI: new TheMovieDBAPI })
})

server.listen({
  cors: {
    credentials: true,
    origin: [4000]
  },
  port: process.env.LOCAL_PORT || 4000
}).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});