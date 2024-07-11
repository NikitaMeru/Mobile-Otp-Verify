// src/components/PhoneVerification.js
import React, { useState } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider } from './firebase.config.js';
import { signInWithCredential } from 'firebase/auth';
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const App = () => {

  const[formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    passsword:'',
    confirmPassword:'',
    username: '',
  });

  const handleChange = (e) =>{
    const {name,value} = e.target;
    setFormData({
        ...formData,
        [name]:value
    });
  };

  const generateOTP = () =>{
    return Math.floor(100000+Math.random()*900000).toString();
  }

  const handleVerifyOtp = (e) =>{
    e.preventDefault();
    if(formData.otp == generateOTP){
      setIsVerified(true);
      toast.success("Phone Number Verified!");

    }else{
      toast.error("Invalid OTP.");
    }
  };

  const [formErrors , setFormErrors] = useState({ });
  const validateForm = () =>{
    const newErrors = {};

    const namePattern = /^[A-Z a-z]/;
    if(!formData.fullName || formData.fullName.length<5 || !namePattern.test(formData.fullName)){
      newErrors.fullName = 'Enter min. 5 chars. and only Alphabets';
    }
    
    const emailPatteren = !/^[a-zA-Z]{1,}[a-zA-Z0-9]{1,}[@][a-z]{1,6}[.][com]{1,5}/;
    if(!emailPatteren.test(formData.email)){
      newErrors.email = 'Invalid email format';
    }
    const mobileNoPattern = !/^[7-9]{1}[0-9]{9}/;
    if(!mobileNoPattern.test(formData.phoneNumber)){
      newErrors.phoneNumber = 'Mobile No. must be 10 digits';
    }
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])*([a-z])*([A-Z])/;
    if(formData.password.length < 6 || !passwordPattern.test(formData.password)){
      newErrors.password = 'Invalid password ';
    }
    const confirmPasswordPatteren = /^(?=.*[0-9])(?=.*[!@#$%^&*])*([a-z])*([A-Z])/;
    if(formData.confirmPasswordPatteren.length < 6 || !confirmPasswordPatteren.test(formData.confirmPasswordPatteren)){
      newErrors.password = 'Invalid confirm password ';
    }
    return newErrors;
  }

    const handleSignIn = (e) =>{
      e.preventDefault();

      const errors = validateForm();
      if(Object.keys(errors).length == 0){
        const userData = {
          fullName:formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          username: formData.username,
          passsword: formData.passsword,
          confirmPassword: formData.confirmPassword
        };

        localStorage.setItem('forData', JSON.stringify(userData));
        console.log("formData Saved" , userData);
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          username:'',
          passsword:'',
          confirmPassword:''
        });
        setIsVerified(false);
        toast.success("Form submitted successfully!");

      }else{
        toast.error("Please fill out the form correctly");
        setFormErrors(errors);
      }
    }
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const requestOtp = () => {
    const recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log("response",response);
       
      },
      'expired-callback': () => {
        
      }
   
    });
    const mobileNumber = `+91 ${ phoneNumber}`
    signInWithPhoneNumber(auth, mobileNumber,recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        console.log(phoneNumber);
        console.log("confirmationresult",confirmationResult);
      })
      .catch((error) => {
        console.error("Error during signInWithPhoneNumber:", error);
      });
  };

  const verifyOtp = () => {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    console.log(credential);
    signInWithCredential(auth,credential)
      .then((result) => {
        console.log("User signed in successfully:", result);
        //alert("sign in successful")
        toast.success('Phone Number verified!');
      })
      .catch((error) => {
        toast.error('Invalid OTP',error);
      });
  };

  return (
    <div className="container mt-5">
      <ToastContainer/>
        <div className='row'>
          <div className='col-md-6 form-container'>
            <div className='form-wrapper'>
            <h3 style={{color:'black', marginLeft:'150px',marginBottom:'20px'}}>Sign Up</h3>
              <form>
                <div className='mb-3' style={{width:'500px'}}>
                  <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  className='form-control'
                  placeholder='Full Name'
                  required/>
                  {formErrors.fullName && <span className='error'>{formErrors.fullName}</span>}
                </div>

                <div className='mb-3' style={{width:'500px'}}>
                  <input
                  type='text'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='form-control'
                  placeholder='EmailId'
                  required/>
                  {formErrors.email && <span className='error'>{formErrors.email}</span>}
                </div>

                <div className='mb-3' style={{width:'500px'}}>
                  <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  className='form-control'
                  placeholder='UserName'
                  required/>
                  {formErrors.username && <span className='error'>{formData.username}</span>}
                </div>
         
              <div className='form-group mt-2' style={{width:'500px'}}>
                  <input
                  type='password'
                  name='password'
                  value={formData.passsword}
                  onChange={handleChange}
                  placeholder='Password'
                  className='form-control'/>
                  {formData.error && <span className='error'>{FormData.passsword}</span>}
                </div>

                <div className='form-group mt-2' style={{width:'500px'}}>
                  <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='Confirm Password'
                  className='form-control'/>
                  {formData.error && <span className='error'>{FormData.confirmPassword}</span>}
                </div>

               </form>
            </div>
          </div>
        </div>
    
    <div className="form-group" style={{width:'500px',display:'flex'}}>
      <input
        type="text"
        name='phoneNumber'
        className="form-control"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone number"
      />
    
    <button className="btn btn-success mt-2 ml-4" onClick={requestOtp} style={{width:'200px',marginLeft:'15px'}}>
      Send OTP
    </button>
    </div>
    <div id="recaptcha-container" className="mt-3"></div>
    {verificationId && (
      <>
        <div className="form-group mt-3" style={{width:'500px' ,display:'flex'}}>
          <input
            type="text"
            className="form-control"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
          />
        <button className="btn btn-success mt-2" onClick={verifyOtp} 
          style={{width:'200px',marginLeft:'15px',height:'40px'}}>
          Verify OTP
        </button>
        </div>
      </>
    )}
     <button type='submit' className='btn btn-success'  onClick={handleSignIn} disabled={!isVerified} >
   Sign In
 </button>
  </div>
  
  
  );
};

export default App;
