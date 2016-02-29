import expect from 'expect';
import { provide, connect } from '../src';

describe('sanity', () => {
  it('should have provide method', () => {
    expect(provide).toBeA('function');
  });
  it('should have connect method', () => {
    expect(connect).toBeA('function');
  });
});
