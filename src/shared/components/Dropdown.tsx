"use client";

import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";

export type DropdownOption = {
  value: string;
  label: string;
};

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      options,
      value: controlledValue,
      onChange,
      placeholder = "Select",
      disabled = false,
      className,
    },
    ref,
  ) => {
    const id = useId();
    const listId = `dropdown-list-${id}`;
    const buttonId = `dropdown-btn-${id}`;
    const rootRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState<number | null>(null);
    const [uncontrolledValue, setUncontrolledValue] = useState<
      string | undefined
    >(undefined);

    const selectedValue = controlledValue ?? uncontrolledValue;

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (!rootRef.current) return;
        if (e.target instanceof Node && !rootRef.current.contains(e.target)) {
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
        // when opened, reset highlight to selected or first
        const idx = options.findIndex((o) => o.value === selectedValue);
        setHighlighted(idx >= 0 ? idx : 0);
        // focus first option for screen-readers
        setTimeout(() => listRef.current?.focus(), 0);
      }
    }, [open, selectedValue, options]);

    function handleToggle() {
      if (disabled) return;
      setOpen((v) => !v);
    }

    function handleSelect(option: DropdownOption) {
      if (disabled) return;
      if (onChange) onChange(option.value);
      else setUncontrolledValue(option.value);
      setOpen(false);
      // return focus to button
      const btn = rootRef.current?.querySelector<HTMLButtonElement>("button");
      btn?.focus();
    }

    function onKeyDown(e: React.KeyboardEvent) {
      if (disabled) return;
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlighted((h) => {
            const next = (h === null ? -1 : h) + 1;
            return next >= options.length ? 0 : next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlighted((h) => {
            const prev = (h === null ? options.length : h) - 1;
            return prev < 0 ? options.length - 1 : prev;
          });
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (highlighted !== null) handleSelect(options[highlighted]);
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          setHighlighted(null);
          (
            rootRef.current?.querySelector("button") as HTMLButtonElement | null
          )?.focus();
          break;
        case "Home":
          e.preventDefault();
          setHighlighted(0);
          break;
        case "End":
          e.preventDefault();
          setHighlighted(options.length - 1);
          break;
      }
    }

    const selectedLabel =
      options.find((o) => o.value === selectedValue)?.label ?? placeholder;

    return (
      <div ref={rootRef} className={className ?? "w-full relative"}>
        <button
          id={buttonId}
          ref={ref}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          disabled={disabled}
          onClick={handleToggle}
          onKeyDown={onKeyDown}
          className={`w-full text-left rounded-[12px] border border-[var(--color-gray-400)] py-[12px] pl-[24px] pr-[16px] relative flex items-center bg-[var(--color-white)] ${
            disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <span className="flex-1 text-[14px] sm:text-[16px] text-[var(--color-gray-800)] pr-[12px]">
            {selectedLabel}
          </span>

          <Image
            width={24}
            height={24}
            className={`transform transition-transform duration-150 ${open ? "rotate-180" : "rotate-0"}`}
            src="/icons/dropdown.svg"
            alt=""
            aria-hidden="true"
          />
        </button>

        {open && (
          <div
            id={listId}
            role="listbox"
            aria-labelledby={buttonId}
            tabIndex={-1}
            ref={listRef}
            onKeyDown={onKeyDown}
            className="absolute left-0 right-0 mt-[12px] rounded-[12px] border border-[var(--color-gray-400)] bg-[var(--color-white)] shadow-md p-[10px] z-50 max-h-64 overflow-auto"
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === selectedValue;
              const isHighlighted = highlighted === idx;
              const spacingClass = idx === options.length - 1 ? "" : "mb-[5px]";
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlighted(idx)}
                  className={`w-full block px-[20px] py-[8.5px] ${spacingClass} text-[14px] sm:text-[16px] rounded-[8px] ${
                    isSelected
                      ? "bg-[var(--color-orange-200)] text-[var(--color-orange-600)]"
                      : isHighlighted
                        ? "bg-[var(--color-gray-100)] text-[var(--color-gray-600)]"
                        : "text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-gray-600)]"
                  } ${isSelected ? "font-medium" : ""}`}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";
