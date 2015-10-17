'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  ListView,
  Text,
  TextInput,
  Image,
  StyleSheet,
  StatusBarIOS,
  Navigator,
  TouchableHighlight,
  DeviceEventEmitter,
  TouchableOpacity
} = React;

var Icon = require('react-native-vector-icons/Ionicons');

var _ = require('underscore');
var routes = require('./../../routes');
var constants = require('./../../constants');
var FILE = constants.FILE;
var FileStore = require('./../../file/FileStore');
var FileActions = require('./../../file/FileActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
var window = require('Dimensions').get('window');

var Navbar = require('./../../shared/components/Navbar.ios.js');
var SettingsItem = require('./../../shared/components/SettingsItem.ios.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var PostActions = require('./../PostActions');

var CreateEventView = React.createClass({

  propTypes: {
    selected: React.PropTypes.object, 
    user: React.PropTypes.object,
  },

  getInitialState() {
    return {
      keyboardSpace: 0,
      title: '',
      postImageURI: 'http://api.joinbevy.com/img/default_event_img.png',
      placeholderText: 'Drop a Line',
      location: '',
      info: ''
    };
  },

  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardDidShow', this._onKeyboardShowed);
    DeviceEventEmitter.addListener('keyboardWillHide', this._onKeyboardHid);

    // file upload events
    FileStore.on(FILE.UPLOAD_COMPLETE, (filename) => {
      console.log('caught upload', filename)
      this.setState({
        postImageURI: filename,
        placeholderText: 'Say Something About This Image'
      });
    });
  },

  _onKeyboardShowed(ev) {
    var height = (ev.end) ? ev.end.height : ev.endCoordinates.height;
    this.setState({
      keyboardSpace: height
    });
  },

  _onKeyboardHid(ev) {
    this.setState({
      keyboardSpace: 0
    });
  },

  componentWillUnmount() {
    FileStore.off(FILE.UPLOAD_COMPLETE);
  },

  uploadImage() {
    UIImagePickerManager.showImagePicker({
      title: 'Upload Picture',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      returnBase64Image: false,
      returnIsVertical: false
    }, (type, response) => {
      if (type !== 'cancel') {
        //console.log(response);
        FileActions.upload(response);
      } else {
        //console.log('Cancel');
      }
    });
  },

  submit() {

    if(!this.state.title || !this.state.location) 
      return;

    var date = new Date(this.props.date);
    var time = new Date(this.props.time);
    var dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 
               time.getHours(), time.getMinutes(), time.getSeconds());

    var description = this.state.info || '';

    var tag = this.props.tag;

    var event = {
        date: dateTime,
        location: this.state.location,
        description: description,
        attendees: []
      };

    // send the create action
    PostActions.create(
      this.state.title, // title
      [this.state.postImageURI], // image_url
      this.props.user, // author
      this.props.selected, // bevy
      'event', //type
      event, // event
      tag
    );

    // reset fields
    this.refs.title.setNativeProps({ text: '' }); // clear text
    this.refs.info.setNativeProps({ text: '' }); // clear text
    this.refs.location.setNativeProps({ text: '' }); // clear text
    this.refs.title.blur(); // unfocus text field
    this.refs.info.blur(); // unfocus text field
    this.refs.location.blur(); // unfocus text field
    this.props.mainNavigator.pop(); // navigate back to main tab bar
  },

  _renderPostImage() {
    var image_url = (this.state.postImageURI) ? this.state.postImageURI : 'http://api.joinbevy.com/img/default_event_img.png';
    return (
        <Image
          source={{ uri: this.state.postImageURI }}
          style={{
            flex: 1,
            height: 150,
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'column'
          }}
        >
          <View style={{flex: 2, backgroundColor: 'rgba(0,0,0,.2)', width: constants.width}}/>
          <View style={styles.imageOverlay}>
            <TextInput 
              ref='title'
              multiline={ true }
              onChange={(ev) => {
                this.setState({
                  title: ev.nativeEvent.text
                });
              }}
              placeholder='Event Title'
              style={ styles.titleInput }
            />
            <TouchableHighlight
              underlayColor='rgba(0,0,0,.2)'
              style={{
                  borderRadius: 20, 
                  width: 40, height: 40, 
                  backgroundColor: '#999', 
                  padding: 5, 
                  margin: 10,                  
                  shadowColor: 'rgba(0,0,0,.3)',
                  shadowOffset: {width: 2, height: 2},
                  shadowOpacity: 1,
                  shadowRadius: 5 }}
              onPress={() => {
                UIImagePickerManager.showImagePicker({
                    returnBase64Image: false,
                    returnIsVertical: true
                  }, (type, response) => {
                    if (type !== 'cancel') {
                      //console.log(response);
                      FileActions.upload(response);
                    } else {
                      //console.log('Cancel');
                    }
                });
              }}
            >
              <Icon
                name='camera'
                size={25}
                color='#fff'
                style={{ 
                  padding: 5, 
                  width: 30, 
                  height: 30, 
                }}
              />
            </TouchableHighlight>
          </View>
        </Image>
    );
  },

  render() {
    var user = this.props.user;
    var containerStyle = {
      flex: 1,
      flexDirection: 'column',
      marginBottom: (this.state.keyboardSpace == 0) ? 0 : this.state.keyboardSpace,
    };
    return (
      <View style={ containerStyle }>
        <Navbar
          styleParent={{
            backgroundColor: '#2CB673',
            flexDirection: 'column',
            paddingTop: 0
          }}
          styleBottom={{
            backgroundColor: '#2CB673',
            height: 48,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          left={ 
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {
                this.refs.input.blur();
                this.props.mainNavigator.pop();
              }}
              style={ styles.navButtonLeft }>
              <Text style={ styles.navButtonTextLeft }>
                Cancel
              </Text>
            </TouchableHighlight> 
          }
          center={ 
            <View style={ styles.navTitle }>
              <Text style={ styles.navTitleText }>
                New Event
              </Text>
            </View>
          }
          right={
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {
                this.submit();
              }}
              style={ styles.navButtonRight }>
              <Text style={ styles.navButtonTextRight }>
                Post
              </Text>
            </TouchableHighlight>
          }
        />
        <View style={ styles.body }>
          <View style={ styles.bevyPicker }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {
                this.props.newPostNavigator.push(routes.NEWPOST.TAGPICKER);
              }}
              style={ styles.toBevyPicker }
            >
              <View style={styles.bevyPickerButton}>
                <Text style={ styles.postingTo }>Tag: </Text>
                <Text style={{ flex: 1, fontSize: 15, fontWeight: 'bold', color: this.props.tag.color} }>{ this.props.tag.name }</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {
                this.props.newPostNavigator.push(routes.NEWPOST.BEVYPICKER);
              }}
              style={ styles.toBevyPicker }
            >
              <View style={styles.bevyPickerButton}>
                <Text style={ styles.postingTo }>Posting To:</Text>
                <Text style={ styles.bevyName }>{ this.props.selected.name }</Text>
              </View>
            </TouchableHighlight>
          </View>
          <ScrollView style={ styles.input }>
            { this._renderPostImage() }
            <SettingsItem 
              icon={<Icon name='clock' size={18} color='#666' style={{width: 18, height: 18, marginLeft: -6, marginRight: 5}}/>}
              checked={false}
              onPress={() => {
                this.props.newPostNavigator.push(routes.NEWPOST.DATEPICKER);
              }}
              title={this.props.date.toLocaleDateString() + ' at ' + this.props.time.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}).replace(/(:\d{2}| )$/, "")}
            />
            <View style={styles.location}>
              <Icon name='location' size={20} color='#666' style={{width: 20, height: 20, marginLeft: -3}}/>
              <TextInput 
                ref='location'
                style={styles.locationInput}
                placeholder='Location'
                onChange={(ev) => {
                  this.setState({
                    location: ev.nativeEvent.text
                  });
                }}
              />
            </View>
            <View style={styles.moreInfo}>
              <Icon name='information-circled' size={16} color='#666' style={{width: 16, height: 16, marginTop: 12, marginLeft: -5}}/>
              <TextInput 
                ref='info'
                style={styles.moreInfoInput}
                placeholder='More Info'
                multiline={true}
                onChange={(ev) => {
                  this.setState({
                    info: ev.nativeEvent.text
                  });
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  navButtonLeft: {
    flex: 1,
    padding: 10,
  },
  navButtonRight: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  navButtonTextLeft: {
    color: '#fff',
    fontSize: 17,
  },
  navButtonTextRight: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'right'
  },
  navTitle: {
    flex: 2
  },
  navTitleText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  body: {
    flex: 1,
    flexDirection: 'column'
  },
  bevyPicker: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  bevyPickerButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  postingTo: {
    fontSize: 15,
    marginRight: 10
  },
  bevyName: {
    color: '#2CB673',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1
  },
  toBevyPicker: {
    flex: 1,
  },
  input: {
    flex: 1,
    marginBottom: 48,
    backgroundColor: '#fff'
  },
  inputProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  textInput: {
    flex: 1,
    flexDirection: 'row', 
    fontSize: 17,
    height: 40,
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  titleInput: {
    flex: 1,
    fontSize: 26,
    color: '#fff',
    height: 48,
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  contentBar: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: window.width,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    height: 48,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  contentBarItem: {
    height: 30,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center'
  },
  contentBarIcon: {
    width: 30,
    height: 30
  },
  imageOverlay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,.2)',
    width: constants.width,
    height: 50
  },
  bevyPickerList: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column'
  },
  bevyPickerItem: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  bevyPickerImage: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  bevyPickerName: {
    flex: 1,
    textAlign: 'left',
    fontSize: 17,
    paddingLeft: 15
  },
  bevyPickerButton: {
    flexDirection: 'row'
  },
  location: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  locationInput: {
    flex: 1,
    flexDirection: 'row', 
    fontSize: 17,
    height: 40,
    paddingLeft: 0,
    paddingTop: 5
  },
  moreInfo: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flex: 1,
    alignItems: 'flex-start'

  },
  moreInfoInput: {
    flex: 1,
    flexDirection: 'row', 
    fontSize: 17,
    paddingLeft: 5,
    paddingTop: 5,
    height: 250
  }
});

module.exports = CreateEventView;