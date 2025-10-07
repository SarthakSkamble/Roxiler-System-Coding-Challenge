import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Prelogin() {
  const [role, setRole] = useState(""); // Track selected role for highlighting
  const navigate = useNavigate();

  const handleClick = (selectedRole) => {
    setRole(selectedRole);
    const urlName = selectedRole.replace(" ", "_");
    navigate(`/login?name=${urlName}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-80 text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Who are you?</h1>

        <div className="flex flex-col space-y-4">
          {["System Administrator", "Normal User", "Store Owner"].map((r) => (
            <button
              key={r}
              onClick={() => handleClick(r)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                role === r
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
