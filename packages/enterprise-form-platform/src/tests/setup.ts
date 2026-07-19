import "@testing-library/jest-dom";

// Suppress expected console warnings and errors during tests to keep logs clean
jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(console, "warn").mockImplementation(() => {});

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, "window", {
  value: { localStorage: localStorageMock },
  writable: true,
  configurable: true
});
