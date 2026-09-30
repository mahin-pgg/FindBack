import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Tailwind + React is Working! 🎉
        </h1>
        <p className="text-gray-500 text-lg mb-6">
          Your setup is complete and ready to build.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer">
          Click Me
        </button>
      </div>
    </div>
  )
}

export default App
