import expect from 'expect';
import { provide, connect } from '../src';
import { createStore } from 'redux';
import { storeReducer, connectState, connectActions } from './utils/redux';

describe('function syntax', () => {
  let testFnSpy;
  let updatedSpy;
  let calledTestFn;
  before(() => {
    updatedSpy = expect.createSpy();
    const testFn = (state, actions) =>
      ({ callFoo: actions.foo, updated: updatedSpy });
    testFnSpy = expect.createSpy().andCall(testFn);

    const store = createStore(storeReducer);
    provide(store);
    calledTestFn = connect(connectState, connectActions)(testFnSpy)();
  });

  it('should call function', () => {
    expect(testFnSpy).toHaveBeenCalled();
  });

  it('should pass current state to function', () => {
    const currentState = testFnSpy.calls[0].arguments[0];
    expect(currentState).toBeA('object');
    expect(currentState).toBeA('array');
  });

  it('should pass actions to function', () => {
    const actions = testFnSpy.calls[0].arguments[1];
    expect(actions).toBeA('object');
    expect(actions.foo).toBeA('function');
    expect(actions.foo.toString()).toInclude('dispatch');
  });

  it('should not call updated', () => {
    expect(updatedSpy).toNotHaveBeenCalled();
  });

  it('should be possible to call action arguments', () => {
    calledTestFn.callFoo();
  });

  describe('after action dispatch', () => {
    it('should call updated fn with new state', () => {
      expect(updatedSpy).toHaveBeenCalled();
      expect(updatedSpy.calls[0].arguments[0]).toEqual([{ type: 'bar' }]); // new state
      expect(updatedSpy.calls[0].arguments[1]).toEqual([]); // old state
    });

    it('should not call updated fn twice', () => {
      expect(updatedSpy.calls.length).toBe(1);
    });
  });

  describe('second action dispatch', () => {
    before(() => {
      calledTestFn.callFoo();
    });

    it('should call updated fn with new state', () => {
      expect(updatedSpy).toHaveBeenCalled();
      expect(updatedSpy.calls[1].arguments[0]).toEqual([{ type: 'bar' }, { type: 'bar' }]);
    });

    it('should not call updated fn twice', () => {
      expect(updatedSpy.calls.length).toBe(2);
    });

    it('should only call main function once', () => {
      expect(testFnSpy.calls.length).toBe(1);
    });
  });
});

describe('function without updated', () => {
  let testFnSpy;
  let calledTestFn;
  before(() => {
    const testFn = (state, actions) => ({ callFoo: actions.foo });
    testFnSpy = expect.createSpy().andCall(testFn);

    const store = createStore(storeReducer);
    provide(store);
    calledTestFn = connect(connectState, connectActions)(testFnSpy)();
  });

  it('should call function', () => {
    expect(testFnSpy).toHaveBeenCalled();
  });

  it('should pass current state to function', () => {
    const currentState = testFnSpy.calls[0].arguments[0];
    expect(currentState).toBeA('object');
    expect(currentState).toBeA('array');
  });

  it('should pass actions to function', () => {
    const actions = testFnSpy.calls[0].arguments[1];
    expect(actions).toBeA('object');
    expect(actions.foo).toBeA('function');
    expect(actions.foo.toString()).toInclude('dispatch');
  });

  it('should be possible to call action arguments', () => {
    calledTestFn.callFoo();
  });
});
