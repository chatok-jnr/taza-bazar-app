import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShoppingBag, User, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Create an Account',
      description: 'Sign up as a farmer or consumer to get started with TazaBazar.',
      icon: User,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'List or Browse Products',
      description: 'Farmers can list their produce while consumers can browse available items.',
      icon: ShoppingBag,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Make Deals',
      description: 'Negotiate prices and quantities directly with your trading partner.',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Complete Transactions',
      description: 'Finalize deals and arrange for delivery or pickup.',
      icon: CheckCircle2,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">How TazaBazar Works</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your guide to buying and selling fresh produce directly between farmers and consumers
            </p>
          </motion.div>
        </div>
      </header>

      {/* Steps Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="p-6 rounded-xl border-2 border-gray-200 hover:border-green-500 transition relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                  </div>
                )}
                <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center mb-4`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
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