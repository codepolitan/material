module.exports = function(grunt) {

	require('./tasks/watch.js')(grunt);
	require('./tasks/less.js')(grunt);
	require('./tasks/deploy.js')(grunt);
	require('./tasks/browserify.js')(grunt);
	require('./tasks/plato.js')(grunt);

};
