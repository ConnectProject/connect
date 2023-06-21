/* eslint-env browser */

// global object not defined in browsers only defined in node
// if (!globalThis.window) {
//   global.window = {};
// }

window.subscribers = window.subscribers || {};

const PubSub = {};

let lastId = 0;

PubSub.subscribe = (event, handler) => {
  if (!window.subscribers[event]) {
    window.subscribers[event] = [];
  }
  lastId += 1;
  window.subscribers[event].push({ id: lastId, handler });

  return lastId;
};

PubSub.publish = (event, args) => {
  const eventSubscribers = window.subscribers[event];

  if (!eventSubscribers) {
    return;
  }
  eventSubscribers.forEach((subscriber) => {
    if (subscriber && typeof subscriber.handler === 'function') {
      try {
        subscriber.handler({ event, args });
      } catch (e) {
        if (window && window.Rollbar) {
          window.Rollbar.error('Something went wrong', e);
        }
      }
    }
  });
};

PubSub.unsubscribe = (event, id) => {
  window.subscribers[event] = (window.subscribers[event] || []).filter(
    (subscriber) => subscriber.id !== id,
  );
};

export default PubSub;
