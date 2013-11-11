var CONFIG = {
	// This app uses parse to access/save player creations
	PARSE_APP_ID: 'TOpEhTzyCEaLxLjPe9VyVXjk2vvw2NAAqSG9yMMC',
	PARSE_JS_KEY: 'oppBrLCiixPXzpfo0dYtCh9nZwrULn8E9Tt0KAvR'
}

// hey Angular, we're bootstrapping manually!
// window.name = "NG_DEFER_BOOTSTRAP!";

/* Setup RequireJS */
require.config({
	baseUrl: 'js',
	paths: {
		'vn': 'vendor',
		'bw': '../bower',
		'cp': '../components',
		'dt': '../data',
		'gm': '../game',
		'vw': '../views',
		'angular': '../bower/angular/angular',
		'jquery': '../bower/jquery/jquery',
		'underscore': '../bower/underscore/underscore',
		'router': '../bower/angular-ui-router/angular-ui-router.min',
		'grid': '../bower/ng-grid/ng-grid.min',
		'parse': 'vendor/parse-1.2.12.min'
	},
	shim: {
		'angular': {
			exports: 'angular'
		},
		'underscore': {
			exports: '_'
		},
		'router': {
			deps: ['angular']
		},
		'parse': {
			exports: 'Parse'
		},
		'vn/phaser': {
			exports: 'Phaser'
		},
		'jquery': {
			exports: 'jQuery'
		},
		'grid': {
			deps: ['angular', 'jquery']
		}
	},
	priority: [
		'require-promise',
		'angular',
		'jquery'
	]
});