import { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth'; // Import the Auth module
import { searchGoogleBooks } from '../utils/API'; // Import the searchGoogleBooks function
import { saveBookIds, getSavedBookIds } from '../utils/localStorage'; // Import the saveBookIds and getSavedBookIds functions
import { useMutation } from '@apollo/client'; // Import the useMutation hook from Apollo Client
import { SAVE_BOOK } from '../utils/mutations'; // Import the SAVE_BOOK mutation

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // define the save book function from the mutation
  const [saveBook] = useMutation(SAVE_BOOK)

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) { // If there is no search input, return false
      return false; 
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) { // If there is no response, throw an error
        throw new Error('something went wrong!');
      }

      const { items } = await response.json(); // If there is a response, get the items from the response

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'], // If there are no authors, display 'No author to display'
        title: book.volumeInfo.title, // Get the title from the book.volumeInfo object
        description: book.volumeInfo.description, // Get the description from the book.volumeInfo object
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    if (!bookToSave) {
      return;
    }

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) { // If there is no token, return false
      return false; 
    }

    try {
      const { data } = await saveBook({
        variables: { bookInput: bookToSave },
      });

      if (!data) {
        throw new Error('Failed to save book');
      }

      
      setSavedBookIds([...savedBookIds, bookToSave.bookId]); // add the bookId to the savedBookIds array
    } catch (err) { // If there is an error, log the error
      console.error(err); // If there is an error, log the error
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <a href={book.link} target="_blank" rel="noopener noreferrer">
                      <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                    </a>
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <p>
                      <a href={book.link} target="_blank" rel="noopener noreferrer"> 
                        View on Google Books
                      </a>
                    </p>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}> 
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId) // if the book is in the savedBooks array, display 'This book has already been saved!'
                          ? 'This book has already been saved!' // if the book is not in the savedBooks array, display 'Save this Book!'
                          : 'Save this Book!'} 
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;