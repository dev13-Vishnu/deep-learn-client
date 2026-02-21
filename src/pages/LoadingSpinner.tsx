export default function LoadingSpinner() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        {/* Text */}
        <p className="text-sm text-gray-500">
          Loading, please wait…
        </p>
      </div>
    </div>
  );
}
