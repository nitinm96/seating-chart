import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./components/AdminPage";
import HomePage from "./components/HomePage";
import { UserProvider } from "./context/UserContext";
import ProtectedRoutes from "./util/ProtectedRoutes";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
