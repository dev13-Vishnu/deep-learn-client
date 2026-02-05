import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: {
    email?: string;
  } | null;
  onLogout: () => Promise<void>;
}

export default function NavbarProfileMenu({ user, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const initials = user?.email
    ?user.email.charAt(0).toUpperCase()
    : '?';

    async function handleLogout() {
      setOpen(false);
      await onLogout();
    }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-border)] text-sm font-medium"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow">
          <button
            onClick={() => navigate('/profile')}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
