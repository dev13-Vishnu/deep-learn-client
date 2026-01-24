import { useNavigate } from "react-router-dom";
import logo from '/logo.png'

export default function NavbarLogo () {
    const navigate = useNavigate();

    return (
        <button
            onClick={()=>navigate('/')}
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