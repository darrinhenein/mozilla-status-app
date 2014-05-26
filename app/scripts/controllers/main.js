/* global $, _, moment */

'use strict';

angular.module('statusToolApp')
  .controller('MainCtrl', function ($scope, $route, $location, $anchorScroll, NameService, ProjectService) {

    var selectedIndex;
    var feed;
    var blacklist = [
      'abc'
    ];

    $scope.projects = ProjectService.getProjects();
    $scope.isViewLoading = true;
    $scope.teamName = 'Loading';

    $scope.dates= {
      start: new moment().subtract(7, 'days').format('MMM Do'),
      end:  new moment().format('MMM D')
    }

    ProjectService.getFeed($route.current.params.feed).success(function(data) {
      $scope.isViewLoading = false;

      _.delay(function(){
        var idx = $('.nav li a.active').data('index');
        if(idx === null) { idx = -1; }
        selectedIndex = idx;

        $('.itemContent a').filter(function() {
          return /(jpg|gif|png|bmp|jpeg|svg)$/.test($(this).attr('href'))
        }).each(function(idx, link){
          $(link).text('Image');
        });

      }, 100);

      $scope.teamName = $route.current.params.feed;

      data.forEach(function(item){
        item.date = moment(item.pubDate).add(7, 'hours').fromNow();
        var authorName = item.author.split('@')[0];
        item.username = authorName;
        item.fullname = NameService.getFullName(authorName);
        item.firstname = NameService.getFirstName(authorName);
        item.name = authorName.substr(0, 1) + '. ' + authorName.substr(1, authorName.length-1);
        item.isRecent = moment(item.pubDate).isAfter(moment().subtract(7, 'days')) ? true : false;
        item.isOld = moment(item.pubDate).isAfter(moment().subtract(1, 'months')) ? true : false;
        item.isBlacklisted = _.contains(blacklist, item.username);
        item.images = [];
        item.description = $(item.description).html();
        $('a', item.description).filter(function() {
          return /(jpg|gif|png|bmp|jpeg|svg)$/.test($(this).attr('href'))
        }).each(function(idx, link){
          item.images.push({link: link.href, user: item.username});
        });
      });

      var newfeed = _.sortBy(_.filter(data, function(i) {
        return i.isOld;
      }), function(item){
        return item.fullname;
      });

      newfeed = _.filter(newfeed, function(i){ return !i.isBlacklisted });

      if(newfeed.length === 0) {
        newfeed = _.sortBy(data, function(item) {
          return item.fullname;
        })
        $scope.feedIsRecent = false;
      } else {
        $scope.feedIsRecent = true;
      }

      $scope.images = [];

      _.each(newfeed, function(i){
        if(i.images.length && i.isRecent) $scope.images.push(i.images);
      });

      $scope.images = _.flatten($scope.images);

      $scope.feed = newfeed;

    });

    $scope.gotoItem = function(item) {
      $location.hash(item);
    }

    $scope.changeProject = function(project) {
      $location.path(project);
      $location.hash('');
      $scope.$apply();
    }

    $scope.toggleStar = function(project) {
      ProjectService.toggleStarred(project);
    }

    $scope.$on('duScrollspy:becameActive', function($event, $element){
      //Automaticly update location
      var hash = $element.prop('hash');
      if(hash) {
        $location.hash(hash.substr(1)).replace();
        $scope.$apply();
      }
    });

    $('body').keydown(function(e){

      if (selectedIndex !== -1) {
        selectedIndex = $('.nav li a.active').data('index');
      }

      if(e.keyCode === 38)
      {
        e.preventDefault();
        selectedIndex -= 1;
      }
      else if (e.keyCode === 40) {
        e.preventDefault();
        selectedIndex += 1;
      }
      else {
        return;
      }

      if(selectedIndex < 0) {
        selectedIndex = -1;
        $scope.gotoItem('top');
        $location.hash('');
        $scope.$apply();
        return;
      }

      if(selectedIndex > $scope.feed.length - 1) {
        selectedIndex = $scope.feed.length - 1;
      }

      var username = $scope.feed[selectedIndex].username;
      $scope.gotoItem(username);
      $scope.$apply();
    });


  });
