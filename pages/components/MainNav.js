import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import NavDropdown from "react-bootstrap/NavDropdown"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import { useAtom } from "jotai"
import { searchHistoryAtom } from "@/store"
import { addToHistory } from "@/lib/userData"
import { readToken, removeToken } from "@/lib/authenticate"

export default function MainNav() {
  const router = useRouter()
  let token = readToken()

  // Getting a reference to the searchHistory from searchHistoryAtom
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)

  const [keyword, setKeyword] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  async function submitForm(e) {
    e.preventDefault()
    setIsExpanded(false)
    // Add the computed queryString value to the searchHistory
    setSearchHistory(await addToHistory(`title=true&q=${keyword}`))
    router.push(`/artwork?title=true&q=${keyword}`)
  }

  function logout() {
    setIsExpanded(false)
    removeToken()
    router.push("/login")
  }

  return (
    <>
      <Navbar fixed="top" expand="md" className="fixed-top bg-dark navbar-dark" expanded={isExpanded}>
        <Container>
        <Navbar.Brand>
            <Link href="https://www.linkedin.com/in/jonasgumusyyz/" target="_blank" rel="noopener noreferrer" className="rainbow-link">
              <span className="rainbow-text">Yunus Gumus</span>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={toggleExpand}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link
                  onClick={() => setIsExpanded(false)}
                  active={router.pathname === "/"}
                >
                  Home
                </Nav.Link>
              </Link>

              {token && (
                <Link href="/search" passHref legacyBehavior>
                  <Nav.Link
                    active={router.pathname === "/search"}
                    onClick={() => setIsExpanded(false)}
                  >
                    Advanced Search
                  </Nav.Link>
                </Link>
              )}
            </Nav>
            {!token && (
              <Nav>
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link
                    active={router.pathname === "/register"}
                    onClick={() => setIsExpanded(false)}
                  >
                    Register
                  </Nav.Link>
                </Link>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link
                    active={router.pathname === "/login"}
                    onClick={() => setIsExpanded(false)}
                  >
                    Login
                  </Nav.Link>
                </Link>
              </Nav>
            )}
            &nbsp;
            {token && (
              <Form className="d-flex" onSubmit={submitForm}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="outline-success"
                  onClick={() => setIsExpanded(false)}
                >
                  Search
                </Button>
              </Form>
            )}
            &nbsp;
            <Nav>
              {token && (
                <NavDropdown title={token.userName} id="basic-nav-dropdown">
                  <Link href="/favourites" passHref legacyBehavior>
                    {/*legacyBehavior is a must add to avoid double <a> which occurs errors*/}
                    <NavDropdown.Item onClick={() => setIsExpanded(false)}>
                      Favourite
                    </NavDropdown.Item>
                  </Link>
                  <Link href="/history" passHref legacyBehavior>
                    <NavDropdown.Item onClick={() => setIsExpanded(false)}>
                      Search History
                    </NavDropdown.Item>
                  </Link>
                  <Link href="" passHref legacyBehavior>
                    <NavDropdown.Item onClick={() => logout()}>
                      Logout
                    </NavDropdown.Item>
                  </Link>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  )
}
