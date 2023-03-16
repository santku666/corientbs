import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavbarComp() {
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/">E-Library</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/books">Books</Nav.Link>
            <Nav.Link href="/library-manager">Library Manager</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarComp;