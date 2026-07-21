import "@testing-library/jest-dom";

// Suppress expected console warnings and errors during tests to keep logs clean
jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(console, "warn").mockImplementation(() => {});

// Ensure window.localStorage is cleanly defined for JSDOM without wiping the window object
if (typeof window !== "undefined" && !window.localStorage) {
  const store: Record<string, string> = {};
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value.toString(); },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => {
        for (const key in store) {
          delete store[key];
        }
      }
    },
    writable: true,
    configurable: true
  });
}
