// page navigation
import Navbar from "./NavBar"

import Dashboard from "./pages/Dashboard"

import { Route, Routes } from "react-router-dom"
import './index.css';


function App() {
  return (
    <>
      <Navbar />
        <Routes>

  
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </>
  )
}

export default App