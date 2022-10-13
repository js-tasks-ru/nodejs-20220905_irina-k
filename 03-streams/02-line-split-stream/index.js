const LineSplitStream = require('./LineSplitStream');
const os = require('os');

const lines = new LineSplitStream({
	encoding: 'utf-8',
});

function onData(line) {
	console.log(line);
}

lines.on('data', onData);

lines.write('нулевая строка');
lines.write(`первая строка${os.EOL}вторая строка${os.EOL}третья строка`);
lines.write(`четвертая строка`);

lines.end();