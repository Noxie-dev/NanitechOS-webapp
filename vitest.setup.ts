import "@testing-library/jest-dom/vitest";

// jsdom polyfills
class IntersectionObserverMock {
  constructor(public callback: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error jsdom global polyfill
global.IntersectionObserver = IntersectionObserverMock;
