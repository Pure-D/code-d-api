/**
 * Extension ID of code-d. Use this in the `vscode.extensions.getExtension<CodedAPI>(codedExtensionId).exports;` call in your extension.
 * 
 * When using the API make sure you add `"extensionDependencies": ["webfreak.code-d"]` to your package.json to make sure this is available or use `.activate().then(api => {})` instead of `exports` in your extension.
 */
export const codedExtensionId = "webfreak.code-d";

export type DScannerIniFeature = { description: string, name: string, enabled: "disabled" | "enabled" | "skip-unittest" };
export type DScannerIniSection = { description: string, name: string, features: DScannerIniFeature[] };

/**
 * Describes the minimum returned configuration when analyzing the active dub projects.
 */
export interface DubPackageConfig
{
	/**
	 * absolute file system path to the DUB package folder.
	 */
	packagePath: string;

	/**
	 * configured DUB package name
	 */
	packageName: string;

	/**
	 * Extra fields which are not documented and _may_ be removed or omitted in some cases, however are expected to keep working.
	 * 
	 * Might contain all fields returned by the served/getActiveDubConfig method.
	 * 
	 * These currently include:
	 * - "packagePath": string
	 * - "packageName": string
	 * - "targetPath": string
	 * - "targetName": string
	 * - "workingDirectory": string
	 * - "mainSourceFile": string
	 * - "dflags": string[]
	 * - "lflags": string[]
	 * - "libs": string[]
	 * - "linkerFiles": string[]
	 * - "sourceFiles": string[]
	 * - "copyFiles": string[]
	 * - "versions": string[]
	 * - "debugVersions": string[]
	 * - "importPaths": string[]
	 * - "stringImportPaths": string[]
	 * - "importFiles": string[]
	 * - "stringImportFiles": string[]
	 * - "preGenerateCommands": string[]
	 * - "postGenerateCommands": string[]
	 * - "preBuildCommands": string[]
	 * - "postBuildCommands": string[]
	 * - "preRunCommands": string[]
	 * - "postRunCommands": string[]
	 */
	[unstableExtras: string]: any;
}

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

	/**
	 * Triggers a refresh of DUB dependencies (dub update) & reloads import paths for completion.
	 */
	refreshDependencies(): boolean;

	/**
	 * Triggers dscanner linting for the given URI.
	 * @param uri The vscode URI of the file to lint either as string or `vscode.Uri`.
	 */
	triggerDscanner(uri: string | object): boolean;

	/**
	 * Returns the dscanner configuration for the given URI.
	 * @param uri The vscode URI of the file to check either as string or `vscode.Uri`.
	 */
	listDscannerConfig(uri: string | object): PromiseLike<DScannerIniSection[]>;

	/**
	 * Searches for a given filename (optionally also with subfolders) and returns all locations in the project and all dependencies including standard library where this file exists.
	 * @param query The filename, optionally with subfolders, to search for in all projects and dependencies.
	 * @returns list of native filesystem paths
	 */
	findFiles(query: string): PromiseLike<string[]>;

	/**
	 * Lists all files with a given module name in the project and all dependencies and standard library.
	 * @param query The modulename to search for in all projects and dependencies.
	 * @returns list of native filesystem paths
	 */
	findFilesByModule(query: string): PromiseLike<string[]>;

	/**
	 * Returns DUB settings for the currently active DUB package.
	 * 
	 * The "currently active DUB package" in the variables above means the DUB package associated with the last D file that was or is being edited. In case of projects with a single DUB configuration this will always be the project itself. In case of multiple opened folders or a folder with multiple dub.json/dub.sdl files, it will be the project associated with the last active D file loaded.
	 *
	 * If any D files for dependencies were opened before, they will not be considered as active DUB projects unless the dependency folders themselves are also opened within vscode.
	 * 
	 * @returns An object describing the DUB package of the currently active DUB package.
	 */
	getActiveDubConfig(): PromiseLike<DubPackageConfig>;
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
	other = 4,
	/** Inside a string literal. */
	strings = 5,
	/** Inside a normal comment */
	comment = 6,
	/** Inside a documentation comment */
	docComment = 7,
	/** Inside explicitly declared mixin templates */
	mixinTemplate = 8,
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
