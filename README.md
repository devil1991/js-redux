js-redux [![Build Status](https://travis-ci.org/davej/js-redux.svg?branch=master)](https://travis-ci.org/davej/js-redux) [![npm version](https://badge.fury.io/js/js-redux.svg)](https://badge.fury.io/js/js-redux)
=============

> Redux bindings for vanilla (no-framework) javascript functions and classes

This is a nice way to `connect` a function or class with Redux and associated actions + store reducers.

For the moment, it's really simple and the main logic is < 40 lines of code.
It should be easy-to-understand assuming you are already familiar with [Redux](http://redux.js.org/docs/api/createStore.html).
If you have ideas for use-cases that this lib doesn't currently support then just [open an issue](https://github.com/DaveJ/js-redux/issues).

## Install

```sh
npm install --save js-redux
```

## Provide a redux store

When you `provide` a store then it is provided globally (rather than being an instance).
This is simple and supports my use-cases for the moment but feel free to send a PR if you'd like to add
support for multiple provided instances.

```js
import { createStore } from 'redux';
import { provide } from 'js-redux';
import rootReducer from './reducers';

const initialState = [];
const store = createStore(rootReducer, initialState);
provide(store);
```

## Option 1: Function syntax


```js
import { connect } from 'js-redux';
import * as todoActions from './actions'; // e.g. { addTodo, toggleTodo}

function _todos(state, actions) {
  // `state` is the initial selected state (state.todos) when the function is called
  // `actions` are dispatched like this: `actions.addTodo(...)`
  return {
    updated(newState, oldState) {
      // `updated` is called when selected state has been changed (shallowEquals)
    }
  };
}
export const todos = connect(state => state.todos, todoActions)(_todos)

// To execute your connected function just do:
todos();
```

## Option 2: Class syntax

```js
import { connect } from 'js-redux';
import * as todoActions from './actions';

@connect(state => state.todos, todoActions)
export class Todos {

  // `init` is called once when the class is initialized
  init() {
    // `this.state` is an up-to-date representation of the currently selected state
    // `this.actions` are dispatched like this: `this.actions.addTodo(...)`
  }

  // `updated` is called when selected state has been changed (shallowEquals)
  updated(oldState) {
    // `this.state` is the updated state. `oldState` is the previous state.
  }
}

// To init your connected class you can do either of (they both do the same thing):
Todos();
// or
new Todos();
```

## API

### `provide(store)`

Makes the Redux store available to the `connect()` calls below. You can’t use `connect()` without first providing a store for it to use. When you `provide` a store then it is 'provided' globally (rather than being an instance).

#### Arguments

* `store` (*[Redux Store](http://rackt.github.io/redux/docs/api/Store.html)*): The single Redux store in your application.

### `connect([mapStateToProps], [mapDispatchToProps])`

Connects a React component to a Redux store.
The `connect` API looks the same as `connect` in [`react-redux`](https://github.com/reactjs/react-redux) but it's not, it's far more basic.

It does not modify the class/function passed to it.  
Instead, it *returns* a new, connected component class, for you to use.

#### Arguments

* [`mapStateToProps(state, [ownProps]): stateProps`] \(*Function*): If specified, the component will subscribe to Redux store updates. Any time it updates, `updated` will be called. Its result must be a plain object. It will be injected as either the first argument (for functions) — or `this.state` property (for classes).

* [`mapDispatchToProps(dispatch, [ownProps]): dispatchProps`] \(*Object*): Each function inside it will be assumed to be a Redux action creator. It injects an object with the same function names, but bound to a Redux store. It will be injected as either the second argument (for functions) — or `this.action` property (for classes).
