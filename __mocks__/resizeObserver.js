// __mocks__/resizeObserver.js
class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }
  
    observe() {
      // Mock implementation
    }
  
    unobserve() {
      // Mock implementation
    }
  
    disconnect() {
      // Mock implementation
    }
  }
  
  global.ResizeObserver = ResizeObserver;
  