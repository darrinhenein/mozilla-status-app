angular.module('statusToolApp')
.service('ProjectService', function($http, localStorageService){

  var feedHost = 'https://mozilla-status-feed.herokuapp.com/feed/';

  var projects = [
    'accessibility',
    'amo',
    'android',
    'calendar',
    'content',
    'CrashKill',
    'daala',
    'devtools',
    'electrolysis',
    'fennec',
    'firefox',
    'gfx',
    'Identity',
    'jetpack',
    'js-engine',
    'labs',
    'layout',
    'low-level-tools',
    'mdn',
    'metrics',
    'metro',
    'perf',
    'pjs',
    'platform-integration',
    'plugins',
    'Pomoce',
    'QA Automation&Infrastructure',
    'qa execution',
    'releng',
    'rust',
    'seamonkey',
    'services',
    'servo',
    'Shumway',
    'startup',
    'static-analysis',
    'thunderbird',
    'translation',
    'User-experience',
    'weave',
    'webapi',
    'webdev'
    ];

    var isStarred = function(projectName) {
      return localStorageService.get(projectName);
    };

    return {
      getProjects : function() {
        var projs = [];
        projects.forEach(function(p) {
            var starred = false;
            if (isStarred(p)) starred = true;
            projs.push({
                name: p,
                isStarred: starred
            });
        });
        return projs;
      },

      getFeed: function(projectName) {
        return $http.jsonp(feedHost + projectName + '?callback=JSON_CALLBACK');
      },

      toggleStarred: function(project) {
        project.isStarred = !project.isStarred;
        localStorageService.add(project.name, project.isStarred);
      }

    }

});