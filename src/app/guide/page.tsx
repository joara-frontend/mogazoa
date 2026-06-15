"use client";

import { Button } from "@/shared/components/Button";
import { Dropdown } from "@/shared/components/Dropdown";
import { Sort } from "@/shared/components/Sort";
import { useState } from "react";

export default function Guide() {
  const options = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
    { value: "date", label: "Date" },
  ];

  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [sortValue, setSortValue] = useState<string | undefined>(undefined);

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Design Guide</h1>

      <section>
        <h2 className="font-semibold mb-2">Button</h2>
        <div className="flex flex-col gap-3 max-w-sm">
          <h3 className="font-semibold mb-2">Primary</h3>
          <Button variant="primary">Primary</Button>
          <Button variant="primary" disabled>
            Primary disabled
          </Button>
          <h3 className="font-semibold mb-2">Secondary</h3>
          <Button variant="secondary">Secondary</Button>
          <Button variant="secondary" disabled>
            Secondary disabled
          </Button>
          <h3 className="font-semibold mb-2">Tertiary</h3>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="tertiary" disabled>
            Tertiary disabled
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Dropdown</h2>
        <div className="flex flex-col gap-4 max-w-md">
          <div>
            <Dropdown
              options={options}
              value={selected}
              onChange={(v) => setSelected(v)}
              placeholder="Choose a fruit"
            />
            <div className="mt-2 text-sm text-gray-700">
              Selected: {selected ?? "(none)"}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Sort</h2>
        <div className="flex flex-col gap-4 max-w-md">
          <Sort
            options={options}
            value={sortValue}
            onChange={(value) => setSortValue(value)}
            placeholder="Sort by"
          />
          <div className="text-sm text-gray-700">
            Current sort: {sortValue ?? "(none)"}
          </div>
        </div>
      </section>
    </main>
  );
}
