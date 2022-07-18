function areNotNumbers(ports) {
	return ports.every((port) => {
		return isNaN(port);
	});
}

module.exports = {
	areNotNumbers,
};
