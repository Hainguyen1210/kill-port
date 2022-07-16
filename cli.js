#!/usr/bin/env node
"use strict";

const kill = require("./");
const args = require("get-them-args")(process.argv.slice(2));

const verbose = args.verbose || false;
let ports = [];
if (args.range) {
	const [start, end] = args.range.split(",");
	for (let i = Number.parseInt(start); i <= Number.parseInt(end); i++) {
		ports.push(i);
	}
} else if (args.port) {
	ports = args.port.toString().split(",");
} else {
	ports = args.unknown.toString();

	if (ports.includes(",")) {
		ports = ports.split(",");
	} else {
		ports = [ports];
	}
}
if (ports.length === 0 || ports.includes("") || areNotNumbers(ports)) {
	console.log(
		`Please specify ports to kill.\nExample usage: kill-port 8001,8002 or kill-port --range 8001,8009`
	);
	process.exit(1);
} else {
	console.log(`Killing processes with ports: ${ports}`);
}

const method = args.method || "tcp";

Promise.all(
	ports.map((current) => {
		return kill(current, method)
			.then((result) => {
				console.log(`Process on port ${current} killed`);
				verbose && console.log(result);
			})
			.catch((error) => {
				console.log(
					`Could not kill process on port ${current}. ${error.message}.`
				);
				verbose && console.log(error);
			});
	})
);

function areNotNumbers(ports) {
	return ports.every((port) => {
		return isNaN(port);
	});
}
