import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { Home } from "./Telas/Home"; // Importa o componente Dashboard
import { Login } from "./Telas/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
