import { Routes, Route, Link } from "react-router-dom";
import Landing from "./pages/Landing";
import SimpleLanding from "./pages/SimpleLanding";
import TestPage from "./pages/TestPage";
import ConsumerDashboardSimple from "./pages/ConsumerDashboardSimple";
import ConsumerRequests from "./pages/ConsumerRequests";
import ConsumerMarketplace from "./pages/ConsumerMarketplace";
import ConsumerProfile from "./pages/ConsumerProfile";
import ConsumerNotification from "./pages/ConsumerNotification";
import AboutDeveloper from "./pages/AboutDeveloper";
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks";
import Announcements from "./pages/Announcements";
import FarmerDashboard from "./pages/FarmerDashboard";
import ProductDetails from "./pages/ProductDetails";
import RequestDetails from "./pages/RequestDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FarmerProfile from "./pages/FarmerProfile";
import FarmerMarketPlace from "./pages/FarmerMarketplace";
import FarmerListing from "./pages/FarmerListing";
import FarmerNotification from "./pages/FarmerNotification";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/simple" element={<SimpleLanding />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/request/:id" element={<RequestDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about-developer" element={<AboutDeveloper />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* Consumer Routes */}
        <Route path="/consumer/*">
          <Route index element={<ConsumerDashboardSimple />} />
          <Route path="requests" element={<ConsumerRequests />} />
          <Route path="marketplace" element={<ConsumerMarketplace />} />
          <Route path="profile" element={<ConsumerProfile />} />
          <Route path="notifications" element={<ConsumerNotification />} />
          <Route path="announcements" element={<Announcements />} />
        </Route>

        {/* Farmer Routes */}
        <Route path="/farmer/*">
          <Route index element={<FarmerDashboard />} />
          <Route path="profile" element={<FarmerProfile />} />
          <Route path="marketplace" element={<FarmerMarketPlace />} />
          <Route path="listings" element={<FarmerListing />} />
          <Route path="notifications" element={<FarmerNotification />} />
          <Route path="announcements" element={<Announcements />} />
        </Route>

        {/* Legacy marketplace route - redirect to consumer marketplace */}
        <Route path="/marketplace" element={<ConsumerMarketplace />} />
      </Routes>
    </div>
  );
}
