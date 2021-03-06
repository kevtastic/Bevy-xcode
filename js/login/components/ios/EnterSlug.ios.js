/**
 * EnterSlug.ios.js
 *
 * Step 1 of login
 *
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  DeviceEventEmitter
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var Icon = require('react-native-vector-icons/MaterialIcons');
var USER = constants.USER;
var routes = require('./../../../routes');
var AppActions = require('./../../../app/AppActions');
var UserActions = require('./../../../user/UserActions');
var UserStore = require('./../../../user/UserStore');

var EnterSlugView = React.createClass({
  propTypes: {
    loginNavigator: React.PropTypes.object,
    message: React.PropTypes.string
  },

  getInitialState() {
    return {
      // textinput values that we track
      slug: '',
      // any errors with logging in or verification
      error: '',
      // used by UI to display loading indicator or not
      loading: false,
      // used to move view around keyboard
      keyboardSpace: 0
    }
  },

  componentDidMount() {
    UserStore.on(USER.LOGIN_ERROR, this.onError);

    this.keyboardWillShowSub = DeviceEventEmitter.addListener('keyboardWillShow', this.onKeyboardShow);
    this.keyboardWillHideSub = DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);

    this.SlugInput.focus();
  },
  componentWillUnmount() {
    UserStore.off(USER.LOGIN_ERROR, this.onError);

    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  },

  onError(error) {
    this.setState({ error: error });
  },

  submit() {
    if(this.state.loading)  return;
    if(_.isEmpty(this.state.slug)) {
      return this.setState({ error: 'Please enter your group\'s Bevy domain' });
    } else {
      this.setState({ error: '' });
    }
    this.setState({
      loading: true
    });
    fetch(constants.apiurl + '/bevies/' + this.state.slug + '/verify', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        loading: false
      });
      setTimeout(() => {
        if(!_.isObject(res)) {
          this.setState({
            error: res,
          });
          return;
        }
        if(res.found) {
          // go to the bevys login page
          this.props.loginNavigator.push({
            name: routes.LOGIN.LOGIN,
            slug: this.state.slug
          })
        } else {
          this.setState({
            error: 'Group domain not found',
            verifying: false,
            loading: false
          });
        }
      }, 250);
    })
    .catch(err => {
      this.setState({
        loading: false,
        error: err.toString()
      });
    });
  },

  onKeyboardShow(frames) {
    if(frames.end) {
      this.setState({ keyboardSpace: frames.end.height });
    } else {
      this.setState({ keyboardSpace: frames.endCoordinates.height });
    }
    setTimeout(this.scrollToBottom, 300);
  },

  onKeyboardHide(frames) {
    this.setState({ keyboardSpace: 0 });
    setTimeout(this.scrollToTop, 300);
  },

  scrollToTop() {
    if(this.ScrollView == undefined) return;
    this.ScrollView.scrollTo({ x: 0, y: 0 });
  },

  scrollToBottom() {
    // dont even try if the scroll view hasn't mounted yet
    if(this.ScrollView == undefined) return;

    var innerScrollView = this.ScrollView.refs.InnerScrollView;
    var scrollView = this.ScrollView.refs.ScrollView;

    requestAnimationFrame(() => {
      innerScrollView.measure((innerScrollViewX, innerScrollViewY,
        innerScrollViewWidth, innerScrollViewHeight) => {

        scrollView.measure((scrollViewX, scrollViewY, scrollViewWidth, scrollViewHeight) => {
          var scrollTo = innerScrollViewHeight - scrollViewHeight + innerScrollViewY;

          if(innerScrollViewHeight < scrollViewHeight) {
            return;
          }

          this.ScrollView.scrollTo({ x: 0, y: scrollTo });
        });
      });
    });
  },

  _renderError() {
    if(_.isEmpty(this.state.error)) return <View />;
    return (
      <View style={ styles.errorContainer }>
        <Text style={ styles.errorText }>
          { this.state.error }
        </Text>
      </View>
    );
  },

  calcCharWidth(char) {
    switch(char) {
      case 'i':
      case 'j':
      case 'I':
      case 'l':
        return 6.5;
      case 'r':
      case 't':
      case 'f':
        return 10;
      case 'm':
      case 'M':
      case 'w':
      case 'W':
      case 'N':
      case 'H':
        return 22;
      case 'V':
      case 'K':
      case 'D':
      case 'H':
      case 'Q':
      case 'O':
      case 'U':
      case 'T':
      case 'A':
      case 'G':
      case 'Z':
      case 'X':
      case 'C':
      case 'B':
      case 'S':
        return 18;
      default:
        return 14.5;
    }
  },

  calcSlugWidth() {
    var result = 0;
    var str = this.state.slug;
    var i = str.length;
    while (i--) {
      result += this.calcCharWidth(str[i]);
    }
    return result;
  },

  render() {
    return (
      <ScrollView
        ref={ ref => { this.ScrollView = ref; }}
        style={[ styles.container, {
          marginBottom: this.state.keyboardSpace
        }]}
        contentContainerStyle={ styles.containerInner }
        keyboardShouldPersistTaps={ true }
        //scrollEnabled={ false }
      >
        <View style={styles.column}>
          <View style={styles.navbar}>
            <TouchableOpacity
              activeOpacity={.4}
              onPress={() => {
                this.props.loginNavigator.pop();
              }}
            >
              <Icon
                name='close'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={.4}
              onPress={() => {
                this.submit();
              }}
            >
              <Text style={[styles.nextButton, {opacity: (this.state.slug.length > 0) ? 1 : .75}]}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
          { this._renderError() }
          <Text style={ styles.detailText }>
            Bevy URL
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <TextInput
              ref={ref => { this.SlugInput = ref; }}
              autoCorrect={ false }
              placeholder='MyBevy'
              style={[ styles.loginInput, {
                width: (this.state.slug.length == 0) ? 94 : this.calcSlugWidth()
              }]}
              autoCapitalize={'none'}
              onChangeText={ slug => this.setState({ slug: slug }) }
              placeholderTextColor='rgba(255,255,255,.5)'
            />
            <Text style={{color: '#fff', fontSize: 25, opacity: .75}}>
              .joinbevy.com
            </Text>
          </View>
          <Text style={ styles.detailText }>
            This is the URL you use to sign in to your bevy
          </Text>
          {/*<TouchableOpacity
            activeOpacity={ 0.5 }
            style={ styles.loginButton }
            onPress={ this.submit }>
            <Text style={ styles.loginButtonText }>
              Login
            </Text>
          </TouchableOpacity>*/}
        </View>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: constants.width,
    backgroundColor: '#2CB673',
  },
  containerInner: {
    flexDirection: 'column',
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: constants.width / 12
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    width: constants.width,
    paddingLeft: 20
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10
  },
  title: {
    alignItems: 'center',
    marginBottom: 20
  },
  titleText: {
    fontSize: 28,
    color: '#fff'
  },
  logInTitle: {
    textAlign: 'center',
    fontSize: 17,
    color: '#666',
    marginBottom: 10
  },
  errorContainer: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#df4a32',
    borderRadius: 5,
    marginBottom: 10
  },
  errorText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 17
  },
  loginInput: {
    height: 30,
    color: '#fff',
    flex: 1,
    fontSize: 25,
  },
  detailText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
    marginRight: 10
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: constants.width / 3,
    paddingTop: 30,
    paddingRight: 40,
    flex: 1,
    width: constants.width
  },
  nextButton: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

module.exports = EnterSlugView;
