import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Edit from "./pages/Edit";
import ChangePassword from "./pages/Changepassword"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/changepassword" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
