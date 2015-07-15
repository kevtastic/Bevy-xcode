/**
 * the bevy ios app
 * made by kevin for the SUB-OHM ARMY 
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  StatusBarIOS,
  Text,
  View,
  Navigator,
  AsyncStorage
} = React;

var MainView = require('./js/app/components/MainView.ios.js');

var Backbone = require('backbone');
var _ = require('underscore');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 0,
  },
});

var Backbone = require('backbone');
Backbone.sync = function(method, model, options) {

  var headers = {
    'Accept': 'application/json'
  };
  var body = '';

  var url = model.url;
  if (!options.url) {
    url = _.result(model, 'url');
  } else {
    url = options.url;
  }

  if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.attrs || model.toJSON(options));
  }

  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };
  method = methodMap[method];

  return fetch(url, {
    method: method,
    headers: headers,
    body: body
  })
  .then(res => {
    var response = JSON.parse(res._bodyText);

    //console.log('model', model);
    //console.log('response', response);
    //console.log('options', options);

    options.success(response, options);
  });
}

var constants = require('./js/constants');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CHAT = constants.CHAT;
var NOTIFICATION = constants.NOTIFICATION;

var BevyStore = require('./js/BevyView/BevyStore');
var PostStore = require('./js/PostList/PostStore');
var ChatStore = require('./js/ChatView/ChatStore');
var NotificationStore = require('./js/NotificationView/NotificationStore');

var AppActions = require('./js/app/AppActions');

var bevyios = React.createClass({

  getInitialState: function() {

    console.log('loading...');
    AsyncStorage.getItem('user')
    .then((user) => {
      if(user) {
        constants.setUser(JSON.parse(user));
        AppActions.load();
        this.setState({
          route: { name: 'MainTabBar', index: 2}
        });
      } else {
        console.log('going to login screen...');
        this.setState({
          route: { name: 'LoginNavigator', index: 1}
        });
      }
    });

    StatusBarIOS.setStyle(1);
      
    return {
      route: { name: 'LoadingView', index: 0},
      allBevies: BevyStore.getAll(),
      activeBevy: BevyStore.getActive(),
      allPosts: PostStore.getAll(),
      allThreads: ChatStore.getAll(),
      allNotifications: NotificationStore.getAll()
    };
  },

  componentDidMount: function() {
    BevyStore.on(BEVY.CHANGE_ALL, this._onBevyChange);
    PostStore.on(POST.CHANGE_ALL, this._onPostChange);
    ChatStore.on(CHAT.CHANGE_ALL, this._onChatChange);
    NotificationStore.on(NOTIFICATION.CHANGE_ALL, this._onNotificationChange);
  },

  componentWillUnmount: function() {
    BevyStore.off(BEVY.CHANGE_ALL, this._onBevyChange);
    PostStore.off(POST.CHANGE_ALL, this._onPostChange);
    ChatStore.off(CHAT.CHANGE_ALL, this._onChatChange);
    NotificationStore.off(NOTIFICATION.CHANGE_ALL, this._onNotificationChange);

    AppActions.unload();
  },

  _onBevyChange: function() {
    this.setState({
      allBevies: BevyStore.getAll(),
      activeBevy: BevyStore.getActive()
    });
  },
  _onPostChange: function() {
    this.setState({
      allPosts: PostStore.getAll()
    });
  },
  _onChatChange: function() {
    this.setState({
      allThreads: ChatStore.getAll()
    });
  },
  _onNotificationChange: function() {
    this.setState({
      allNotifications: NotificationStore.getAll()
    });
  },

  render: function() {

    return (
        <Navigator
          initialRoute={ this.state.route }
          renderScene={(route, navigator) => 
            <MainView 
              route={route}
              navigator={navigator}
              { ...this.state }
            />
          }
        />
    );
  }
});

AppRegistry.registerComponent('bevyios', () => bevyios);

