Given a directory containing *.html files with `<script>`s of type `"text/template"`, this utility will produce a TypeScript file containing a hash of stringified templates.

Usage:

`tb [directoryToCrawl] [outputTypeScriptFile] [moduleName]`

e.g.:

Given 

**/MyDirectory/Foo.template.html**
```
  <script type="text/template" id="foo"><h1>Foo</h1></script>
```

Running `tb /MyDirectory output.ts foo.bar` will result in the following file:

**output.ts**
```
module foo.bar {
  export var Templates = {
    "foo" : "<h1>Foo</h1>"
  };
}
```

Notes:
* `<script>` tags must have a type of "text/template"
* In the resulting hash, the key will correspond to the ID of the `<script>` element.
* Directories are crawled recursively.
