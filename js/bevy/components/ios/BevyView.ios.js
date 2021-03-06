/**
 * BevyView.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  DeviceEventEmitter,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var PostList = require('./../../../post/components/ios/PostList.ios.js');
var BevyNavbar = require('./BevyNavbar.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BoardActions = require('./../../../bevy/BoardActions');
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');
var POST = constants.POST;

var BevyView = React.createClass({
  propTypes: {
    allPosts: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object,
    user: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    leftMenuActions: React.PropTypes.object,
    rightMenuActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      menuButtonRotation: new Animated.Value(0),
      infoButtonRotation: new Animated.Value(0),
      useSearchPosts: false,
      keyboardSpace: 0
    };
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.leftMenuActions.isOpen()) {
      // close left menu
      Animated.timing(
        this.state.menuButtonRotation, {
          toValue: 1,
          duration: 300
        }
      ).start()
    } else {
      // open side menu
      Animated.timing(
        this.state.menuButtonRotation, {
          toValue: 0,
          duration: 300
        }
      ).start()
    }

    if(nextProps.rightMenuActions.isOpen()) {
      // close right menu
      Animated.timing(
        this.state.infoButtonRotation, {
          toValue: 1,
          duration: 300
        }
      ).start()
    } else {
      // open side menu
      Animated.timing(
        this.state.infoButtonRotation, {
          toValue: 0,
          duration: 300
        }
      ).start()
    }
  },

  componentDidMount() {
    this.keyboardWillShowSub = DeviceEventEmitter.addListener('keyboardWillShow', this.onKeyboardShow);
    this.keyboardWillHideSub = DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);

    //if(_.isEmpty(this.props.activeBevy))
    //  this.props.mainNavigator.push({name: routes.MAIN.LOGIN});
  },
  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  },

  onKeyboardShow(frames) {
    if(frames.end) {
      this.setState({ keyboardSpace: frames.end.height });
    } else {
      this.setState({ keyboardSpace: frames.endCoordinates.height });
    }
  },
  onKeyboardHide(frames) {
    this.setState({ keyboardSpace: 0 });
  },

  onSearchStart() {
    this.setState({ useSearchPosts: true });
    this.PostList.switchToSearch();
  },
  onSearchStop() {
    this.setState({ useSearchPosts: false });
    this.PostList.switchBackFromSearch();
  },

  goToSettings() {
    if(this.props.activeBoard._id != undefined)
      this.props.mainNavigator.push({name: routes.MAIN.BOARDSETTINGS})
    else
      this.props.mainNavigator.push({name: routes.MAIN.BEVYSETTINGS})
  },
  
  toggleRightMenu() {
    this.props.rightMenuActions.toggle();
  },

  toggleLeftMenu() {
    this.props.leftMenuActions.toggle();
  },

  _renderLeftButton() {
    var activeName = this.props.activeBevy.name;
    if(this.props.activeBoard._id != undefined) {
      activeName = this.props.activeBoard.name;
    }
    return (
      <View style={ styles.leftContainer }>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={ styles.backButton }
          onPress={ this.toggleLeftMenu }
        >
          <Image
            style={ styles.bevyButtonImage }
            source={ require('./../../../images/logo_100_reversed.png') }
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={ .5 }
          onPress={ this.goToSettings }
        >
          <View style={ styles.textButton }>
            <Text style={ styles.textButtonText }>
              { activeName }
            </Text>
            <Icon
              name='arrow-drop-down'
              size={ 30 }
              color='#FFF'
              style={ styles.textButtonArrow }
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  },

  _renderMenuButton() {
    return (
      <Animated.View
        style={{
          transform: [{
            rotate: this.state.infoButtonRotation.interpolate({
              inputRange: [0, 1],
              outputRange: [ '0deg', '90deg' ]
            })
          }]
        }}
      >
        <TouchableOpacity
          underlayColor={ 0.5 }
          style={ styles.sideMenuButton }
          onPress={ this.toggleRightMenu }
        >
          <Icon
            name='more-horiz'
            size={ 30 }
            color='#FFF'
          />
        </TouchableOpacity>
      </Animated.View>
    );
  },

  render() {

    return (
      <View style={[ styles.container, {
        marginBottom: this.state.keyboardSpace
      }]}>
        <BevyNavbar
          activeBevy={ this.props.activeBevy }
          activeBoard={ this.props.activeBoard }
          left={ this._renderLeftButton() }
          center={ <View/> }
          right={ this._renderMenuButton() }
          user={ this.props.user }
        />
        <PostList
          ref={ ref => { this.PostList = ref; }}
          allPosts={ this.props.posts }
          activeBevy={ this.props.activeBevy }
          activeBoard={ this.props.activeBoard }
          user={ this.props.user }
          myBevies={ this.props.myBevies }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
          bevyNavigator={ this.props.bevyNavigator }
          useSearchPosts={ this.state.useSearchPosts }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    height: 40,
    paddingHorizontal: 8
  },
  sideMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    height: 40,
    paddingHorizontal: 8
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bevyButtonImage: {
    width: 30,
    height: 30,
    marginLeft: 5
  },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10
  },
  textButtonArrow: {
    marginTop: 5
  }
});

module.exports = BevyView;
