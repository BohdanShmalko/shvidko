const generator = require('../lib/generator');

describe('Test generator', () => {
  test('generation of random values', () => {
    const unlikelyValue =
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    let prev = '';
    for (let i = 0; i < 10; i++) {
      const newValue = generator();
      expect(newValue).not.toEqual(unlikelyValue);
      expect(newValue).not.toEqual(prev);
      prev = newValue;
    }
  });
});
