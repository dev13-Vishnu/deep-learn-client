import { useNavigate } from "react-router-dom";

export default function HeroSection () {
    const navigate = useNavigate();
    
    return (
        <section className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10">
            <div>
                <h1 className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10">
                    Unlock Your Potential <br/> with Deep Learn
                </h1>

                <p className="mt-4 text-[color:var(--color-muted)]">
                    Learn without limits. Builds skills that move your career forward.
                </p>

                <button
                    onClick={() => navigate('/signup')}
                    className="mt-6 rounded-md bg-[color:var(--color-primary)] px-6 py-3 text-white"
                >
                    Select Your Plan
                </button>
            </div>
            <div>
                <img src="/hero.png" alt="Learning illustration" className="w-full" />
            </div>
        </section>
    )
}