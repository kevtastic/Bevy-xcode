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

exports.siteurl = protocol + slashes + hostname;
exports.apiurl = protocol + slashes + api_subdomain + '.' + api_version + hostname;

exports.hostname = hostname;
exports.protocol = protocol;
exports.api_subdomain = api_subdomain;
exports.api_version = api_version;

exports.google_client_id = '540892787949-0e61br4320fg4l2its3gr9csssrn07aj.apps.googleusercontent.com';
exports.google_client_secret = 'LuNykxTlzbeH8pa6f77WXroG';
exports.google_redirect_uri = 'com.joinbevy.ios:/oauth2callback';
//exports.google_redirect_uri = 'com.googleusercontent.apps.540892787949-0e61br4320fg4l2its3gr9csssrn07aj:/oauth2callback';

var window = require('Dimensions').get('window');
exports.width = window.width
exports.height = window.height

exports.sideMenuWidth = ((window.width * (2/3)) >= 300) ? 300 : (window.width * (2/3));

exports.APP = {
  LOAD: 'app_load',
  UNLOAD: 'app_unload',

  LOAD_PROGRESS: 'app_load_progress'
};

exports.POST = {
  CREATE: 'post_create',
  DESTROY: 'post_destroy',
  VOTE: 'post_vote',
  SORT: 'post_sort',
  UPDATE_LIST: 'post_update_list',

  FETCH: 'post_fetch',

  LOADING: 'post_loading',
  LOADED: 'post_loaded',
  CHANGE_ALL: 'post_change_all',
  CHANGE_ONE: 'post_change_one:'
};

exports.COMMENT = {
  CREATE: 'comment_create',
  DESTROY: 'comment_destroy',
  VOTE: 'comment_vote'
}

exports.BEVY = {
  CREATE: 'bevy_create',
  DESTROY: 'bevy_destroy',
  UPDATE: 'bevy_update',
  SET_NOTIFICATION_LEVEL: 'bevy_set_notification_level',
  LEAVE: 'bevy_leave',
  SWITCH: 'bevy_switch',
  INVITE: 'bevy_invite',
  ADD_USER: 'bevy_add_user',
  SEARCH: 'bevy_search',
  SUBSCRIBE: 'bevy_subscribe',
  UNSUBSCRIBE: 'bevy_unsubscribe',
  UPDATE_FRONT: 'bevy_updatefront',
  UPDATE_TAGS: 'bevy_updatetags',

  FETCH: 'bevy_fetch',
  FETCH_PUBLIC: 'bevy_fetch_public',

  LOADING: 'bevy_loading',
  LOADED: 'bevy_loaded',

  SEARCHING: 'bevy_searching',
  SEARCH_COMPLETE: 'bevy_search_complete',
  CHANGE_ALL: 'bevy_change_all',
  CHANGE_ONE: 'bevy_change_one',
  SWITCHED: 'bevy_switched',
  CREATED: 'bevy_created',
  NAV_POSTVIEW: 'bevy_nav_postview'
};

exports.CHAT = {
  SWITCH: 'chat_switch',

  THREAD_OPEN: 'chat_thread_open',
  FETCH_MORE: 'chat_fetch_more',
  POST_MESSAGE: 'chat_post_message',
  CHANGE_ALL: 'chat_change_all',
  CHANGE_ONE: 'chat_change_one:'
};

exports.USER = {
  UPDATE: 'user_update',
  LOGIN: 'user_login',
  LOGOUT: 'user_logout',
  CHANGE_PROFILE_PICTURE: 'user_change_profile_picture',

  LOGIN_ERROR: 'user_login_error',
  LOGIN_SUCCESS: 'user_login_success',
  CHANGE_ALL: 'user_change_all',
  LOADED: 'user_loaded'
};

exports.FILE = {
  'UPLOAD': 'file_upload',
  'UPLOAD_COMPLETE': 'file_upload_complete',
  'UPLOAD_ERROR': 'file_upload_error'
}

exports.NOTIFICATION = {
  DISMISS: 'notification_dismiss',
  DISMISS_ALL: 'notification_dismiss_all',

  CHANGE_ALL: 'notification_change_all'
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

var actionSheetActions = {};
exports.setActionSheetActions = function(actions) {
  actionSheetActions = actions;
};
exports.getActionSheetActions = function() {
  return actionSheetActions;
};

var tagModalActions = {};
exports.setTagModalActions = function(actions) {
  tagModalActions = actions;
};
exports.getTagModalActions = function() {
  return tagModalActions;
};
