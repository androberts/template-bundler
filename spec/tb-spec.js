bundler = require("../lib/template-bundler.js");
fs = require("fs");
path = require("path");

describe("template bundler", function () {
	it("should generate the expected TypeScript file", function (done) {

		var isSuccessful = false;

		bundler.bundleTemplates("./", "./output.generated.ts", "test").then(function() {
			isSuccessful = true;

			var genFilePath = path.join(__dirname, "output.generated.ts"),
			 	generatedFile = fs.readFileSync(genFilePath, "utf8"),
				expectedFilePath = path.join(__dirname, "output.generated.ts"),
				expectedFile = fs.readFileSync(expectedFilePath, "utf8");

			expect(generatedFile).toContain("<h1>Foo</h1>");
			expect(generatedFile).toContain("<h2>Bar</h2>");
			expect(generatedFile).toContain("<h3>Baz</h3>");

			expect(generatedFile).toBe(expectedFile);

		}).finally(function() {
			expect(isSuccessful).toBe(true);
			done();
		});
	});
});