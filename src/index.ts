/**
 * Extension ID of code-d. Use this in the `vscode.extensions.getExtension<CodedAPI>(codedExtensionId).exports;` call in your extension.
 * 
 * When using the API make sure you add `"extensionDependencies": ["webfreak.code-d"]` to your package.json to make sure this is available or use `.activate().then(api => {})` instead of `exports` in your extension.
 */
export const codedExtensionId = "webfreak.code-d";

/**
 * code-d API exported by the code-d plugin
 */
export interface CodedAPI {
	/**
	 * Adds snippets which are going to be suggested in D code 
	 * @param requiredDependencies The dependencies that must be present in order for this snippet to show up.
	 * @param snippet The snippet to suggest when the dependencies are present.
	 */
	registerDependencyBasedSnippet(requiredDependencies: string[], snippet: Snippet): void;

	/**
	 * Utility function calling registerDependencyBasedSnippet with the requiredDependencies multiple times for each snippet.
	 */
	registerDependencyBasedSnippets(requiredDependencies: string[], snippets: Snippet[]): void;
}

/**
 * Represents the code grammar scope where a snippet is active.
 */
export enum SnippetLevel {
	/** Outside of functions or types, possibly inside templates */
	global = 0,
	/** Inside interfaces, classes, structs or unions */
	type = 1,
	/** Inside method body */
	method = 2,
	/** inside a variable value, argument call, default value or similar */
	value = 3,
	/** Other scope types (for example outside of braces but after a function definition or some other invalid syntax place) */
	other = 4
}

/**
 * Defines a snippet which can be used in auto completion
 */
export interface Snippet {
	/** Grammar scopes in which to complete this snippet */
	levels: SnippetLevel[];
	/** Label for this snippet */
	title: string;
	/** Shortcut to type for this snippet */
	shortcut: string;
	/** Markdown documentation for this snippet */
	documentation: string;
	/** Text with interactive snippet locations to insert assuming global indentation. */
	snippet: string;
	/**
	 * Plain text to insert assuming global level indentation. Not neccessarily used in vscode and may be omitted.
	 * 
	 * Optional and automatically generated if snippet is a string using only simple variables in form of:
	 *   `$n` where n is any number or identifier according to the snippet syntax
	 *   `${...}` with no nesting
	 * */
	plain?: string;
}
