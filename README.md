# code-d-api

Extend `code-d` in vscode with custom features.

This API provides:

- support for registering custom snippets depending on installed APIs

## Usage

Add code-d as dependency to your vscode extension inside the package.json:

```js
"extensionDependencies": ["webfreak.code-d"]
```

To use, simply get the extension using this code:
```ts
import * from "code-d-api";

export function activate(context: vscode.ExtensionContext) {
	const api: coded.CodedAPI | undefined;
	const codedExtension = vscode.extensions.getExtension<coded.CodedAPI>(coded.codedExtensionId);
	if (codedExtension) {
		api = codedExtension.exports;

		// do your API stuff
	}
}
```

If you only want to optionally depend on code-d, make sure you use the `.activate()` call instead of `.exports` and await it or use it with a `.then(() => {})` clause.
