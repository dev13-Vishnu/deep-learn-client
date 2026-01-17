import SignupForm from '../components/SignupForm';

export default function Signup() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left image (hidden < md) */}
      <div className="hidden md:block md:w-1/2">
        <img src="/signup.jpg" alt="" className="h-full w-full object-cover" />
      </div>

      {/* Right form */}
      <div className="flex w-full md:w-1/2 items-center justify-center">
        <SignupForm />
      </div>
    </div>
  );
}
