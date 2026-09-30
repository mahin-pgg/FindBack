import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 to-purple-700 text-white px-6 py-12">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Campus L&F
        </h1>
        <p className="text-white/80 text-lg">
          A smart solution designed to reconnect people with their lost belongings
          quickly, securely, and efficiently.
        </p>
      </div>

      {/* Mission Section */}
      <div className="mt-16 max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">🎯 Our Mission</h2>
          <p className="text-white/80 leading-relaxed">
            Our mission is to simplify the lost and found process on campus using
            smart technology. We aim to reduce frustration and help students and
            staff recover their belongings faster through intelligent matching and
            secure communication.
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Why Choose Us?</h3>
          <ul className="space-y-2 text-white/80">
            <li>✔ Fast and reliable item matching</li>
            <li>✔ Secure communication between users</li>
            <li>✔ Easy reporting system</li>
            <li>✔ Verified claims for safety</li>
          </ul>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-20 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        
        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">🔍 Smart Matching</h3>
          <p className="text-white/80">
            Advanced logic helps match lost and found items efficiently.
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">💬 Secure Chat</h3>
          <p className="text-white/80">
            Built-in messaging keeps communication safe and private.
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">✅ Verified Claims</h3>
          <p className="text-white/80">
            Ensures items are returned to the rightful owner.
          </p>
        </div>

      </div>

      {/* Team / Vision Section */}
      <div className="mt-20 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">🚀 Our Vision</h2>
        <p className="text-white/80 leading-relaxed">
          We envision a campus where losing something is no longer stressful.
          With the help of technology, we aim to build a connected community
          where helping each other becomes simple and efficient.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-20 text-center text-white/70">
        © 2026 Campus Lost & Found System
      </div>

    </div>
  );
};

export default About;