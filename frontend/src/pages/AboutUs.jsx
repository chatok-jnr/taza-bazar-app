import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Building2, Users2, ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">TazaBazar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">About TazaBazar</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Building bridges between farmers and consumers for a sustainable agricultural future
            </p>
          </motion.div>
        </div>
      </header>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-xl border-2 border-gray-200 hover:border-green-500 transition"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To revolutionize agricultural commerce by creating a direct link between farmers and consumers,
                ensuring fair prices and fresh produce for all.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="p-6 rounded-xl border-2 border-gray-200 hover:border-green-500 transition"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Community</h3>
              <p className="text-gray-600">
                A thriving ecosystem of farmers and conscious consumers working together to support
                sustainable farming practices and local agriculture.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="p-6 rounded-xl border-2 border-gray-200 hover:border-green-500 transition"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ClipboardCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Values</h3>
              <p className="text-gray-600">
                Transparency, fairness, and sustainability guide every aspect of our platform,
                ensuring the best outcomes for both farmers and consumers.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-500" />
                <span className="ml-2 text-2xl font-bold">TazaBazar</span>
              </div>
              <p className="text-gray-400">Connecting farmers and consumers for fresh, quality produce.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/about-us" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="/how-it-works" className="text-gray-400 hover:text-white transition">How It Works</a></li>
                <li><a href="/about-developer" className="text-gray-400 hover:text-white transition">👨‍💻 About the Developer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TazaBazar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}