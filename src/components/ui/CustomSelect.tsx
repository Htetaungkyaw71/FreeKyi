import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface CustomSelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
  buttonClassName?: string;
}

export function CustomSelect({
  value,
  options,
  onChange,
  ariaLabel,
  className = "",
  buttonClassName = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-full border border-cinema-border bg-cinema-card px-4 text-left text-sm text-cinema-text outline-none transition-colors hover:border-cinema-accent/60 focus:border-cinema-accent ${buttonClassName}`}
      >
        <span className="min-w-0 truncate">
          {selectedOption?.label ?? options[0]?.label ?? "Select"}
        </span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-cinema-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[200] overflow-hidden rounded-xl border border-cinema-border bg-cinema-card shadow-2xl shadow-black/45">
          <div
            role="listbox"
            aria-label={ariaLabel}
            className="max-h-72 overflow-y-auto scrollbar-hide"
          >
            {options.map((option, index) => {
              const selected = option.value === value;
              const isFirst = index === 0;
              const isLast = index === options.length - 1;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                    isFirst ? "rounded-t-xl" : ""
                  } ${isLast ? "rounded-b-xl" : ""} ${
                    selected
                      ? "bg-cinema-accent text-white"
                      : "text-cinema-text hover:bg-cinema-hover hover:text-white"
                  }`}
                >
                  <Check
                    className={`h-4 w-4 flex-shrink-0 ${
                      selected ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span className="min-w-0 truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
