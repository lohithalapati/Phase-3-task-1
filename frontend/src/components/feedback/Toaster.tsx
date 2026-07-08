import { Toaster as Sonner } from "sonner";

export const Toaster = () => (
  <Sonner 
    theme="dark" 
    className="toaster group" 
    toastOptions={{
      classNames: {
        toast: "group toast group-[.toaster]:bg-surface-card group-[.toaster]:text-text group-[.toaster]:border-surface-border group-[.toaster]:shadow-lg backdrop-blur-xl",
        description: "group-[.toast]:text-text-muted"
      }
    }} 
  />
);