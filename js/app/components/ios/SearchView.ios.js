/**
 * SearchBar.ios.js
 * @author albert kevin
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight,
  SwitchIOS,
  TabBarIOS,
  ScrollView,
  TextInput
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var SubSwitch = require('./SubSwitch.ios.js');
var SearchUser = require('./SearchUser.ios.js');
var BevyCard = require('./../../../bevy/components/ios/BevyCard.ios.js');
var BevySearchItem = require('./../../../bevy/components/ios/BevySearchItem.ios.js');
var UserSearchItem = require('./../../../user/components/ios/UserSearchItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');
var AppActions = require('./../../../app/AppActions');
var UserActions = require('./../../../user/UserActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var BevyStore = require('./../../../bevy/BevyStore');
var UserStore = require('./../../../user/UserStore');
//var SearchBar = require('./../../../app/components/ios/SearchBar.ios.js');

var BEVY = constants.BEVY;

var SearchView = React.createClass({
  propTypes: {
    searchRoute: React.PropTypes.object,
    searchNavigator: React.PropTypes.object,
  },

  getInitialState() {
    var bevies = BevyStore.getPublicBevies();
    var users = UserStore.getUserSearchResults();
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        .cloneWithRows(bevies),
      userDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        .cloneWithRows(users),
      bevies: BevyStore.getPublicBevies(),
      fetching: false,
      searchQuery: BevyStore.getSearchQuery(),
      userQuery: UserStore.getUserSearchQuery(),
      activeTab: 0
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.SEARCHING, this.handleSearching);
    BevyStore.on(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.SEARCHING, this.handleSearching);
    BevyStore.off(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
  },

  handleSearching() {
    this.setState({
      fetching: true,
      searchQuery: BevyStore.getSearchQuery(),
      //dataSource: []
    });
  },

  handleSearchComplete() {
    console.log('search done for', this.state.searchQuery);
    //console.log(BevyStore.getSearchList());
    var bevies = BevyStore.getSearchList();
    this.setState({
      fetching: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        .cloneWithRows(bevies),
      bevies: BevyStore.getSearchList()
    });
  },

  switchSearchType(index) {
    var data;
    switch(index) {
      case 0:
        // bevy
        AppActions.switchSearchType('bevy');
        data = BevyStore.getSearchList();
        break;
      case 1:
        // user
        AppActions.switchSearchType('user');
        data = UserStore.getUserSearchResults();
        if(_.isEmpty(data)) {
          // no users have been searched for yet
          // so we'll trigger it when we switch to that search type
          UserActions.search('');
        }
        break;
    }
    // repopulate data store with proper results
    this.setState({
      ds: this.state.ds.cloneWithRows(data)
    });
  },
  switchTab(index) {
    this.setState({
      activeTab: 0
    });
    //this.pager.setPage(index);
    this.switchSearchType(index);
  },

  _renderSubSwitch(bevy) {
    var user = this.props.user;
    var subbed = _.find(this.props.user.bevies, function(bevyId){
      return bevyId == bevy._id
    }) != undefined;
    // dont render this if you're an admin
    if(_.contains(bevy.admins, user._id)) return <View/>;
    return (
        <SubSwitch
          subbed={subbed}
          loggedIn={ this.props.loggedIn }
          bevy={bevy}
          user={user}
        />
    );
  },

  componentWillUpdate() {
    /*if(this.props.searchRoute.name == routes.SEARCH.IN.name && !this.state.fetching) {
      // ok, now we're in search.
      // fetch public bevies
      console.log('fetching public');
      BevyActions.fetchPublic();
      this.setState({
        fetching: true
      });
    }*/
  },

  _renderSearchBevies() {
    var bevies = (this.state.bevies)
    var bevyList = [];

    for(var key in bevies) {
      var bevy = bevies[key];
      if(bevy._id == -1) {
        continue;
      }

      bevyList.push(
        <BevyCard
          bevy={bevy}
          key={ 'bevylist:' + bevy._id }
          mainNavigator={this.props.mainNavigator}
        />
      );
    }
    return(
      <ScrollView
        contentContainerStyle={ styles.bevyList }
        automaticallyAdjustContentInsets={true}
        showsVerticalScrollIndicator={true}
      >
        { bevyList }
      </ScrollView>
      );
  },

  switchSearchTab(index) {
    if(index == 0)
      return(
        <View>
        {this._renderSearchBevies()}
        </View>
        );
    else
      return(<SearchUser mainNavigator={this.props.mainNavigator}/>);
  },

  render() {
    return (
      <View style={styles.container}>          
        <View style={ styles.topBarContainer }>
          <View style={{
            height: StatusBarSizeIOS.currentHeight,
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <Text style={ styles.title }>
              Search
            </Text>
          </View>
        </View>

        <View style={styles.searchBox}>
         <TextInput
             ref='ToInput'
             style={ styles.Input }
             placeholder='search...'
             placeholderTextColor='#AAA'
             underlineColorAndroid='#FFF'
           />
        </View>

        <View style={styles.tabBar}>
          <TouchableHighlight
            onPress = {() =>{
              this.setState({activeTab: 0});
            }}
            style={styles.searchTab}
            underlayColor = 'rgba(0,0,0,.1)'
          >
            <Text>bevies</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress = {() =>{
              this.setState({activeTab: 1});
            }}
            style={styles.searchTab}
            underlayColor = 'rgba(0,0,0,.1)'
          >
            <Text>users</Text>
          </TouchableHighlight>
        </View>
        {this.switchSearchTab(this.state.activeTab)}
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    paddingTop: 0,
    backgroundColor: '#EEE',
  },
  Input: {
    backgroundColor: '#FFF',
    height: 36
  },

  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673',
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  tabBar: {
    width: constants.width,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
    borderBottomWidth: 1
  },
  searchBox: {
    backgroundColor: '#FFF',
    width: constants.width, 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingTop: 6,
    paddingHorizontal: 10
  },
  searchTab: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchTabText: {
    color: '#EEE'
  },
  searchTabTextActive: {
    color: '#2CB673'
  },
  searchPage: {
    flex: 1
  },
  searchItemList: {
    flex: 1,
    flexDirection: 'column'
  },
  bevyRow: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF'
  },
  publicBevyTitle: {
    fontSize: 17,
    textAlign: 'center'
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
    height: 47,
    padding: 10,
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
  bevyButton: {
    flex: 2
  },
  bevyList: {
    flexDirection: 'column',
    width: constants.width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 0
  }
});

module.exports = SearchView;
