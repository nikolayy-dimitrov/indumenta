import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";

import { Navbar } from "./components/Navbar.tsx";

import { Home } from "./pages/HomePage.tsx";
import { Login } from "./pages/LoginPage.tsx";
import { Register } from "./pages/RegisterPage.tsx";
import { StylistPage } from "./pages/StylistPage.tsx";
import { WardrobePage } from "./pages/WardrobePage.tsx";

function App() {

  return (
      <div className="app">
          <AuthProvider>
              <Navbar />
              <>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/stylist" element={<StylistPage />} />
                    <Route path="/wardrobe" element={<WardrobePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
              </>
          </AuthProvider>
      </div>
  )
}

export default App
