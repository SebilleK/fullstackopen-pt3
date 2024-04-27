import globals from 'globals';

export default [
	// analyze all js files except dist folder and config file
	{ files: ['**/*.js', '!**/dist/**', '!**/config/**'], rules: { 'no-console': 'off' } },

	// add the eqeqeq indent, linebreak-style, semi and quotes rules
	{
		files: ['**/*.js'],
		rules: {
			eqeqeq: ['error', 'always'],
			indent: ['error', 'tab'],
			'linebreak-style': ['error', 'unix'],
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
		},
	},
	{ languageOptions: { globals: globals.browser } },
	// ignore the dist folder
];
