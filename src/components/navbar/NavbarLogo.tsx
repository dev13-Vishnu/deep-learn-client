import { useNavigate } from "react-router-dom";

export default function NavbarLogo () {
    const navigate = useNavigate();

    return (
        <button
            onClick={()=>navigate('/')}
            className = "text-lg font-semibold"
        >
            Deep Learn  
        </button>
    )
}