interface Props {
  message?: string | null;
}

export function FieldError({ message }: Props) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-[color:var(--color-danger)]" role="alert">
      {message}
    </p>
  );
}