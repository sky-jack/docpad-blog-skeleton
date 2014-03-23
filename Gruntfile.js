module.exports = function(grunt) {

  pkg: grunt.file.readJSON('package.json'),
  grunt.initConfig(grunt.file.readJSON('gruntconfig.json'));
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  return grunt.registerTask("default", ['cssmin', 'uglify']);
};

