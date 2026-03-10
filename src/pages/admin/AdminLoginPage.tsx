import AdminLoginForm from './components/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold text-center">
          Admin Login
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Sign in with your admin credentials
        </p>

        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
