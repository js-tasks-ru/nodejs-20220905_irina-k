/**
 * Функция проверки, является ли аргумент числом.
 * @param arg {*} Аргумент, который проверяется на тип.
 * @returns {boolean}
 */
function isNumber(arg) {
	return typeof arg === 'number' && !isNaN(arg);
}

/**
 * Функция возврата суммы двух чисел.
 * @param a {number} Первый аргумент для суммы.
 * @param b {number} Второй аргумент для суммы.
 * @returns {number}
 */
function sum(a, b) {
  if (isNumber(a) && isNumber(b)) return a + b;
	else {
		throw new TypeError('Аргументы не являются числами');
	}
}

module.exports = sum;
