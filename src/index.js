import { observeStore } from './helpers';
import isClass from 'is-class';
import { dispatch } from '@rematch/core'

let currentStore;

const defaultMapState = () => ({});
const defaultMapDispatch = {};

export function provide(store) { currentStore = store; }

export function connect(mapState = defaultMapState, mapDispatch = null) {
  if (typeof mapState !== 'function') {
    mapState = defaultMapState; // eslint-disable-line no-param-reassign
  }
  return component => {
    if (!currentStore) {
      throw new Error('You cannot use connect unless you `provide` a store');
    }
    // Rematch dont need binding of dispatch handlers
    const actions = dispatch[mapDispatch] ? dispatch[mapDispatch] : defaultMapDispatch;
    const currentState = mapState(currentStore.getState());

    let calledComponent;
    if (isClass(component)) {
      const Component = component;
      return class ConnectedClass extends component {
        constructor (...args) {
          super(...args)
          this.state = currentState
          this.actions = actions
          this.unsubscribe = observeStore(currentStore, currentState, mapState, (newState, oldState) => {
            this.state = newState;
            if (typeof this.updated === 'function') this.updated(oldState);
          })
          if (typeof this.init === 'function') this.init()
        }
      }
    } else {
      calledComponent = component(currentState, actions);
      if (calledComponent) {
        calledComponent.unsubscribe = observeStore(currentStore, currentState, mapState, calledComponent.updated);
      }
    }
    return calledComponent;
  };
}
