import TestimonialCard from './TestimonialCard';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    name: 'Rahul Verma',
    role: 'Frontend Developer',
    quote:
      'DeepLearn helped me transition into frontend development with confidence. The courses are practical and easy to follow.',
  },
  {
    id: '2',
    name: 'Anita Sharma',
    role: 'Backend Engineer',
    quote:
      'The instructors explain concepts clearly and deeply. I finally understand Node.js internals.',
  },
  {
    id: '3',
    name: 'Karthik R',
    role: 'Student',
    quote:
      'The structured learning paths kept me consistent. Highly recommended for beginners.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-xl font-semibold">
            What our students say
          </h2>
          <p className="mt-2 text-sm text-[color:var(--color-muted)]">
            Real experiences from learners on DeepLearn
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {DEFAULT_TESTIMONIALS.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
