import shallowEqual from 'is-equal-shallow';
import { bindActionCreators } from 'redux';

export const observeStore = (store, currState, select, onChange) => {
  if (typeof onChange !== 'function') return null;
  let currentState = currState || {};

  function handleChange() {
    const nextState = select(store.getState());
    if (!shallowEqual(currentState, nextState)) {
      const previousState = currentState;
      currentState = nextState;
      onChange(currentState, previousState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
};

export const wrapActionCreators = (actionCreators) =>
  dispatch => bindActionCreators(actionCreators, dispatch);
