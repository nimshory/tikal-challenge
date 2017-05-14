import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  mostIsolatedCountry = '';

  /*@ngInject*/
  constructor($http, NgMap) {
    this.$http = $http;
    this.map = NgMap;
  }

  $onInit() {
    this.$http.get('/api/missions/countries-by-isolation')
      .then(response => {
        this.mostIsolatedCountry = response.data;
        this.position = this.mostIsolatedCountry.country;
        //this.map.getMap().then(function (map) {
        //
        //});

      });
  }
}

export default angular.module('challengeApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
