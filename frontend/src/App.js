// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NavBar      from './Components/navbar';
import Home        from './Pages/Home';
import Search      from './Pages/Search';
import BookDetails from './Pages/BookDetails';
import NewBook     from './Pages/NewBook';
import EditBook    from './Pages/EditBook';

//defining the App component  
export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/search"     element={<Search />} />
        <Route path="/book/:id"   element={<BookDetails />} />
        <Route path="/new"        element={<NewBook />} />
        <Route path="/edit/:id"   element={<EditBook />} />
      </Routes>
    </BrowserRouter>
  );
}
