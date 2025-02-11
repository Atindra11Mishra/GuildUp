import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [expert, setExpert] = useState(null); // State to store the expert's data
  const [loading, setLoading] = useState(true); // State to manage loading state
  
  // Fetch the expert's data from the backend
  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/experts`); // Replace with your backend URL
        const data = await response.json();
        if (data.experts && data.experts.length > 0) {
          setExpert(data.experts[0]); // Assume the first match is the required expert
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expert data:", error);
        setLoading(false);
      }
    };

    fetchExpert();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-purple-100">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-purple-100">
        <p className="text-xl text-gray-700">Expert not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 flex justify-center items-center p-6">
      <div className="bg-white max-w-md w-full rounded-lg shadow-lg p-6">
        {/* User Info */}
        <div className="flex items-center mb-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAHT003wIy46CwR_Rfroyv1DFanShJhSdGSg&s"
            alt="User"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <h2 className="text-lg font-bold text-gray-800">{expert.name}</h2>
            <div className="flex items-center text-yellow-500 text-sm">
              <span className="mr-1">4.2/5</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-4 h-4"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Career guidance</h1>
        <p className="text-gray-600 mb-4">
          Confused about which career path to go for? Or looking for some personalized tips to accelerate or
          transition your career? Let’s figure out the right things to be done to pave a dream career path. <br />
          <br />
          - We will discuss your aspirations, interests, abilities, and align them with the perfect career option.
          <br />
          - We will design a strategy based on your short & long-term goals.
        </p>

        {/* Pricing and Duration */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg font-medium">
              ₹800+
            </span>
            <span className="text-gray-500">30 mins meeting</span>
          </div>
        </div>

        {/* Call-to-Action */}
        <Link
          to={`/schedule/${expert._id}`} // Dynamically pass expert ID to the schedule page
          className="w-full block text-center bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
        >
          Book a Session
        </Link>
      </div>
    </div>
  );
};

export default Home;
