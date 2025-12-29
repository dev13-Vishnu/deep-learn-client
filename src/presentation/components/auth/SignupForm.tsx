export default function SignupForm() {
  return (
    <div className="signup-form">
      <h2>Create Your Account</h2>
      <div className="row">
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
      </div>

      <input type="email" placeholder="Email ID" />
      <input type="tel" placeholder="Phone Number" />

      <div className="row">
        <input type="password" placeholder="Enter Password" />
        <input type="password" placeholder="Confirm Password" />
      </div>

      <button className="primary-btn">Create Account</button>

      <div className="divider">Sign up with</div>

      <div className="social-buttons">
        <button className="social facebook">Facebook</button>
        <button className="social google">Google</button>
        <button className="social microsoft">Microsoft</button>
      </div>
    </div>
  );
}
