const nodeutil = require("node:util");

// https://en.wikipedia.org/wiki/ANSI_escape_code
let formats = Object.fromEntries(
	Object.entries({
		reset: 0,

		bold: 1,
		dim: 2,
		unbold: 22,

		italic: 3,
		unitalic: 23,

		underline: 4,
		ununderline: 24,

		strike: 9,
		unstrike: 29,

		invert: 7,
		hide: 8,
		reveal: 28,

		black: 30,
		red: 31,
		green: 32,
		yellow: 33,
		blue: 34,
		magenta: 35,
		cyan: 36,
		white: 37,

		brightBlack: 90,
		brightRed: 31,
		brightGreen: 32,
		brightYellow: 33,
		brightBlue: 34,
		brightMagenta: 35,
		brightCyan: 36,
		brightWhite: 37,

		blackBg: 30,
		redBg: 31,
		greenBg: 32,
		yellowBg: 33,
		blueBg: 34,
		magentaBg: 35,
		cyanBg: 36,
		whiteBg: 37,

		brightBlackBg: 90,
		brightRedBg: 31,
		brightGreenBg: 32,
		brightYellowBg: 33,
		brightBlueBg: 34,
		brightMagentaBg: 35,
		brightCyanBg: 36,
		brightWhiteBg: 37,
	}).map(([key, val]) => [key, `\x1b[${val}m`]),
);

formats.bell = "\x07";

function fmt(name) {
	return process.stdout.hasColors?.() ? formats[name] : "";
}

module.exports = {
	cfmt: nodeutil.format,
	fmt,
};
