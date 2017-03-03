export const storeReducer = (x = [], y) => (y.type !== '@@redux/INIT' ? [...x, y] : x);
export const connectState = state => state;
export const connectActions = { foo: () => ({ type: 'bar' }) };
