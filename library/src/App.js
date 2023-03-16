import logo from './logo.svg';
import './App.css';
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Navbar from './global-components/NavbarComp';
import Home from './containers/Home';
import BooksList from './containers/books/Index';
import NewBook from './containers/books/Add';
import EditBook from './containers/books/Edit';
import OccupiedList from './containers/book-manager/Index';

function App() {

  /***
   * ------------------------------------------ 
   *        All Routes to be Registered Here
   * --------------------------------------------
   * */ 
  const router=createBrowserRouter([
    {
      path:"/",
      element:<Home/>

    },
    {
      path:"/books",
      element:<BooksList/>
    },
    {
      path:"/books/new",
      element:<NewBook/>
    },
    {
      path:"/books/:id",
      element:<EditBook/>
    },
    {
      path:"/library-manager/",
      element:<OccupiedList/>
    }
  ])

  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
    </> 
  );
}

export default App;
