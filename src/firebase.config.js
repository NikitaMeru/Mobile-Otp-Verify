
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider } from 'firebase/auth';
 

const firebaseConfig = {
  apiKey: "AIzaSyAs83voTc1MY0RFMwfbDyxEOX_2bRuIZzY",
  authDomain: "mobile-otp-84f63.firebaseapp.com",
  projectId: "mobile-otp-84f63",
  storageBucket: "mobile-otp-84f63.appspot.com",
  messagingSenderId: "805914861709",
  appId: "1:805914861709:web:fef1dff5d91b94220f02c4",
  measurementId: "G-0C7DLZQQZG"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export { RecaptchaVerifier, signInWithPhoneNumber ,PhoneAuthProvider };
