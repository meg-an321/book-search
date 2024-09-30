const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // We will use GraphQL to return an Authentication error if encountered
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTENTICATED'
    }
  }),
  // function for our authenticated routes 
    // No longer using HTTPS routes so can remove (res, next)
  authMiddleware: function ({ req }) {
    // allows token to be sent via  req.query or headers
      // Added functionality to allow tokens to be sent via req.body
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim(); // Splits the token string into an array to return the actual token
    }

    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    // Return the request object so it can be passed to the resolver as 'context'
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};