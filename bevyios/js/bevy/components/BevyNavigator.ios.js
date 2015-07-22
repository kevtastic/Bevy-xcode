/**
 * BevyNavigator.js
 * kevin made this
 * yo that party was tight
 */

'use strict';

var React = require('react-native');
var _ = require('underscore');
var window = require('Dimensions').get('window');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
} = React;

var SideMenu = require('react-native-side-menu');
var BevyList= require('./BevyList.ios.js');
var PostList = require('./../../post/components/PostList.ios.js');
var InfoView = require('./InfoView.ios.js');

//var BevyListButton = require('./BevyListButton.ios.js');
var BackButton = require('./../../shared/components/BackButton.ios.js');
var SearchButton = require('./SearchButton.ios.js');
var InfoButton = require('./InfoButton.ios.js');

var routes = require('./../../routes');

var Navbar = require('./../../shared/components/Navbar.ios.js');

// get icons
var {
  Icon
} = require('react-native-icons');

var BevyView = React.createClass({
  propTypes: {
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array
  },

  render: function() {
    var view;
    switch(this.props.bevyRoute.name) {
      case 'InfoView':
        view = (
          <InfoView
            bevy={ this.props.activeBevy }
          />
        );
        break;
      case 'PostList':
      default:
        view = (
          <PostList
            { ...this.props }
          />
        );
        break;
    }
    
    /*var sortMenu = (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0)'}
      >
        <Icon
          name='ion|ios-minus'
          size={30}
          color='#666'
          style={styles.sortMenu}
        />
      </TouchableHighlight>
    );*/

    var infoButton = (this.props.activeBevy.name == 'Frontpage' || this.props.bevyRoute.name == 'InfoView')
    ? <View />
    : <InfoButton onPress={() => {
      this.props.bevyNavigator.jumpTo(routes.BEVY.INFO)
    }} />;

    /*var sortAndInfo = (
      <View>
        { sortMenu }
        { infoButton }
      </View>
    );*/

    var backButton = (this.props.bevyRoute.name == 'PostList')
    ? <View />
    : <BackButton onPress={() => {
      this.props.bevyNavigator.jumpTo(routes.BEVY.POSTLIST)
    }} />;

    return (
      <View style={{ flex: 1 }}>
        <Navbar
          bevyRoute={ this.props.bevyRoute }
          bevyNavigator={ this.props.bevyNavigator }
          left={ backButton }
          center={ this.props.activeBevy.name }
          right={ infoButton }
          { ...this.props }
        />
        { view }
      </View>
    );
  }
});

var BevyNavigator = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array
  },

  render: function () {
    return (
      <Navigator
        navigator={ this.props.searchNavigator }
        initialRoute={ routes.BEVY.POSTLIST }
        initialRouteStack={ _.toArray(routes.BEVY) }
        renderScene={(route, navigator) => 
          <BevyView
            bevyRoute={ route }
            bevyNavigator={ navigator }
            { ...this.props }
          />
        }
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: 'black'
  },
  headerStyle: {
    backgroundColor: '#2CB673',
    flex: 1
  },
  sortMenu: {
    width: 30,
    height: 30
  }
});

module.exports = BevyNavigator;