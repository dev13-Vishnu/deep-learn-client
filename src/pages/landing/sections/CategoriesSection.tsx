interface CategoryItem {
  id: string;
  title: string;
}

interface CategoriesSectionProps {
  categories?: CategoryItem[];
  onSelectCategory?: (categoryId: string) => void;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'design', title: 'Design' },
  { id: 'development', title: 'Development' },
  { id: 'marketing', title: 'Marketing' },
  { id: 'business', title: 'Business' },
  { id: 'photography', title: 'Photography' },
  { id: 'music', title: 'Music' },
  { id: 'finance', title: 'Finance' },
  { id: 'ai', title: 'AI & Data' },
];

export default function CategoriesSection({
  categories = DEFAULT_CATEGORIES,
  onSelectCategory,
}: CategoriesSectionProps) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Top Categories</h2>
          <button className="text-sm text-[color:var(--color-muted)]">
            View all
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory?.(category.id)}
              className="flex h-28 flex-col items-center justify-center rounded-md border border-[color:var(--color-border)] bg-white text-sm font-medium hover:shadow-sm transition"
            >
              <span>{category.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
