// This is only here as an example of how to create a class and test it.
// It is safe to remove this file.

import Calculator from './calculator';

describe('Calculator', function() {
	const calc = new Calculator();

	describe('#add', function() {
		it('2+3', function() {
			calc.add(2, 3).should.equal(5);
		});
	});
	describe('#subtract', function() {
		it('5-3', function() {
			calc.subtract(5, 3).should.equal(2);
		});
	});
});
