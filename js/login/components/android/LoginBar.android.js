/**
 * LoginBar.android.js
 * @author albert
 *
 * just like Navbar.ios.js, except more generic
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');

var constants = require('./../../../constants');
var routes = require('./../../../routes');
var noop = function() {};

var LoginBar = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    navigator: React.PropTypes.object,
    navState: React.PropTypes.object
  },

  getInitialState() {
    return {
      activeRoute: routes.LOGIN.LOGIN
    };
  },

  componentDidMount() {
    this.props.navigator.navigationContext.addListener('willfocus', (ev) => {
      var route = ev.data.route;
      this.setState({
        activeRoute: route
      });
      this.forceUpdate();
    });
  },

  componentWillUnmount() {
    //this.props.navigator.navigationContext.removeListener('willfocus');
  },

  onBack() {
    if(this.state.activeRoute.name == routes.LOGIN.LOGIN.name) {
      // at login view
      // go back to tabbar or whatever
      this.props.mainNavigator.pop();
    } else {
      // at forgot or register view
      // go back to login view
      this.props.navigator.pop();
    }
  },

  _renderBackButton() {
    return (
      <TouchableNativeFeedback
        onPress={ this.onBack }
      >
        <View style={ styles.backButton }>
          <Icon
            name='arrow-back'
            size={ 30 }
            color='#FFF'
          />
        </View>
      </TouchableNativeFeedback>
    );
  },

  _renderTitle() {
    var title = 'Default Title';
    if(this.state.activeRoute.name == routes.LOGIN.LOGIN.name) {
      // at login view
      title = 'Login to Bevy';
    } else if (this.state.activeRoute.name == routes.LOGIN.REGISTER.name) {
      // at register view
      title = 'Create an Account';
    } else if (this.state.activeRoute.name == routes.LOGIN.FORGOT.name) {
      // at fotgot password view
      title = 'Forgot Password';
    }
    return title;
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.title }>
          <Text style={ styles.titleText }>{ this._renderTitle() }</Text>
        </View>
        { this._renderBackButton() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#2CB673'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 8,
    paddingRight: 8
  },
  title: {
    position: 'absolute',
    width: constants.width,
    height: 48,
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    textAlign: 'center'
  }
});

module.exports = LoginBar;