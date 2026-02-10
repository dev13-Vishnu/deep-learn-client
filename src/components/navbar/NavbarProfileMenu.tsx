import { useEffect, useRef, useState } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null)

  const initials = user?.email
    ?user.email.charAt(0).toUpperCase()
    : '?';

    async function handleLogout() {
      setOpen(false);
      await onLogout();
    }
    function handleProfileClick() {
      setOpen(false);
      navigate('/profile');
    }

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if(menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      }

      if(open) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [open])

  return (
    <div className="relative"  ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-border)] text-sm font-medium"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow">
          <button
            onClick={handleProfileClick}
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
