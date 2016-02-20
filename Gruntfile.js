module.exports = function(grunt) {
	grunt.initConfig({

		// Task configuration
		concat: {
			options: {
				separator: ';',
			},
			js_frontend: {
				src: [
					'./bower_components/jquery/dist/jquery.js',
					'./assets/javascript/fix.js',
					'./bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.js',
					'./bower_components/bootstrap/dist/js/bootstrap.js',
					'./bower_components/angular/angular.js',
					'./bower_components/angular-animate/angular-animate.js',
					'./bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
					'./bower_components/angular-soundmanager2/dist/angular-soundmanager2.js',

					'./bower_components/angular-bootstrap-slider/slider.js',
					'./assets/javascript/custom.js'
				],
				dest: './public/assets/javascript/javascript.js'
			}
		},
		less: {
			development: {
				options: {
					compress: true,  //minifying the result
				},
				files: {
					"./public/assets/stylesheets/stylesheet.css":"./assets/stylesheets/custom.less"
				}
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			frontend: {
				files: {
					'./public/assets/javascript/javascript.min.js': './public/assets/javascript/javascript.js'
				}
			}
		},
		watch: {
			js_frontend: {
				files: [
						'./assets/javascript/custom.js'
					],
				tasks: ['concat:js_frontend', 'uglify'],
				options: {
					livereload: true
				}
			},
			less: {
				files: [
						'./assets/stylesheets/*.less'
					],
				tasks: ['less'],
				options: {
					livereload: true
				}
			},
			files: {
				files: ['./public/*', './public/templates/*'],
				options: {
					livereload: true
				}
			},
			grunt: {
				files: ['Gruntfile.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['watch']);

	grunt.registerTask('init', ['concat', 'less', 'uglify']);
};
