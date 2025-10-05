import { Routes, Route, Link } from "react-router-dom";
import Landing from "./pages/Landing";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import ProductDetails from "./pages/ProductDetails";
import RequestDetails from "./pages/RequestDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/consumer" element={<ConsumerDashboard />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/request/:id" element={<RequestDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}
