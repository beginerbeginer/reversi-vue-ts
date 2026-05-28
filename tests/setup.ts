// jsdom には ResizeObserver が実装されていない。
// Vuetify の VApp レイアウト初期化で参照されるため、テスト環境では最小実装で補う。
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as typeof ResizeObserver;

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
