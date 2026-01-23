import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import NavbarLogo from "./NavbarLogo";
import NavbarSearch from "./NavbarSearch";
import NavbarActions from "./NavbarActions";

export interface NavbarProps {
    showSearch?: boolean;
    showCategories?: boolean;
}

export default function Navbar ({
    showSearch = true,
    showCategories = true,
}:NavbarProps) {
    const navigate = useNavigate();
    const {user, isAuthenticated, logout} = useAuth();

    async function  handleLogout() {
        await logout();
        navigate('/login', {replace: true});
    }
    return (
        <header className="boarder-b border-[color:var(--color-border)] bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/*left section*/}
                <div className="flex items-center gap-6">
                    <NavbarLogo/>
                    {showCategories && (
                        <nav className="hidden md:felx gap-4 text-sm text-[color: var(--color-muted)]">
                            <button>Categories</button>
                            <button>Course</button>
                        </nav>
                    )}
                </div>

                {/* Center section */}
                {showSearch && (
                    <div className="hidden md: block w-[320px]">
                        <NavbarSearch/>
                    </div>
                )}
                {/* Right section */}
                <NavbarActions
                    isAuthenticated = {isAuthenticated}
                    user= {user}
                    onLogout = {handleLogout}
                />
            </div>
        </header>
    )
}