import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Payment = () => {
  const { expertId } = useParams(); // Extract expertId from URL params
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addons, setAddons] = useState({ sessionRecording: true });
  const [amount, setAmount] = useState(810);
  const [loading, setLoading] = useState(false);

  // Check if Razorpay script is loaded
  useEffect(() => {
    const checkRazorpay = () => {
      if (window.Razorpay) {
        setIsReady(true);
      } else {
        setTimeout(checkRazorpay, 100);
      }
    };
    checkRazorpay();
  }, []);

  // Calculate total amount based on add-ons
  useEffect(() => {
    const basePrice = 800;
    const recordingPrice = addons.sessionRecording ? 10 : 0;
    setAmount(basePrice + recordingPrice);
  }, [addons]);

  // Validation functions
  const validateName = (name) => {
    if (!name) return "Name is required.";
    if (name.length < 3) return "Name must be at least 3 characters.";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required.";
    if (!emailRegex.test(email)) return "Enter a valid email address.";
    return "";
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) return "Phone number is required.";
    if (!phoneRegex.test(phone)) return "Enter a valid 10-digit Indian phone number.";
    return "";
  };

  const handlePayment = async () => {
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const phoneValidation = validatePhone(phone);

    setNameError(nameValidation);
    setEmailError(emailValidation);
    setPhoneError(phoneValidation);

    if (nameValidation || emailValidation || phoneValidation) return;

    try {
      setLoading(true);

      // Step 1: Create an order from the backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order/${expertId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100, currency: "INR" }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const { order} = await response.json(); // Backend should return bookingId

      // Step 2: Initialize Razorpay payment
      const options = {
        key: "rzp_test_H5tZn1fRaWRv0i", // Razorpay test key
        amount: amount * 100,
        currency: "INR",
        name: "Career Guidance",
        description: "Video Call | 30 mins",
        order_id: order.id,
        handler: async function (response) {
          // Step 3: Verify payment on the backend
          const verifyResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userName: name,
              email,
              phone,
              amount: amount * 100,
              expertId, // Send expert ID to backend
            }),
          });

          const result = await verifyResponse.json();

          if (result.success) {
            alert("Payment successful!");
            navigate("/success", { state: { paymentId: response.razorpay_payment_id } });
          } else {
            alert("Payment verification failed.");
          }
        },
        theme: {
          color: "#3399cc",
        },
        prefill: {
          name,
          email,
          contact: phone,
        },
        modal: {
          escape: false, // Prevent user from closing the modal
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initialization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-purple-100 min-h-screen flex justify-center items-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center mb-6">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAHT003wIy46CwR_Rfroyv1DFanShJhSdGSg&s"
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-4">
            <h1 className="text-lg font-bold text-gray-800">Career Guidance</h1>
            <p className="text-sm text-gray-500">Video Call | 30 mins</p>
          </div>
        </div>

        {/* User Details */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input type="text" className="w-full p-2 border rounded-lg" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          {nameError && <p className="text-red-500 text-sm">{nameError}</p>}

          <label className="block text-sm text-gray-600 mt-4 mb-1">Email</label>
          <input type="email" className="w-full p-2 border rounded-lg" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

          <label className="block text-sm text-gray-600 mt-4 mb-1">Phone number</label>
          <input type="text" className="w-full p-2 border rounded-lg" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-lg font-bold">₹{amount}</p>
          <button onClick={handlePayment} disabled={!isReady || loading} className={`px-6 py-3 rounded-lg text-white ${isReady && !loading ? "bg-black hover:bg-gray-800" : "bg-gray-300 cursor-not-allowed"}`}>
            {loading ? "Processing..." : "Confirm and Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
