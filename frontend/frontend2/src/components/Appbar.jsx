import { useNavigate } from "react-router-dom";

export function Appbar() {
   const navigate = useNavigate();
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-white text-2xl font-bold"></h1>
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-4">
            <button onClick={()=>{navigate(`/prelogin`)}}className="bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition">
              Login
            </button>
            <button onClick={()=>{navigate(`/presignup`)}} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition">
              Signup
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
