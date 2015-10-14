/**
 * BevyBar.android.js
 * the navigation bar used in PostList
 * 
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var BevyBar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    bevyRoute: React.PropTypes.object
  },

  goBack() {
    this.props.bevyNavigator.pop();
  },

  goToInfoView() {
    // go to the info view
    this.props.bevyNavigator.push(routes.BEVY.INFO);
  },

  _renderImage() {
    if(this.props.activeBevy._id == -1 || _.isEmpty(this.props.activeBevy.image_url)) {
      return <View style={ styles.bevyImageWrapperDefault } />;
    } else {
      return (
        <View style={ styles.bevyImageWrapper }>
          <Image
            source={{ uri: this.props.activeBevy.image_url }}
            style={ styles.bevyImage }
          />
          <View style={ styles.imageDarkener } />
        </View>
      );
    }
  },

  _renderBackButton() {
    if(this.props.bevyRoute.name == routes.BEVY.INFO.name
      || this.props.bevyRoute.name == routes.BEVY.RELATED.name
      || this.props.bevyRoute.name == routes.BEVY.TAGS.name) {
      return (
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={ this.goBack }
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
    } else return <View />;
  },

  _renderInfoButton() {
    if(  this.props.activeBevy._id == -1 
      || this.props.bevyRoute.name == routes.BEVY.INFO.name
      || this.props.bevyRoute.name == routes.BEVY.RELATED.name
      || this.props.bevyRoute.name == routes.BEVY.TAGS.name) 
      return <View />;
    else return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#EEE', false) }
        onPress={ this.goToInfoView }
      >
        <View style={ styles.infoButton }>
          <Icon
            name='info'
            size={ 30 }
            color='#FFF'
          />
        </View>
      </TouchableNativeFeedback>
    );
  },

  render() {
    if(_.isEmpty(this.props.activeBevy)) return <View />;
    else return (
      <View style={ styles.container }>
        { this._renderImage() }
        { this._renderBackButton() }
        <View style={{ flex: 1 }}/>
        <View style={ styles.bevyNameContainer }>
          <Text style={ styles.bevyName }>
            { this.props.activeBevy.name }
          </Text>
        </View>
        { this._renderInfoButton() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    marginBottom: 8
  },
  bevyImageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48
  },
  bevyImageWrapperDefault: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48,
    backgroundColor: '#AAA'
  },
  bevyImage: {
    width: constants.width,
    height: 48
  },
  imageDarkener: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48,
    backgroundColor: '#000',
    opacity: 0.5
  },
  bevyNameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40
  },
  bevyName: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#FFF'
  },
  infoButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  }
});

module.exports = BevyBar;