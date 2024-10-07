// route to get logged in user's info (needs the token)
export const getMe = (token) => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (userData) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// save book data for a logged in user
export const saveBook = (bookData, token) => { // called the saveBook function with the bookData object and the token as arguments
  return fetch('/api/users', { // called the /api/users route
    method: 'PUT', // used the PUT method to update the user
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`, // brearer token used to authenticate the user
    },
    body: JSON.stringify(bookData), // passed the bookData object as the body of the request
  });
};

// remove saved book data for a logged in user
export const deleteBook = (bookId, token) => { // called the deleteBook function with the bookId and token as arguments
  return fetch(`/api/users/books/${bookId}`, {
    method: 'DELETE', // used the DELETE method to remove the book
    headers: {
      authorization: `Bearer ${token}`, // brearer token used to authenticate the user
    },
  });
};

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};