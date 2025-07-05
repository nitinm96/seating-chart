import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./components/AdminPage";
import HomePage from "./components/HomePage";
import { UserProvider } from "./context/UserContext";
import ProtectedRoutes from "./util/ProtectedRoutes";
import { GuestDataProvider } from "./context/GuestDataContext";

function App() {
  return (
    <UserProvider>
      <GuestDataProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GuestDataProvider>
    </UserProvider>
  );
}

export default App;
