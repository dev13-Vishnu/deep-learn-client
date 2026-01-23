import { useAuth } from "../../auth/useAuth";

export default function HomePage () {
    const {user} = useAuth();

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <h1 className="text-2xl font-semibold">
                Welcome back{user?.email ? `, ${user.email}` : ''}
            </h1>

            <p className="mt-2 text-[color:var(--color-muted)]">
                Continue where you left off
            </p>
        </div>
    )
}