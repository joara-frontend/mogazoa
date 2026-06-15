"use client";

import React, { useEffect, useId, useRef, useState } from "react";

export type SortOption = {
  value: string;
  label: string;
};

export interface SortProps {
  options: SortOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Sort = React.forwardRef<HTMLButtonElement, SortProps>(
  (
    {
      options,
      value: controlledValue,
      onChange,
      placeholder = "Sort by",
      disabled = false,
      className,
    },
    ref,
  ) => {
    const id = useId();
    const buttonId = `sort-button-${id}`;
    const listId = `sort-list-${id}`;
    const rootRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState<number | null>(null);
    const [uncontrolledValue, setUncontrolledValue] = useState<
      string | undefined
    >(undefined);

    const selectedValue = controlledValue ?? uncontrolledValue;

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (!rootRef.current) return;
        if (
          event.target instanceof Node &&
          !rootRef.current.contains(event.target)
        ) {
          setOpen(false);
          setHighlighted(null);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (open) {
        const selectedIndex = options.findIndex(
          (option) => option.value === selectedValue,
        );
        setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
        setTimeout(() => listRef.current?.focus(), 0);
      }
    }, [open, selectedValue, options]);

    const selectedLabel =
      options.find((option) => option.value === selectedValue)?.label ??
      placeholder;

    function handleToggle() {
      if (disabled) return;
      setOpen((value) => !value);
    }

    function handleSelect(option: SortOption) {
      if (disabled) return;
      if (onChange) {
        onChange(option.value);
      } else {
        setUncontrolledValue(option.value);
      }
      setOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    }

    function handleKeyDown(
      event: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>,
    ) {
      if (disabled) return;
      if (!open) {
        if (
          event.key === "Enter" ||
          event.key === " " ||
          event.key === "ArrowDown"
        ) {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlighted((current) => {
            const next = (current === null ? -1 : current) + 1;
            return next >= options.length ? 0 : next;
          });
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlighted((current) => {
            const prev = (current === null ? options.length : current) - 1;
            return prev < 0 ? options.length - 1 : prev;
          });
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (highlighted !== null) {
            handleSelect(options[highlighted]);
          }
          break;
        case "Escape":
          event.preventDefault();
          setOpen(false);
          setHighlighted(null);
          rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
          break;
        case "Home":
          event.preventDefault();
          setHighlighted(0);
          break;
        case "End":
          event.preventDefault();
          setHighlighted(options.length - 1);
          break;
      }
    }

    return (
      <div ref={rootRef} className={className ?? "w-full relative"}>
        <button
          id={buttonId}
          ref={ref}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-expanded={open}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={`w-full text-left rounded-[12px] border border-[var(--color-gray-300)] bg-[var(--color-white)] py-[16px] pl-[16px] pr-[12px] flex items-center justify-between gap-3 ${
            disabled
              ? "opacity-60 cursor-not-allowed"
              : open
                ? "border-[var(--color-gray-200)] text-[var(--color-gray-500)]"
                : "text-[#6e6e82] cursor-pointer"
          }`}
        >
          <span className="flex-1 text-[14px] sm:text-[16px]">
            {selectedLabel}
          </span>
          <img
            src="/icons/sort.svg"
            alt=""
            aria-hidden="true"
            className={`w-[20px] h-[20px] transition-transform duration-150 ${open ? "rotate-180 text-[var(--color-gray-500)]" : "text-[#6e6e82]"}`}
          />
        </button>

        {open && (
          <div
            id={listId}
            role="listbox"
            aria-labelledby={buttonId}
            tabIndex={-1}
            ref={listRef}
            onKeyDown={handleKeyDown}
            className="absolute left-0 right-0 mt-[8px] rounded-[12px] border border-[var(--color-gray-300)] bg-[var(--color-white)] p-[8px] shadow-md z-50"
          >
            {options.map((option, index) => {
              const isSelected = option.value === selectedValue;
              const isHighlighted = highlighted === index;
              const spacingClass =
                index === options.length - 1 ? "" : "mb-[5px]";
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlighted(index)}
                  className={`w-full text-left rounded-[12px] px-[12px] py-[12px] ${spacingClass} text-[14px] sm:text-[16px] ${
                    isSelected
                      ? "bg-[var(--color-gray-900)] text-[var(--color-white)]"
                      : isHighlighted
                        ? "bg-[var(--color-gray-600)] text-[var(--color-white)]"
                        : "text-[var(--color-gray-600)] hover:bg-[var(--color-gray-600)] hover:text-[var(--color-white)]"
                  }`}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

Sort.displayName = "Sort";
