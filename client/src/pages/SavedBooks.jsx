import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client'; // Import the useQuery and useMutation hooks from Apollo Client
import { GET_ME } from '../utils/queries'; // Import the GET_ME query
import { REMOVE_BOOK } from '../utils/mutations'; // Import the REMOVE_BOOK mutation
import Auth from '../utils/auth'; // Import the Auth module
import { removeBookId } from '../utils/localStorage'; // Import the removeBookId function

const SavedBooks = () => { // Define the SavedBooks functional component
  const { loading, data } = useQuery(GET_ME); // Use the useQuery hook to make the GET_ME query
  const [removeBook] = useMutation(REMOVE_BOOK); // Use the useMutation hook to make the REMOVE_BOOK mutation
  const userData = data?.me || {}; // If there is user data, set userData to the user data; otherwise, userData is an empty object

  const handleDeleteBook = async (bookId) => { // Define the handleDeleteBook function
    try { // Try to remove the book
      const token = Auth.loggedIn() ? Auth.getToken() : null; // Get the token from Auth if the user is logged in; otherwise, set token to null

      if (!token) { // If there is no token, return false
        return false; // If there is no token, return false
      }

      await removeBook({ // Call the removeBook mutation with the bookId as the variables
        variables: { bookId } // Pass the bookId as the variables
      });

      
      removeBookId(bookId); // Call the removeBookId function with the bookId as the argument
    } catch (err) { // If there is an error, log the error
      console.error(err); // If there is an error, log the error
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      {/*eslint-disable-next-line react/no-unknown-property */}
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks?.map((book) => {
            return (
              <Col key={book.bookId} md="4">
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
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
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

export default SavedBooks;
