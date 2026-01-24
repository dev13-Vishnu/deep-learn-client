interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
}

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

export default function TestimonialCard({
  testimonial,
}: TestimonialCardProps) {
  return (
    <div className="rounded-md border border-[color:var(--color-border)] bg-white p-5">
      <p className="text-sm leading-relaxed text-[color:var(--color-text)]">
        “{testimonial.quote}”
      </p>

      <div className="mt-4">
        <p className="text-sm font-semibold">{testimonial.name}</p>
        <p className="text-xs text-[color:var(--color-muted)]">
          {testimonial.role}
        </p>
      </div>
    </div>
  );
}
