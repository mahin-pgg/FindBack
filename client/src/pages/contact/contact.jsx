import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-6 py-12">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Contact Us
        </h1>
        <p className="text-white/80 text-lg">
          Have questions, found an issue, or need help? Reach out to us — we’re here for students and faculty.
        </p>
      </div>

      {/* Contact Section */}
      <div className="mt-16 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* Contact Form */}
        <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">📩 Send a Message</h2>

          <form className="space-y-4">
            
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg bg-white/80 text-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white/80 text-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Role</label>
              <select className="w-full px-4 py-2 rounded-lg bg-white/80 text-black focus:outline-none">
                <option>Student</option>
                <option>Faculty</option>
                <option>Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full px-4 py-2 rounded-lg bg-white/80 text-black focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              Send Message
            </button>

          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-6">
          
          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">📍 Campus Office</h3>
            <p className="text-white/80">
              Student Support Center, Main Campus <br />
              Open: Mon–Fri (9:00 AM – 5:00 PM)
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">📧 Email Support</h3>
            <p className="text-white/80">
              support@campuslf.com <br />
              response within 24 hours
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">📞 Phone</h3>
            <p className="text-white/80">
              +91 98765 43210 <br />
              For urgent lost item cases
            </p>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="mt-20 text-center text-white/70">
        © 2026 Campus Lost & Found System
      </div>

    </div>
  );
};

export default Contact;