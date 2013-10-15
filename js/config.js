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
		'bw': '../bower_components',
		'cp': '../components',
		'dt': '../data',
		'gm': '../game',
		'angular': '../bower_components/angular/angular',
		'jquery': '../bower_components/jquery/jquery.min',
		'underscore': '../bower_components/underscore/underscore-min',
		'router': '../bower_components/angular-ui-router/release/angular-ui-router',
		'grid': '../bower_components/ng-grid/ng-grid-2.0.7.debug',
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