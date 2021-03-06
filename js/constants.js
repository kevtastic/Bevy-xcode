/**
 * constants.js
 *
 * list of constants to use when dispatching and receiving events
 * also sets some nifty environment variables
 *
 * @author albert
 */

'use strict';

var user = {};
var searchNavigator = {};
var mainTabBar = {};
var slashes = '//';

var api_subdomain = 'api';
var api_version = '';
var hostname = 'joinbevy.com';
var protocol = 'http:';

exports.android_version = '1.0.6';
exports.android_phase = 'ALPHA';

exports.ios_version = '2.0.0';

//exports.siteurl = protocol + slashes + hostname;
//exports.apiurl = protocol + slashes + api_subdomain + '.' + api_version + hostname;
exports.domain = 'joinbevy.com';
exports.siteurl = 'http://joinbevy.com';
exports.apiurl = 'http://joinbevy.com/api';
//exports.siteurl = 'http://bevy.dev';
//exports.apiurl = 'http://api.bevy.dev';


exports.hostname = hostname;
exports.protocol = protocol;
exports.api_subdomain = api_subdomain;
exports.api_version = api_version;

exports.client_id = 'ios';
exports.client_secret = 'BY-THE-LIGHT-OF-THE-MOON';
exports.google_client_id = '540892787949-0e61br4320fg4l2its3gr9csssrn07aj.apps.googleusercontent.com';
exports.google_client_secret = 'LuNykxTlzbeH8pa6f77WXroG';
exports.google_redirect_uri = 'com.joinbevy.ios:/oauth2callback';
//exports.google_redirect_uri = 'com.googleusercontent.apps.540892787949-0e61br4320fg4l2its3gr9csssrn07aj:/oauth2callback';

var window = require('Dimensions').get('window');
exports.width = window.width
exports.height = window.height

exports.sideMenuWidth = ((window.width * (4/5)) >= 300) ? 300 : (window.width * (4/5));

var React = require('react-native');
var {
  Platform,
  StatusBarIOS,
  NativeModules
} = React;
if(Platform.OS == 'ios') {
  this.height = 20;
  var RCTStatusBarManager = NativeModules.StatusBarManager;
  RCTStatusBarManager.getHeight(res => {
    this.height = res.height;
  });
  //console.log(this.height);
  exports.getStatusBarHeight = function() {
    return height;
  };
}

exports.APP = {
  // actions
  LOAD: 'app_load',
  UNLOAD: 'app_unload',

  // events
  CHANGE_ALL: 'app_change_all'
};

exports.POST = {
  // actions
  CREATE: 'post_create',
  DESTROY: 'post_destroy',
  VOTE: 'post_vote',
  SORT: 'post_sort',
  UPDATE: 'post_update',
  FETCH: 'post_fetch',
  FETCH_BOARD: 'post_fetch_board',
  FETCH_SINGLE: 'post_fetch_single',
  SEARCH: 'post_search',
  SET_TEMP_POST: 'post_set_temp_post',
  CLEAR_TEMP_POST: 'post_clear_temp_post',

  // events
  POST_CREATED: 'post_created',
  LOADING: 'post_loading',
  LOADED: 'post_loaded',
  FETCHING_SINGLE: 'post_fetching_single',
  FETCHED_SINGLE: 'post_fetched_single',
  CHANGE_ALL: 'post_change_all',
  CHANGE_ONE: 'post_change_one:',
  SEARCHING: 'post_searching',
  SEARCH_COMPLETE: 'post_search_complete',
  SEARCH_ERROR: 'post_search_error'
};

exports.COMMENT = {
  CREATE: 'comment_create',
  EDIT: 'comment_edit',
  DESTROY: 'comment_destroy',
  VOTE: 'comment_vote'
}

exports.BEVY = {
  // actions
  CREATE: 'bevy_create',
  DESTROY: 'bevy_destroy',
  UPDATE: 'bevy_update',
  REQUEST_JOIN: 'bevy_request_join',
  ADD_ADMIN: 'bevy_add_admin',
  REMOVE_ADMIN: 'bevy_remove_admin',
  JOIN: 'bevy_join',
  FETCH: 'bevy_fetch',

  // events
  LOADING: 'bevy_loading',
  LOADED: 'bevy_loaded',
  CHANGE_ALL: 'bevy_change_all',
  CHANGE_ONE: 'bevy_change_one'
};

exports.BOARD = {
  // actions
  SWITCH: 'board_switch',
  CLEAR: 'board_clear',
  DESTROY: 'board_destroy',
  LEAVE: 'board_leave',
  JOIN: 'board_join',
  UPDATE: 'board_update',
  CREATE: 'board_create',

  // events
  SWITCHING: 'board_switching',
  SWITCHED: 'board_switched',
  CREATED: 'board_created',
  CHANGE_ALL: 'board_change_all'
};

exports.USER = {
  // actions
  LOAD_USER: 'user_load_user',
  UPDATE: 'user_update',
  LOGIN: 'user_login',
  LOGIN_GOOGLE: 'user_login_google',
  LOGOUT: 'user_logout',
  CHANGE_PROFILE_PICTURE: 'user_change_profile_picture',
  REGISTER: 'user_register',
  RESET_PASSWORD: 'user_reset_password',
  VERIFY_USERNAME: 'user_verify_username',
  SEARCH: 'user_search',
  FETCH: 'user_fetch',
  ALL_LOADED: 'user_all_loaded',

  // events
  LOGIN_ERROR: 'user_login_error',
  LOGIN_SUCCESS: 'user_login_success',
  RESET_PASSWORD_SUCCESS: 'user_reset_password_success',
  RESET_PASSWORD_ERROR: 'user_reset_password_error',
  VERIFY_SUCCESS: 'user_verify_success',
  VERIFY_ERROR: 'user_verify_error',
  CHANGE_ALL: 'user_change_all',
  LOADING: 'user_loading',
  LOADED: 'user_loaded',
  TOKENS_LOADED: 'user_tokens_loaded',
  SEARCHING: 'user_searching',
  SEARCH_COMPLETE: 'user_search_complete',
  SEARCH_ERROR: 'user_search_error'
};

exports.FILE = {
  // actions
  'UPLOAD': 'file_upload',

  // events
  'UPLOAD_COMPLETE': 'file_upload_complete',
  'UPLOAD_ERROR': 'file_upload_error'
}

exports.NOTIFICATION = {
  // actions
  DISMISS: 'notification_dismiss',
  DISMISS_ALL: 'notification_dismiss_all',
  REGISTER: 'notification_register',
  FETCH: 'notification_fetch',
  SET_INITIAL: 'notification_set_initial',
  CLEAR_INITIAL: 'notification_clear_initial',

  // events
  CHANGE_ALL: 'notification_change_all',
  FETCHING: 'notification_fetching',
  FETCHED: 'notification_fetched'
};

exports.setSearchNavigator = function(navigator) {
	searchNavigator = navigator;
};

exports.getSearchNavigator = function() {
	return searchNavigator;
};

exports.setMainTabBar = function(theBar) {
  mainTabBar = theBar;
};

exports.getMainTabBar = function() {
  return mainTabBar;
}

// ANDROID STUFF
// DONT TOUCH THIS KEVIN OR ELSE

var imageModalActions = {}
var imageModalImages = [];
exports.setImageModalActions = function(actions) {
  imageModalActions = actions;
};
exports.getImageModalActions = function() {
  return imageModalActions;
};
exports.setImageModalImages = function(images) {
  imageModalImages = images;
};
exports.getImageModalImages = function() {
  return imageModalImages
};

var tagModalActions = {};
exports.setTagModalActions = function(actions) {
  tagModalActions = actions;
};
exports.getTagModalActions = function() {
  return tagModalActions;
};

var tabBarActions = {};
exports.setTabBarActions = function(actions) {
  tabBarActions = actions;
};
exports.getTabBarActions = function() {
  return tabBarActions;
};

var searchBarActions = {};
exports.setSearchBarActions = function(actions) {
  searchBarActions = actions;
};
exports.getSearchBarActions = function() {
  return searchBarActions;
};

exports.hintTexts = [
  "What's on your mind?",
  "What's up?",
  "How's it going?",
  "What's new?",
  "How are you doing today?",
  "Share your thoughts",
  "Drop some knowledge buddy",
  "Drop a line",
  "What's good?",
  "What do you have to say?",
  "Spit a verse",
  "What would your mother think?",
  "Tell me about yourself",
  "What are you thinking about?",
  "Gimme a bar",
  "Lets talk about our feelings",
  "Tell me how you really feel",
  "How was last night?",
  "What's gucci?",
  "Anything worth sharing?",
  "What's poppin?",
  "What are you doing right now?",
  "What's cooking good looking?"
];
