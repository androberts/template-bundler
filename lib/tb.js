bundler = require("./template-bundler.js");

var inputFilePath = process.argv[2],
	outputFilePath = process.argv[3],
	moduleName = process.argv[4];

bundler.bundleTemplates(inputFilePath, outputFilePath, moduleName).finally(function() {
	process.exit(0);
});