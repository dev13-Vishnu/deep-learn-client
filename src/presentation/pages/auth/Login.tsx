import LoginForm from '../../components/auth/LoginForm';

export default function Login() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left form */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <LoginForm />
      </div>

      {/* Right image (hidden < md) */}
      <div className="hidden md:block md:w-1/2">
        <img src="/login.jpg" alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
