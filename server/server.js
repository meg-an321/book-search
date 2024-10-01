const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');
const { ApolloServer } = require('apollo-server-express'); // import ApolloServer
const { typeDefs, resolvers } = require('./schemas'); // import typeDefs and resolvers
const { authMiddleware } = require('./utils/auth'); // import authMiddleware


const app = express();
const PORT = process.env.PORT || 3001;

// Create an instance of Apollo Server
const server = new ApolloServer({
  typeDefs,    // pass in the typeDefs and resolvers from the schemas and resolvers files for the server to use
  resolvers,
  context: authMiddleware,
  formatError(err) {
    console.log(err);
    return err;
  }
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start(); // start the server
  server.applyMiddleware({ app }); // apply the server to the Express app as middleware

  app.use(express.urlencoded({ extended: true })); // extended: true allows for nested objects in query strings
  app.use(express.json()); // tells the server that we are using JSON

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
  
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }


  // app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
};

// Call the async function to start the server
startApolloServer();