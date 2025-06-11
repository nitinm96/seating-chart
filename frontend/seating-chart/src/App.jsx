import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from './components/AdminPage'
import HomePage from './components/HomePage'

function App() {

  return (
    <>
     <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
