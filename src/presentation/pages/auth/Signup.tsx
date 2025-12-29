import "../../styles/signup.css";

import SignupForm from "../../components/auth/SignupForm";

export default function Signup() {
  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src="/signup.jpg" alt="" className="signup-image" />
      </div>

      <div className="signup-right">
        <SignupForm />
      </div>
    </div>
  );
}
