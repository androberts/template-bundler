fs = require("fs"),
$ = require("cheerio");
q = require("q");

var walk = function(dir, regex, done) {
	/*
		walks through the subdirectories of the provided directory path
		to find files that match the supplied regex.

		array of matching file paths is sent to the "done" callback.
	*/
  	var results = [];
  	fs.readdir(dir, function(err, list) {
    	if (err) return done(err);

		var pending = list.length;
		
		if (!pending) return done(null, results);
		
		list.forEach(function(file) {
  			file = dir + '/' + file;
  			fs.stat(file, function(err, stat) {
    			if (stat && stat.isDirectory()) {
      				walk(file, regex, function(err, res) {
        				results = results.concat(res);
        				if (!--pending) done(null, results);
      				});
    			} else {
					// check for regex
      				if (file.search(regex) > -1) results.push(file);
      				if (!--pending) done(null, results);
    			}
  			});
		});
	});
};

var parseTemplatesInFiles = function(files, outputFilePath, moduleName) {
	/*
		gets the underscore template from each file in the provided
		"files" array.

		writes these templates to a TypeScript file.

		this TypeScript file contains a single JS object (bs.Templates)
		in which the key corresponds to the id of the <script> tag and
		the value is a string representation of the template. 
	*/

	if (!files) {
		return;
	}

	var outStringPrefix = "module "+moduleName+" {\n\texport var Templates = {";
	var outStringSuffix = "\n\t};\n}";
	var outString = outStringPrefix;

	files.sort();

	for (var i = 0; i < files.length; i++) {
		var file = files[i];

		var fileContent = fs.readFileSync(file, "utf8");

		var $el = $("<div></div>");
		$el.append(fileContent);
		var $templates = $el.find("script[id][type='text/template']");
		
		$templates.each(function(k) {
			var templateAsProperty = '\n\t\t';

				templateAsProperty = templateAsProperty + '"'+$(this).attr("id")+'": "';
			 	templateAsProperty = templateAsProperty + $(this).html().trim().replace(/(\r\n|\n|\r|\t)/gm,"").replace(/"/gm, '\\"');
			 	templateAsProperty = templateAsProperty + '"';

				templateAsProperty = templateAsProperty + ",";

			outString = outString + templateAsProperty;
		});

	}
	outString = outString + outStringSuffix;
	fs.chmod(outputFilePath, 0777, function (err) {
	    if (err) { throw err; }
	});
	return fs.writeFileSync(outputFilePath, outString);
};

var bundleTemplates = function(inputFilePath, outputFilePath, moduleName) {
	var deferred = q.defer();

	walk(inputFilePath, /.+\.html$/i, function(err, files) {
		if (err) deferred.reject(err);
		parseTemplatesInFiles(files, outputFilePath, moduleName);
		deferred.resolve();
	});

	return deferred.promise;
};

module.exports.bundleTemplates = bundleTemplates;