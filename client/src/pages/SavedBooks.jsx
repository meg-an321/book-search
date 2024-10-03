/* eslint-disable react/jsx-key */
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client'; // import the useQuery and useMutation hooks from the Apollo Client
import { GET_ME } from '../utils/queries'; // import the query file to use the query
import { REMOVE_BOOK } from '../utils/mutations'; // import the mutation file to use the mutation
import Auth from '../utils/auth'; // import the Auth service to handle login
import { removeBookId } from '../utils/localStorage'; // import the localStorage file to handle the localStorage

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME); // use the useQuery hook to make the query request
  const [removeBook] = useMutation(REMOVE_BOOK); // use the useMutation hook to make the mutation request
  const userData = data?.me || {}; // set userData to data.me or an empty object if data.me is undefined

  const handleDeleteBook = async (bookId) => {
    try {
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        return false;
      }

      await removeBook({
        variables: { bookId }
      });

      removeBookId(bookId); // remove the bookId from localStorage
    } catch (err) { // catch any errors and log them to the console
      console.error(err); // log the error to the console
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
                    <a href={book.link} target="_blank" rel="noopener noreferrer">
                      View on Google Books
                    </a>
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