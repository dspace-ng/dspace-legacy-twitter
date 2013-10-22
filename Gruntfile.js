module.exports = function(grunt){

  grunt.initConfig({
    watch: {
      server: {
        files: ['server.js', 'config.json'],
        tasks: ['develop'],
        options: { nospawn: true }
      }
    },
    develop: {
      server: {
        file: 'server.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-develop');

  grunt.registerTask('default', ['develop', 'watch']);
};
