angular.module('statusToolApp')
.service('NameService', function(){

  var nameHash = {
    alam: ['Anthony', 'Lam'],
    bwinton: ['Blake', 'Winton'],
    dhenein: ['Darrin', 'Henein'],
    ibarlow: ['Ian', 'Barlow'],
    jboriss: ['Boriss'],
    mdeboer: ['Michael', 'de Boer'],
    mmaslaney: ['Michael', 'Maslaney'],
    mverdi: ['Michael', 'Verdi'],
    philipp: ['Philipp', 'Sackl'],
    sfranks: ['Sevaan', 'Franks'],
    shorlander: ['Stephen', 'Horlander'],
    vtsatskin: ['Valentin', 'Tsatskin'],
    ywang: ['Yuan', 'Wang'],
    zfang: ['Zhenshuo', 'Fang'],
    rfeeley: ['Ryan', 'Feeley']
  };

  var counts = _.countBy(nameHash, function(name){
    return name[0];
  });

  return {
    getFullName : function(username) {
      if(nameHash[username]) {
        return nameHash[username].join(" ");
      } else {
        return username;
      }
    },
    getFirstName : function(username) {
      if(nameHash[username]) {
        var firstname = nameHash[username][0];
        if(counts[firstname] > 1) {
          firstname += ' ' + nameHash[username][1].substr(0,1) + '.';
        }
        return firstname;
      } else {
        return username;
      }
    }
  }
})