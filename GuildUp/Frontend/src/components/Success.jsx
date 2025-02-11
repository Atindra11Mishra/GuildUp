import { useLocation } from "react-router-dom";

const Success = () => {
  // Extract data passed from the payment page using React Router's `useLocation` hook
  const location = useLocation();
  const { paymentId} = location.state || {}; // Fallback in case state is empty

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
        <p className="text-lg text-gray-700 mb-6">Thank you for your payment!</p>

        <div className="text-left">
          <p className="text-sm text-gray-500 mb-1">Payment ID:</p>
          <p className="text-lg font-semibold text-gray-800">{paymentId || "N/A"}</p>
        </div>

        <button
          onClick={() => (window.location.href = "/")} // Redirect to homepage or another route
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Success;
