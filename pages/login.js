import { Card, Form, Button, Alert } from "react-bootstrap";
import { useState } from 'react';
import { useAtom } from 'jotai'; // Import from Jotai
import { useRouter } from 'next/router';
import { favouritesAtom, searchHistoryAtom } from '@/store'; 
import { authenticateUser } from '@/lib/authenticate';
import { getFavourites, getHistory } from '@/lib/userData';


export default function Login(props){
   const [user, setUser] = useState('');
   const [password, setPassword] = useState('');
   const [warning, setWarning] = useState('');
   const router = useRouter();
   const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
   const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

   async function updateAtoms(){
      setFavouritesList(await getFavourites()); 
      setSearchHistory(await getHistory()); 
   }


   
  async function handleSubmit(e) {
   e.preventDefault();
   try {
     // Authenticate the user
     await authenticateUser(user, password);

     // Update Jotai atoms with data from the API
     await updateAtoms();

     // Redirect to the "/favourites" route
     router.push('/favourites');
   } catch (err) {
     setWarning(err.message);
   }
 }


  return (
    <>
      <Card bg="light">
        <Card.Body><h2>Login</h2>Enter your login information below:</Card.Body>
      </Card>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>User:</Form.Label>
          <Form.Control type="text"
           value={user} 
           id="userName"
            name="userName"
             onChange={e => setUser(e.target.value)} 
             />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <br />
        <Button variant="primary" className="pull-right" type="submit">Login</Button>
      </Form>
      { warning && ( <><br /><Alert variant="danger">{warning}</Alert></> )}
    </>
  );
}
