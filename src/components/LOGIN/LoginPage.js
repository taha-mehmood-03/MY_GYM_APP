import React from "react";
import Nav from "../NAVBAR/Nav";
import Login from "./_components/Login";

const LoginPage = () => {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),rgba(0,0,0,0))]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Navbar */}
      <Nav />

      {/* Content */}
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-3xl px-6 py-12 mx-4 sm:px-8 sm:py-16">
          {/* Decorative top line */}
          <div className="w-24 h-1 mb-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto" />

          {/* Login form container with glassmorphic styling */}
          <div className="relative">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg blur opacity-30 transition duration-1000 animate-gradient" />

            {/* Form background */}
            <div className="relative p-1 bg-black bg-opacity-90 rounded-lg">
              <div className="bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-xl rounded-lg">
                <Login />
              </div>
            </div>
          </div>

          {/* Decorative bottom line */}
          <div className="w-24 h-1 mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto" />
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="hidden sm:block">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className={`
              absolute w-1 h-1 bg-white rounded-full opacity-50
              animate-float-slow transform
              ${index % 2 === 0 ? 'bg-purple-400' : 'bg-indigo-400'}
            `}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${10 + index * 2}s`
            }}
          />
        ))}
      </div>
    </main>
  );
};

export default LoginPage;
