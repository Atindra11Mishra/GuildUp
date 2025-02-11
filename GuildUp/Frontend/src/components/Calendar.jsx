import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Calendar = () => {
  const { expertId } = useParams(); // Dynamically fetch expertId from the URL
  const [selectedDate, setSelectedDate] = useState(null); // Captures selected date
  const [selectedTime, setSelectedTime] = useState(null); // Captures selected time
  const [times, setTimes] = useState([]);
  const navigate = useNavigate();

  // Generate dates for the next 7 days (including today)
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i); // Add `i` days to today
      dates.push({
        label: date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }),
        value: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      });
    }
    return dates;
  };

  const [dates, setDates] = useState(generateDates);

  // Simulated time slots for the selected date (replace with backend data if needed)
  useEffect(() => {
    if (selectedDate) {
      setTimes(["10:00", "10:30", "11:00", "11:30", "12:00", "12:30"]); // Example times
    }
  }, [selectedDate]);

  // Handle Booking: Send the selected date and time to the backend
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both a date and a time.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/calendar/event/${expertId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate, // Send selected date
          time: selectedTime, // Send selected time
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Booking and Google Calendar event created successfully!");
        navigate(`/payments/${expertId}`); // Redirect to the payments page
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error booking event:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">When should we meet?</h3>

      {/* Date Carousel */}
      <div className="relative mb-6">
        <div id="dateCarousel" className="flex gap-4 overflow-x-auto scrollbar-hide px-2">
          {dates.map((date) => (
            <button
              key={date.value}
              className={`px-6 py-2 rounded-lg whitespace-nowrap ${
                selectedDate === date.value ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setSelectedDate(date.value)}
            >
              {date.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <>
          <h4 className="text-lg font-semibold mb-3">Select time of day</h4>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {times.map((time) => (
              <button
                key={time}
                className={`px-3 py-2 rounded-lg ${
                  selectedTime === time ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </>
      )}

      <button
        className="w-full py-3 bg-black text-white rounded-lg"
        disabled={!selectedDate || !selectedTime}
        onClick={handleBooking}
      >
        Confirm Details
      </button>
    </div>
  );
};

export default Calendar;
