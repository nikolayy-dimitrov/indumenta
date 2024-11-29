import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";

import { Navbar } from "./components/Navbar.tsx";
import { Login } from "./pages/LoginPage.tsx";
import { Register } from "./pages/RegisterPage.tsx";
import { StylistPage } from "./pages/StylistPage.tsx";
import { WardrobePage } from "./pages/WardrobePage.tsx";
import DragoneyeAPIRequest from "./components/ImagePrediction.tsx";

function App() {

  return (
      <div className="app">
          <AuthProvider>
              <Navbar />
              <>
                <Routes>
                    <Route path="/" element={<DragoneyeAPIRequest />} />
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
