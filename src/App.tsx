import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Tickets from "./pages/tickets/Tickets";
import CreateTicket from "./pages/tickets/CreateTicket";
import Modules from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./components/NotFound";
import UpdateTicket from "./pages/tickets/UpdateTicket";
import PrivateRoute from "./components/PrivateRoutes";
import Areas from "./pages/areas/Areas";
import UpdateArea from "./pages/areas/UpdateArea";
import CreateArea from "./pages/areas/CreateArea";
import Classroom from "./pages/areas/Classroom";
import ClassroomEquipment from "./pages/areas/ClassroomEquipment";
import Subnets from "./pages/subnets/Subnets";
import UpdateSubnets from "./pages/subnets/UpdateSubnets";
import CreateSubnets from "./pages/subnets/CreateSubnets";
import Users from "./pages/users/Users";
import UpdateUsers from "./pages/users/UpdateUser";
import CreateUsers from "./pages/users/CreateUser";
import Loans from "./pages/loans/Loans";
import CreateLoan from "./pages/loans/CreateLoan";
import UpdateLoan from "./pages/loans/UpdateLoan";
import Equipment from "./pages/equipment/Equipment";
import CreateEquipment from "./pages/equipment/CreateEquipment";
import UpdateEquipment from "./pages/equipment/UpdateEquipment";
import GlobalNotification from './components/ui/GlobalNotification.tsx';
import { WebSocketProvider } from './context/NotificationContext';

const App = () => {
  return (
    <Router>
      <WebSocketProvider>
        <AppRoutes />
      </WebSocketProvider>
    </Router>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const showNotifications = location.pathname !== "/";

  return (
    <>
      {showNotifications && <GlobalNotification />}
      <Routes>
        {/* Tickets (roles 1, 2, 3) */}
        <Route path="/auth/ticket" element={<PrivateRoute allowedRoles={[1, 2, 3]} element={<Tickets />} />} />
        <Route path="/auth/ticket/create" element={<PrivateRoute allowedRoles={[1, 2, 3]} element={<CreateTicket />} />} />
        <Route path="/auth/ticket/update/:id" element={<PrivateRoute allowedRoles={[1, 2, 3]} element={<UpdateTicket />} />} />

        {/* Areas (solo 2 - Administrador) */}
        <Route path="/auth/area" element={<PrivateRoute allowedRoles={[2]} element={<Areas />} />} />
        <Route path="/auth/area/create" element={<PrivateRoute allowedRoles={[2]} element={<CreateArea />} />} />
        <Route path="/auth/area/update/:id" element={<PrivateRoute allowedRoles={[2]} element={<UpdateArea />} />} />
        <Route path="/auth/classroom" element={<PrivateRoute allowedRoles={[2]} element={<Classroom />} />} />
        <Route path="/auth/classroom/equipment/:id" element={<PrivateRoute allowedRoles={[2]} element={<ClassroomEquipment />} />} />

        {/* Dashboard (todos) */}
        <Route path="/auth/dashboard" element={<PrivateRoute allowedRoles={[1, 2, 3]} element={<Modules />} />} />

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Loans (solo 2 - Administrador) */}
        <Route path="/auth/Loans" element={<PrivateRoute allowedRoles={[2]} element={<Loans />} />} />
        <Route path="/auth/Loans/create" element={<PrivateRoute allowedRoles={[2]} element={<CreateLoan />} />} />
        <Route path="/auth/loans/update/:id" element={<PrivateRoute allowedRoles={[2]} element={<UpdateLoan />} />} />

        {/* Equipos (solo 2 - Administrador) */}
        <Route path="/auth/equipment" element={<PrivateRoute allowedRoles={[2]} element={<Equipment />} />} />
        <Route path="/auth/equipment/create" element={<PrivateRoute allowedRoles={[2]} element={<CreateEquipment />} />} />
        <Route path="/auth/equipment/update/:id" element={<PrivateRoute allowedRoles={[2]} element={<UpdateEquipment />} />} />

        {/* Users (solo 3 - Superusuario) */}
        <Route path="/auth/users" element={<PrivateRoute allowedRoles={[3]} element={<Users />} />} />
        <Route path="/auth/users/create" element={<PrivateRoute allowedRoles={[3]} element={<CreateUsers />} />} />
        <Route path="/auth/users/update/:id" element={<PrivateRoute allowedRoles={[3]} element={<UpdateUsers />} />} />

        {/* Subnets (roles 1, 2) */}
        <Route path="/auth/subnets" element={<PrivateRoute allowedRoles={[1, 2]} element={<Subnets />} />} />
        <Route path="/auth/subnets/create" element={<PrivateRoute allowedRoles={[1, 2]} element={<CreateSubnets />} />} />
        <Route path="/auth/subnets/update/:id" element={<PrivateRoute allowedRoles={[1, 2]} element={<UpdateSubnets />} />} />
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;