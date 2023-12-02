import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Nav, NavDropdown, Dropdown, Form, Button, FormControl, Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAtom } from "jotai"
import { searchHistoryAtom } from "@/store"
import { addToHistory, getHistory } from '@/lib/userData';
import { readToken, removeToken } from '@/lib/authenticate';


export default function MainNav() {
  const router = useRouter();
  let token = readToken();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
  const [isDropdownHovered, setDropdownHovered] = useState(false);

  function logout() {
    setIsExpanded(false)
    removeToken();
    router.push("/login")
  }

  const closeDropdown = () => {
    setDropdownHovered(false);
  };

  const submitForm = async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const searchField = formData.get('searchField');
    const queryString = `title=true&q=${searchField}`;
  
    try {
      
      await addToHistory(queryString);
      setSearchHistory(await getHistory()); 
      router.push(`/artwork?${queryString}`);
      setIsExpanded(false);
    } catch (error) {
      // Handle error if addToHistory fails
      console.error('Error adding to history:', error);
    }
  };
  
  
  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const closeNavbar = () => {
    setIsExpanded(false);
  };

  return (
    <>
      <Navbar fixed="top" expand="md" className="fixed-top bg-dark navbar-dark" expanded={isExpanded}>
        <Container fluid>
          <Navbar.Brand>
            <Link href="https://www.linkedin.com/in/jonasgumusyyz/" target="_blank" rel="noopener noreferrer" className="rainbow-link">
              <span className="rainbow-text">Yunus Gumus</span>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" onClick={toggleNavbar} />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll onClick={closeNavbar}>
            <Link href="/" legacyBehavior passHref >
              <Nav.Link active={router.pathname === "/"}>Home</Nav.Link>
            </Link>
            {!token && <Link href="/login" passHref legacyBehavior><Nav.Link>Login</Nav.Link></Link>}
            {!token && <Link href="/register" passHref legacyBehavior><Nav.Link>Register</Nav.Link></Link>}
            {token && <Nav.Link onClick={logout}>Logout</Nav.Link>}
            {token &&
           <Link href="/search" legacyBehavior passHref > 
           <Nav.Link active={router.pathname === "/search"}>Advanced Search</Nav.Link>
           </Link>
            }
            </Nav>
            {token &&
            <Form className="d-flex" onSubmit={submitForm}>
              <FormControl
                type="text"
                placeholder="Search"
                name="searchField"
              />
              &nbsp;
              <Button variant="success" type="submit">Search</Button>
            </Form>}
            &nbsp;
            {token &&
            <Dropdown
            onMouseEnter={() => setDropdownHovered(true)}
            onMouseLeave={() => setDropdownHovered(false)}
          >
            <Dropdown.Toggle variant="success" id="dropdown-basic">{token.userName}</Dropdown.Toggle>

            <Dropdown.Menu show={isDropdownHovered}>
              <Link href="/favourites" passHref legacyBehavior>
                <Dropdown.Item
                  active={router.pathname === "/favourites"}
                  onClick={closeDropdown}
                >
                  Favourite
                </Dropdown.Item>
              </Link>
              <Link href="/history" passHref legacyBehavior>
                <Dropdown.Item
                  active={router.pathname === "/history"}
                  onClick={closeDropdown}
                >
                  Search History
                </Dropdown.Item>
              </Link>
            </Dropdown.Menu>
          </Dropdown>
  }

        </Navbar.Collapse>
        </Container>
      </Navbar>
      <br /><br />
    </>
  );
}
