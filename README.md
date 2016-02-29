js-redux [![Build Status](https://travis-ci.org/davej/js-redux.svg?branch=master)](https://travis-ci.org/davej/js-redux) [![npm version](https://badge.fury.io/js/js-redux.svg)](https://badge.fury.io/js/js-redux)
=============

> Redux bindings for vanilla (no-framework) javascript functions and classes

This is a really simple way to `connect` a function or class with redux and associated actions + store reducers.

For the moment it's really simple and the main logic is < 40 lines of code.
It should be easy-to-understand assuming you are already familiar with the [redux](http://redux.js.org/docs/api/createStore.html).
If you have ideas for use-cases that this lib doesn't currently support then just [open an issue](https://github.com/DaveJ/js-redux/issues).

Provide a redux store
---------------------

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

Option 1: Function syntax
-------------------------

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

Option 2: Class syntax
----------------------

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
