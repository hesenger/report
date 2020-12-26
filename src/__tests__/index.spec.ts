import Test from '../index';

test('should return run', () => {
    expect(new Test().run()).toBe('run');
});

test('should return toString', () => {
    expect(new Test().toString()).toBe('toString');
});

test('should return true if input is 5', () => {
    expect(new Test().isFive(5)).toBe(true);
});

test('should return false if input is not 5', () => {
    expect(new Test().isFive(5.1)).toBe(false);
});