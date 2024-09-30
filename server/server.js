const express = require('express');
// Import ApolloServer and Apollo-specific express middleware
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const db = require('./config/connection');
// Import typeDefs and resolvers once defined
const { typeDefs, resolvers } = require('./schemas')
// Import the authentication middleware
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;
//const routes = require('./routes'); // Replacing with GraphQL

const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist'))); // Changed from build to dist
  
    // Wildcard route to redirect to index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at https://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();