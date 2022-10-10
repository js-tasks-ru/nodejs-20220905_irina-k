const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.remainder = '';
    this.chunkList = [];
  }

  modifyRemainder(mergedData) {
    this.remainder = mergedData;
  }

  _transform(chunk, encoding, callback) {
    /** Приводим чанк к строке. */
    const stringChunk = chunk.toString();
    /** Находим последнюю позицию символа переноса. */
    const chunkIndex = stringChunk.lastIndexOf(os.EOL);
    /** Разбиваем чанк по символу переноса. */
    const splitData = stringChunk.split(os.EOL);
    splitData.forEach((p, index) => {
      /** Склеиваем первую часть нынешнего чанка и последнюю часть предыдущего. */
      const mergedData = (this.chunkList.length && !index) ? `${this.chunkList[this.chunkList.length - 1]}${p}` : p;
      /** Сохраняем в общее хранилище. */
      this.chunkList.push(p);
      /** Если в чанке нет символа переноса, сохраняем 'скленные' данные на всякий случай в хранилище для окончательного вывода. */
      if (chunkIndex === -1) {
        this.modifyRemainder(mergedData);
        return;
      }
      if (index !== splitData.length - 1) {
        this.push(mergedData);
      } else {
        this.modifyRemainder(mergedData);
      }
    });
    callback();
  }

  _flush(callback) {
    callback(null, this.remainder);
  }
}

module.exports = LineSplitStream;
