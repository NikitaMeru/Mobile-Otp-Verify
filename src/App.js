// src/components/PhoneVerification.js
import React, { useState } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider } from './firebase.config.js';
import { signInWithCredential } from 'firebase/auth';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    username: '',
    otp: '' // Added otp to the state
  });

  const [formErrors, setFormErrors] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    const namePattern = /^[A-Za-z ]+$/;
    if (!formData.fullName || formData.fullName.length < 5 || !namePattern.test(formData.fullName)) {
      newErrors.fullName = 'Enter min. 5 chars. and only Alphabets';
    }

    const emailPattern = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const mobileNoPattern = /^[7-9][0-9]{9}$/;
    if (!mobileNoPattern.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Mobile No. must be 10 digits';
    }

    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (formData.password.length < 6 || !passwordPattern.test(formData.password)) {
      newErrors.password = 'Invalid password';
    }

    if (formData.confirmPassword.length < 6 || !passwordPattern.test(formData.confirmPassword) || formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(newErrors);
    return newErrors;
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      localStorage.setItem('formData', JSON.stringify(userData));
      console.log("FormData Saved", userData);
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
        confirmPassword: '',
        otp: ''
      });
      setIsVerified(false);
      toast.success("Form submitted successfully!");
    } else {
      toast.error("Please fill out the form correctly");
    }
  };

  const requestOtp = () => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log("response", response);
      },
      'expired-callback': () => {
        toast.error("Recaptcha expired. Please try again.");
      }
    });

    const mobileNumber = `+91${phoneNumber}`;
    signInWithPhoneNumber(auth, mobileNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        console.log("confirmationResult", confirmationResult);
      })
      .catch((error) => {
        console.error("Error during signInWithPhoneNumber:", error);
        toast.error("Failed to send OTP. Please try again.");
      });
  };

  const verifyOtp = () => {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    console.log(credential);
    signInWithCredential(auth, credential)
      .then((result) => {
        console.log("User signed in successfully:", result);
        setIsVerified(true);
        toast.success('Phone Number verified!');
      })
      .catch((error) => {
        console.error("Invalid OTP", error);
        toast.error('Invalid OTP');
      });
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className='row'>
        <div className='col-md-6 form-container'>
          <div className='form-wrapper'>
            <h3 style={{ color: 'black', marginLeft: '150px', marginBottom: '20px' }}>Sign Up</h3>
            <form onSubmit={handleSignIn}>
              <div className='mb-3' style={{ width: '500px' }}>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  className='form-control'
                  placeholder='Full Name'
                  required
                />
                {formErrors.fullName && <span className='error'>{formErrors.fullName}</span>}
              </div>

              <div className='mb-3' style={{ width: '500px' }}>
                <input
                  type='text'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='form-control'
                  placeholder='Email'
                  required
                />
                {formErrors.email && <span className='error'>{formErrors.email}</span>}
              </div>

              <div className='mb-3' style={{ width: '500px' }}>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  className='form-control'
                  placeholder='Username'
                  required
                />
                {formErrors.username && <span className='error'>{formErrors.username}</span>}
              </div>

              <div className='form-group mt-2' style={{ width: '500px' }}>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Password'
                  className='form-control'
                  required
                />
                {formErrors.password && <span className='error'>{formErrors.password}</span>}
              </div>

              <div className='form-group mt-2' style={{ width: '500px' }}>
                <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='Confirm Password'
                  className='form-control'
                  required
                />
                {formErrors.confirmPassword && <span className='error'>{formErrors.confirmPassword}</span>}
              </div>

              <div className='form-group mt-2' style={{ width: '500px', display: 'flex' }}>
                <input
                  type='text'
                  name='phoneNumber'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className='form-control'
                  placeholder='Phone Number'
                  required
                />
                <button type='button' className='btn btn-success mt-2 ml-4' onClick={requestOtp} style={{ width: '200px', marginLeft: '15px' }}>
                  Send OTP
                </button>
              </div>

              <div id="recaptcha-container" className="mt-3"></div>

              {verificationId && (
                <div className='form-group mt-3' style={{ width: '500px', display: 'flex' }}>
                  <input
                    type='text'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className='form-control'
                    placeholder='OTP'
                    required
                  />
                  <button type='button' className='btn btn-success mt-2' onClick={verifyOtp} style={{ width: '200px', marginLeft: '15px', height: '40px' }}>
                    Verify OTP
                  </button>
                </div>
              )}

              <button type='submit' className='btn btn-success mt-3' disabled={!isVerified}>
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
