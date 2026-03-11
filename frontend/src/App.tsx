import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

// User Management
import UserRegister from "./pages/UserRegister";
import AllUsers from "./pages/AllUsers";
import EditUser from "./pages/EditUser";

// Client Management
import AddClient from "./pages/ClientManagement/AddClients";
import AllClients from "./pages/ClientManagement/AllClients";
import ClientView from "./pages/ClientManagement/ClientView";
import ClientEdit from "./pages/ClientManagement/ClientEdit";

// Renewal Reminder
import RenewalReminder from "./pages/RenewalReminder";

// Profit
import Profit from "./pages/Profit";

// Profile Pages
import EditProfile from "./pages/Profile/EditProfile";
import AccountSettings from "./pages/Profile/AccountSettings";
import Support from "./pages/Profile/Support";

// 🔐 Private Route
import PrivateRoute from "./components/PrivateRoute";
import { SidebarProvider } from "./context/SidebarContext";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <SidebarProvider>
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />

          {/* ===== PROTECTED ROUTES WITH SIDEBAR ===== */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              {/* Dashboard */}
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Home />} />
              
              {/* User Management */}
              <Route path="/user-register" element={<UserRegister />} />
              <Route path="/all-users" element={<AllUsers />} />
              <Route path="/edit-user/:id" element={<EditUser />} />
              
              {/* Client Management */}
              <Route path="/clients/add" element={<AddClient />} />
              <Route path="/clients" element={<AllClients />} />
              <Route path="/clients/view/:id" element={<ClientView />} />
              <Route path="/clients/edit/:id" element={<ClientEdit />} />
              
              {/* Other */}
              <Route path="/renewals" element={<RenewalReminder />} />
              <Route path="/profit" element={<Profit />} />

              {/* ✅ Profile Routes */}
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/support" element={<Support />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SidebarProvider>
    </Router>
  );
}

export default App;