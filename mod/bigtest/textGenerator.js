const texts = [
	"Test",
	"Big test",
	"This is great!",
	"TEST",
	"I love isnipe!",
	"I love ilexite!",
	"All hail ilexite!",
];

function getText() {
	return texts[Math.floor(Math.random() * texts.length)];
}

module.exports = { getText };
