import ForgotPasswordForm from '../components/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left form */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <ForgotPasswordForm />
      </div>

      {/* Right image */}
      <div className="hidden md:block md:w-1/2">
        <img src="/signup.jpg" alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
