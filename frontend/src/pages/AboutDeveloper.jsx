import React from 'react';
import { Linkedin, Github, FileText, Leaf } from 'lucide-react';

export default function AboutDeveloper() {
  const developers = [
    {
      name: "Md. Sakib Hosen",
      role: "Backend Developer",
      image: "https://i.ibb.co.com/2YPy9W3B/Pasted-image.png",
      bio: "Passionate backend developer specializing in Node.js. I love building scalable systems and optimizing API performance.",
      skills: ["JavaScript", "Node.js, Express.js", "MongoDB, Mongoose", "REST APIs", "C++"],
      links: {
        linkedin: "https://www.linkedin.com/in/chatok-junior/",
        github: "https://github.com/chatok-jnr",
        codeforces: "https://codeforces.com/profile/chatok.jr",
        //cv: "#"
      }
    },
    {
      name: "Atik Shariar Opu",
      role: "Frontend Developer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "Creative frontend developer with expertise in React, modern CSS, and creating beautiful user experiences. I transform designs into responsive, interactive web applications.",
      skills: ["React", "Tailwind CSS", "JavaScript", "Responsive Design", "UI/UX"],
      links: {
        linkedin: "https://www.linkedin.com/in/atikshahriaopu/",
        github: "https://github.com/atikshahriaopu",
        codeforces: "https://codeforces.com/profile/Shahriar.Opu",
        //cv: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center">
              <Leaf className="h-6 w-6 text-green-500" />
              <h1 className="ml-2 text-2xl font-bold text-green-600">TazaBazar</h1>
            </a>
            <nav className="flex gap-6">
              <a href="/" className="text-gray-600 hover:text-green-600 transition">Home</a>
              {/* <a href="/about-developer" className="text-green-600 font-medium">About</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition">Contact</a> */}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - White Background */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About The Developers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Meet the talented team behind this website. Together, we bring ideas to life through innovative design and robust technology.
            </p>
          </div>
        </div>
      </section>

      {/* Developers Section - Gray Background */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {developers.map((dev, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition duration-300 hover:border-green-500"
              >
                {/* Profile Image */}
                <div className="bg-gradient-to-br from-green-400 to-green-600 h-48 flex items-center justify-center">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </div>

                {/* Developer Info */}
                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{dev.name}</h3>
                    <p className="text-lg text-green-600 font-semibold">{dev.role}</p>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed text-center">{dev.bio}</p>

                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {dev.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm font-medium border border-green-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Connect With Me</h4>
                    <div className="grid grid-cols-4 gap-3">
                      <a
                        href={dev.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition duration-300 transform hover:scale-105"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-8 w-8 text-blue-600" />
                        <span className="text-xs text-gray-600 font-medium">LinkedIn</span>
                      </a>
                      <a
                        href={dev.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition duration-300 transform hover:scale-105"
                        title="GitHub"
                      >
                        <Github className="h-8 w-8 text-gray-800" />
                        <span className="text-xs text-gray-600 font-medium">GitHub</span>
                      </a>
                      <a
                        href={dev.links.codeforces}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition duration-300 transform hover:scale-105"
                        title="Codeforces"
                      >
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 17H8V7H4V17Z" fill="#F44336"/>
                          <path d="M10 17H14V3H10V17Z" fill="#2196F3"/>
                          <path d="M16 17H20V11H16V17Z" fill="#4CAF50"/>
                        </svg>
                        <span className="text-xs text-gray-600 font-medium">Codeforces</span>
                      </a>
                      <a
                        href={dev.links.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition duration-300 transform hover:scale-105"
                        title="Download CV"
                      >
                        <FileText className="h-8 w-8 text-gray-700" />
                        <span className="text-xs text-gray-600 font-medium">CV</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Section - White Background */}
      {/* <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center hover:shadow-xl transition duration-300">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Working Together</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
              Our collaboration combines backend excellence with frontend creativity to deliver exceptional web experiences. We believe in clean code, user-centric design, and continuous learning.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="px-8 py-4 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300">
                View Our Work
              </button>
              <button className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-lg text-lg font-semibold hover:bg-green-50 transition duration-300">
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-500" />
                <span className="ml-2 text-2xl font-bold">TazaBazar</span>
              </div>
              <p className="text-gray-400">Connecting farmers and consumers for fresh, quality produce.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">How It Works</a></li>
                <li><a href="/about-developer" className="text-gray-400 hover:text-white transition">👨‍💻 About the Developer</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Get Started</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Sign Up</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Become a Farmer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Start Shopping</a></li>
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