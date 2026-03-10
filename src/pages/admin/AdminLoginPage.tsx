import AdminLoginForm from './components/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Form panel */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <AdminLoginForm />
      </div>

      {/* Decorative panel (hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-[color:var(--color-primary)]">
        <div className="text-center text-white px-10">
          <h1 className="text-3xl font-bold">DeepLearn</h1>
          <p className="mt-3 text-sm text-white/70">Administration Console</p>
        </div>
      </div>
    </div>
  );
}