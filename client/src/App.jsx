import './App.css';
import { Outlet } from 'react-router-dom';
import {  // Import the necessary libraries from Apollo Client
  ApolloClient, 
  InMemoryCache,  // store the results of the queries that the client has made 
  ApolloProvider, // wrap the React app with the ApolloProvider component
  createHttpLink  // HttpLink class from Apollo Client
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Navbar from './components/Navbar';


const httpLink = createHttpLink({ // Create an HTTP link to the GraphQL server
  uri: '/graphql', // Set the URI to /graphql
});


const authLink = setContext((_, { headers }) => { // Set up the authentication link to include the token in the headers
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', //if there is a token, set the authorization header to include the token
    },
  };
});


const client = new ApolloClient({ //creating a new ApolloClient instance
  link: authLink.concat(httpLink), //combining the authLink and httpLink
  cache: new InMemoryCache(), //creating a new InMemoryCache instance
}); 

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
