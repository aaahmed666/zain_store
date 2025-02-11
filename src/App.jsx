import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import ProductManager from "./ProductManager";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/"
          element={<ProductManager />}
        />
      </Routes>
    </Router>
  );
}

export default App;
