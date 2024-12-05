import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { WardrobeProvider } from "./context/WardrobeContext.tsx";

import { Navbar } from "./components/Navbar.tsx";

import { Home } from "./pages/HomePage.tsx";
import { Login } from "./pages/LoginPage.tsx";
import { Register } from "./pages/RegisterPage.tsx";
import { StylistPage } from "./pages/StylistPage.tsx";
import { WardrobePage } from "./pages/WardrobePage.tsx";

import WardrobeScene from "./components/InteractiveWardrobe.tsx";

function App() {

  return (
      <div className="app">
          <WardrobeProvider>
              <AuthProvider>
                  <Navbar />
                  <>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/stylist" element={<StylistPage />} />
                        <Route path="/wardrobe" element={<WardrobePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/test" element={<WardrobeScene />} />
                    </Routes>
                  </>
              </AuthProvider>
          </WardrobeProvider>
      </div>
  )
}

export default App
