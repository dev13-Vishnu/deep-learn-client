import { useAuth } from '../../../auth/useAuth';

export default function WelcomeSection() {
  const { user } = useAuth();

  return (
    <section>
      <h1 className="text-2xl font-semibold">
        Welcome back{user?.email ? `, ${user.email}` : ''}
      </h1>
      <p className="mt-1 text-sm text-[color:var(--color-muted)]">
        Let’s continue your learning journey
      </p>
    </section>
  );
}
