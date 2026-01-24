import { useNavigate } from "react-router-dom";
import NavbarProfileMenu from "./NavbarProfileMenu";

interface Props {
    isAuthenticated: boolean;
    user: any | null;
    onLogout: () => Promise<void>;
}

export default function NavbarActions ({
    isAuthenticated,
    user,
    onLogout,
}:Props) {
    const navigate = useNavigate();

    if(!isAuthenticated) {
        return (
            <div className="flex items-center gap-3">
                <button
                    onClick={()=> navigate('login')}
                    className="rounded-md border px-4 py-2 text-sm"
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/signup')}
                    className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm text-white"
                >
                    Sign up
                </button>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-4">
            {/* Placeholder icons */}
            <button className="text-sm">🔔</button>
            <button className="tex-sm">🛒</button>

            <NavbarProfileMenu user={user} onLogout = {onLogout} />
        </div>
    )
}