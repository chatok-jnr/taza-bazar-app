import { Routes, Route, Link } from "react-router-dom";
import Landing from "./pages/Landing";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import ConsumerMarketplace from "./pages/ConsumerMarketplace";
import ConsumerProfile from "./pages/ConsumerProfile";
import ConsumerMessage from "./pages/ConsumerMessaage";
import ConsumerNotification from "./pages/ConsumerNotification";
import FarmerDashboard from "./pages/FarmerDashboard";
import ProductDetails from "./pages/ProductDetails";
import RequestDetails from "./pages/RequestDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FarmerProfile from "./pages/FarmerProfile";
import FarmerMarketPlace from "./pages/FarmerMarketplace";
import FarmerMessage from "./pages/FarmerMessage";
import FarmerNotification from "./pages/FarmerNotification";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/request/:id" element={<RequestDetails />} />

        {/* Consumer Routes */}
        <Route path="/consumer/*">
          <Route index element={<ConsumerDashboard />} />
          <Route path="marketplace" element={<ConsumerMarketplace />} />
          <Route path="profile" element={<ConsumerProfile />} />
          <Route path="messages" element={<ConsumerMessage />} />
          <Route path="notifications" element={<ConsumerNotification />} />
        </Route>

        {/* Farmer Routes */}
        <Route path="/farmer/*">
          <Route index element={<FarmerDashboard />} />
          <Route path="profile" element={<FarmerProfile />} />
          <Route path="marketplace" element={<FarmerMarketPlace />} />
          <Route path="messages" element={<FarmerMessage />} />
          <Route path="notifications" element={<FarmerNotification />} />
        </Route>
      </Routes>
    </div>
  );
}
