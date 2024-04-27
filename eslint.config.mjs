import globals from 'globals';

export default [
	// analyze all js files except dist folder and config file
	{ files: ['**/*.js', '!**/dist/**', '!**/config/**'], rules: { 'no-console': 'off' } },

	// add the eqeqeq indent, linebreak-style, semi and quotes rules
	{ files: ['**/*.js'], rules: { indent: ['error', 2] } },
	{ files: ['**/*.js'], rules: { 'linebreak-style': ['error', 'unix'] } },
	{ files: ['**/*.js'], rules: { quotes: ['error', 'single'] } },
	{ files: ['**/*.js'], rules: { semi: ['error', 'never'] } },
	{ languageOptions: { globals: globals.browser } },
	// ignore the dist folder
];
