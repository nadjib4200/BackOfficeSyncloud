'use strict';


module.exports = {
	app: {
		title: 'user-track',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'user, stats, track'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/At.js/dist/css/jquery.atwho.min.css',
				'public/lib/dc.js/dc.css',
				'public/lib/codemirror/lib/codemirror.css',
				'public/lib/codemirror/addon/hint/show-hint.css',
				'public/lib/codemirror/theme/monokai.css',
				'public/lib/ladda/css/demo.css',
				'public/lib/ladda/dist/ladda.min.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular/angular.js',
				'public/lib/restangular/dist/restangular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/lodash/dist/lodash.min.js',
				'public/lib/Caret.js/dist/jquery.caret.min.js',
				'public/lib/At.js/dist/js/jquery.atwho.js',
				'public/lib/d3/d3.min.js',
				'public/lib/crossfilter/crossfilter.min.js',
				'public/lib/dc.js/dc.min.js',
				'public/lib/sugar/release/sugar-full.min.js',
				'public/lib/algoliasearch/dist/algoliasearch.min.js',
				'public/lib/pubnub/web/pubnub.min.js',
				'public/lib/codemirror/lib/codemirror.js',
				'public/lib/codemirror/addon/hint/show-hint.js',
				'public/lib/codemirror/addon/hint/templates-hint.js',
				'public/lib/codemirror/mode/javascript/javascript.js',
				'public/lib/codemirror/addon/display/placeholder.js',
				'public/lib/ladda/js/spin.js',
				'public/lib/ladda/js/ladda.js',
				'public/lib/angular-ladda/src/angular-ladda.js',
				"public/lib/amcharts/dist/amcharts/amcharts.js",
				"public/lib/amcharts/dist/amcharts/serial.js",
				"public/lib/amcharts/dist/amcharts/pie.js",
				"public/lib/amcharts/dist/amcharts/themes/dark.js",
				"public/lib/amcharts/dist/amcharts/amstock.js",
				"public/lib/gauss/gauss.min.js",
				"public/lib/typeahead.js/dist/bloodhound.min.js",
				"public/lib/typeahead.js/dist/typeahead.bundle.min.js",
				"public/lib/typeahead.js/dist/typeahead.jquery.min.js",
				//custom
				'public/libs/dagre/graphlib.min.js',
				'public/libs/dagre-d3/js/dagre-d3.min.js',
				'public/libs/codemirror/addon/hint/algolia-hint.js',
				'public/dist/filepicker.js'
			]
		},
		css: [
			'public/css/app.css'
		],
		js: [
			'public/fixapp.js',
			'public/config.js',
			'public/application.js',
			'public/constants.js',
			'public/modules/*/*.js',
			'public/modules/**/*.js',
			'public/modules/**/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/**/tests/*.js'
		]
	}
};
