/**
 * Created by nuintun on 2015/11/19.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var ipc = require('ipc-renderer');
var Vue = require('../../vue/vue');

module.exports = Vue.component('app-configure', {
  template: fs.readFileSync(path.join(__dirname, 'app-configure.html')).toString(),
  props: {
    configure: {
      type: Object,
      twoWay: true,
      required: true
    }
  },
  data: function (){
    return {
      name: '',
      path: '',
      _cached: {},
      submitError: '',
      popup: false
    }
  },
  computed: {
    uniqueCache: function (){
      var cache = {};

      this.configure.projects.forEach(function (project){
        cache[project.name] = true;
      });

      return cache;
    }
  },
  methods: {
    focus: function (event){
      if (event.target.type === 'text') {
        this.submitError = '';
      }
    },
    appConfigure: function (command, configure){
      ipc.send('app-configure', command, configure);
    },
    popupToggle: function (){
      this.popup = !this.popup;

      if (!this.popup) {
        this.submitError = '';
        this.$broadcast('clean-error');
      }
    },
    addProject: function (){
      this.$broadcast('submit');

      console.log(this.uniqueCache[this.name]);

      if (this.name && this.path) {
        if (this.uniqueCache[this.name]) {
          this.submitError = '项目已存在';
        } else {
          this.popup = false;
          this.configure.projects.push({ name: this.name, path: this.path });

          // clean imput
          this.name = '';
          this.path = '';
          this.submitError = '';

          this.$dispatch('save-configure');
        }
      }
    }
  }
});
