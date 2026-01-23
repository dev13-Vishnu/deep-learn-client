import { useState } from "react";

export default function NavbarSearch () {
    const [query, setQuery] = useState('');

    return (
        <input
            type="text"
            placeholder="Search courses"
            value = {query}
            onChange={(e) => setQuery(e.target.value)}
            className = "w-full rounded-md boarder-[color:var(--color0-boarder)] px-3 py-2 text-sm"
        />
    )
}