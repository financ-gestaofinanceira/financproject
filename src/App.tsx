import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./contexts/AuthContext";
import { ContaProvider } from "./contexts/ContaContext";
import { ConviteProvider } from "./contexts/ConviteContext";
import { MovimentacaoProvider } from "./contexts/MovimentacaoContext";
import { Login } from "./Telas/login/Login";
import { Home } from "./Telas/home/Home";
import ReloadPrompt from "./componentes/ReloadPrompt/ReloadPrompt";

function App() {
  return (
    <AuthProvider>
      <ContaProvider>
        <MovimentacaoProvider>
          <ConviteProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
              </Routes>
            </Router>
            <ReloadPrompt />
          </ConviteProvider>
        </MovimentacaoProvider>
      </ContaProvider>
    </AuthProvider>
  );
}

export default App;
