// jsdom は ResizeObserver を実装していないため Vuetify の VApp レイアウトが失敗する
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom は window.visualViewport を実装していないため Vuetify の VOverlay が失敗する
Object.defineProperty(window, "visualViewport", {
  value: {
    width: 1024,
    height: 768,
    offsetTop: 0,
    offsetLeft: 0,
    pageTop: 0,
    pageLeft: 0,
    scale: 1,
    addEventListener: () => {},
    removeEventListener: () => {},
  },
  writable: true,
});
