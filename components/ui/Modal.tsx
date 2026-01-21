"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid min-h-[100dvh] place-items-center overflow-y-auto bg-black/30 px-4 py-6 sm:px-6 sm:py-10"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.7)] backdrop-blur"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          className="absolute top-4 right-4 text-[var(--muted-subtle)] hover:text-[var(--muted)] cursor-pointer"
          onClick={onClose}
          aria-label="Fermer la fenêtre"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
