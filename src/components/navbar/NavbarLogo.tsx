import { useNavigate } from "react-router-dom";
import logo from '/logo.png'
import { useAuth } from "../../auth/useAuth";
import { getAuthHomePath } from "../../auth/navigation/getAuthHomePath";

export default function NavbarLogo () {
    const navigate = useNavigate();
    const { isAuthenticated, currentRole } = useAuth();

    function handleLogoClick () {
        navigate(
            getAuthHomePath(isAuthenticated, currentRole)
        );
    }

    return (
        <button
            onClick={handleLogoClick}
            className = "text-lg font-semibold"
        >
            <img
        src={logo}
        alt="DeepLearn"
        className="h-8 w-auto"
      /> 
        </button>
    )
}