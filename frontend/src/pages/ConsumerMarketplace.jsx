import { useState, useEffect } from "react";
import { MapPin, Calendar, Package } from "lucide-react";
import PurchaseModal from "../components/PurchaseModal";
import ConsumerSidebar from "./ConsumerSidebar";

// Sample farmer posts data
const farmerPosts = [
  {
    id: 1,
    productName: "Organic Tomatoes",
    quantity: "500 kg",
    price: "৳80/kg",
    location: "Dhaka",
    dateRange: "Oct 10 - Oct 20, 2025",
    category: "Vegetables",
    farmer: "Abdul Karim",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
  },
  {
    id: 2,
    productName: "Fresh Rice (BR-28)",
    quantity: "1000 kg",
    price: "৳55/kg",
    location: "Narayanganj",
    dateRange: "Oct 8 - Oct 25, 2025",
    category: "Grains",
    farmer: "Rahim Mia",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
  },
  {
    id: 3,
    productName: "Sweet Mangoes",
    quantity: "200 kg",
    price: "৳120/kg",
    location: "Chittagong",
    dateRange: "Oct 12 - Oct 18, 2025",
    category: "Fruits",
    farmer: "Jamal Hossain",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400",
  },
  {
    id: 4,
    productName: "Fresh Potatoes",
    quantity: "800 kg",
    price: "৳35/kg",
    location: "Dhaka",
    dateRange: "Oct 5 - Oct 30, 2025",
    category: "Vegetables",
    farmer: "Sumon Ali",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
  },
  {
    id: 5,
    productName: "Green Chili",
    quantity: "100 kg",
    price: "৳90/kg",
    location: "Sylhet",
    dateRange: "Oct 7 - Oct 15, 2025",
    category: "Vegetables",
    farmer: "Kamal Sheikh",
    image: "https://images.unsplash.com/photo-1583852421968-4e89a2f3a3ab?w=400",
  },
  {
    id: 6,
    productName: "Yellow Corn",
    quantity: "600 kg",
    price: "৳40/kg",
    location: "Narayanganj",
    dateRange: "Oct 10 - Oct 22, 2025",
    category: "Grains",
    farmer: "Motin Uddin",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400",
  },
  {
    id: 7,
    productName: "Fresh Spinach",
    quantity: "150 kg",
    price: "৳45/kg",
    location: "Dhaka",
    dateRange: "Oct 6 - Oct 12, 2025",
    category: "Vegetables",
    farmer: "Rafiq Ahmed",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
  },
  {
    id: 8,
    productName: "Red Onions",
    quantity: "400 kg",
    price: "৳65/kg",
    location: "Chittagong",
    dateRange: "Oct 8 - Oct 28, 2025",
    category: "Vegetables",
    farmer: "Alamgir Kabir",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400",
  },
];

// Product Card Component
function ProductCard({ post }) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const handlePurchaseSubmit = (purchaseData) => {
    // TODO: Implement the API call to submit purchase request
    console.log("Purchase submitted:", purchaseData);
    setShowPurchaseModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.productName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {post.category}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {post.productName}
          </h3>
          <p className="text-sm text-gray-600 mb-3">by {post.farmer}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-700">
              <Package size={16} className="mr-2 text-green-600" />
              <span className="text-sm">
                Quantity: <strong>{post.quantity}</strong>
              </span>
            </div>

            <div className="flex items-center text-gray-700">
              <MapPin size={16} className="mr-2 text-green-600" />
              <span className="text-sm">{post.location}</span>
            </div>

            <div className="flex items-center text-gray-700">
              <Calendar size={16} className="mr-2 text-green-600" />
              <span className="text-sm">{post.dateRange}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-2xl font-bold text-green-600">
              {post.price}
            </span>
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Order
            </button>
          </div>
        </div>
      </div>

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        product={post}
        onSubmit={handlePurchaseSubmit}
      />
    </>
  );
}

// Main Marketplace Component
export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("Marketplace");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // TODO: Replace with actual API call to fetch farmer listings
    // For now, using the farmerPosts data
    setPosts(farmerPosts);
  }, []);

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    const categoryMatch =
      selectedCategory === "All" || post.category === selectedCategory;
    const locationMatch =
      selectedLocation === "All" || post.location === selectedLocation;

    let priceMatch = true;
    if (priceRange !== "All") {
      const price = parseInt(post.price.replace(/[^0-9]/g, ""));
      if (priceRange === "Under ৳50") priceMatch = price < 50;
      else if (priceRange === "৳50 - ৳80")
        priceMatch = price >= 50 && price <= 80;
      else if (priceRange === "Above ৳80") priceMatch = price > 80;
    }

    return categoryMatch && locationMatch && priceMatch;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <ConsumerSidebar activeTab={activeTab} />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Farmer Marketplace
            </h2>
            <p className="text-gray-600">
              Browse fresh produce directly from local farmers
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option>All</option>
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Grains</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option>All</option>
                  <option>Under ৳50</option>
                  <option>৳50 - ৳80</option>
                  <option>Above ৳80</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option>All</option>
                  <option>Dhaka</option>
                  <option>Narayanganj</option>
                  <option>Chittagong</option>
                  <option>Sylhet</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing <strong>{filteredPosts.length}</strong> results
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <ProductCard key={post.id} post={post} />
            ))}
          </div>

          {/* No Results Message */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                No products match your filters
              </p>
              <p className="text-gray-500 mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
