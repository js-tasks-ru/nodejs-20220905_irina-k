const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

const chunksList = [];

class LimitSizeStream extends stream.Transform {
	constructor(options) {
		super(options);
		this.options = options;
	}

  /** Функция преобразования. */
	_transform(chunk, encoding, callback) {
    /** Опредедяем размер чанка.  */
		const chunkSize = Buffer.byteLength(chunk.toString());
    /** Определяем размер предыдущего чанка. */
    const previousChunkSize = chunksList.length ? chunksList.reduce((prev, current) => prev + current, 0) : 0;
    /** Определяем размер обновленного чанка. */
		const updatedChunkSize = previousChunkSize + chunkSize;
    /** Проверяем на соответствие лимиту. */
		if (updatedChunkSize > this.options.limit) {
			callback(new LimitExceededError(), chunk);
		} else {
			chunksList.push(chunkSize);
			callback(null, chunk);
		}
	}
}

module.exports = LimitSizeStream;
