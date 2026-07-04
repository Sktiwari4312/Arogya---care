import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppShell from "./components/AppShell.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Vitals from "./pages/Vitals.jsx";
import Medications from "./pages/Medications.jsx";
import Water from "./pages/Water.jsx";
import Wellness from "./pages/Wellness.jsx";
import Plans from "./pages/Plans.jsx";
import Menstrual from "./pages/Menstrual.jsx";
import Emergency from "./pages/Emergency.jsx";
import Profile from "./pages/Profile.jsx";

const withShell = (Component) => (
  <ProtectedRoute>
    <AppShell>
      <Component />
    </AppShell>
  </ProtectedRoute>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={withShell(Dashboard)} />
      <Route path="/vitals" element={withShell(Vitals)} />
      <Route path="/medications" element={withShell(Medications)} />
      <Route path="/water" element={withShell(Water)} />
      <Route path="/wellness" element={withShell(Wellness)} />
      <Route path="/plans" element={withShell(Plans)} />
      <Route path="/menstrual" element={withShell(Menstrual)} />
      <Route path="/emergency" element={withShell(Emergency)} />
      <Route path="/profile" element={withShell(Profile)} />
    </Routes>
  );
}

export default App;
