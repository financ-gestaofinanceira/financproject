import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { Home } from "./Telas/Home/Home"; // Importa o componente Dashboard
import { Login } from "./Telas/Login/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { ContaProvider } from "./contexts/ContaContext";
import { ConviteProvider } from "./contexts/ConviteContext";
function App() {
  return (
    <AuthProvider>
      <ContaProvider>
        <ConviteProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </Router>
        </ConviteProvider>
      </ContaProvider>
    </AuthProvider>
  );
}

export default App;
