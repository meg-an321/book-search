import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { useMutation } from '@apollo/client'; // Import the useMutation hook from Apollo Client
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignupForm = () => {
  // set initial form state
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  // set state for form validation
  const [validated] = useState(false);
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // use mutation for signing up a user
  const [addUser, {error}] = useMutation(ADD_USER);

  useEffect(() => { // Use the useEffect hook to check for a response from the mutation
    if (error) {
      setShowAlert(true); // If there is an error, show the alert
    } else {
      setShowAlert(false); // If there is no error, hide the alert
    }
  }, [error]); // Add error to the dependency array

  const handleInputChange = (event) => { 
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // this is needed for form validation
    const form = event.currentTarget;
    if (form.checkValidity() === false) { // Check if the form is valid
      event.preventDefault(); // If the form is invalid, prevent default behavior
      event.stopPropagation(); // Stop the event propagation to the parent elements because the form is invalid
    }

    // try to sign up the user
    try { // Try to execute the addUser mutation
      const { data } = await addUser({ //this is needed for the mutation to work in order to add a user
        variables: { ...userFormData },
    });

      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }

    setUserFormData({ // Reset the form after submission
      username: '', // Reset the username
      email: '', // Reset the email
      password: '', // Reset the password
    });
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;