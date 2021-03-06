/**
 * PostList.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  PullToRefreshViewAndroid,
  ToastAndroid,
  ProgressBarAndroid
} = React;
var BevyBar = require('./../../../bevy/components/android/BevyBar.android.js');
var NewPostCard = require('./NewPostCard.android.js');
var Post = require('./Post.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var POST = constants.POST;
var PostStore = require('./../../../post/PostStore');
var PostActions = require('./../../../post/PostActions');
var BevyActions = require('./../../../bevy/BevyActions');
var BevyStore = require('./../../../bevy/BevyStore');
var BEVY = constants.BEVY;

var PostList = React.createClass({
  propTypes: {
    allPosts: React.PropTypes.array,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    showNewPostCard: React.PropTypes.bool,
    renderHeader: React.PropTypes.bool,
    activeBevy: React.PropTypes.object,
    activeTags: React.PropTypes.array
  },

  getDefaultProps() {
    return {
      allPosts: [],
      showNewPostCard: false,
      renderHeader: true,
      activeBevy: {},
      activeTags: ['-1'] // default is -1, which means show all posts
    }
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    var posts = this.props.allPosts;
    posts = this.prunePosts(posts);
    return {
      posts: ds.cloneWithRows(posts),
      loading: _.isEmpty(posts), // if there are no posts to display,
                                // then they're probably loading at first
      navHeight: 0,
      scrollY: 0
    };
  },

  componentDidMount() {
    PostStore.on(POST.LOADING, this._onPostsLoading);
    PostStore.on(POST.LOADED, this._onPostsLoaded);
    BevyStore.on(BEVY.SWITCHED, this._onBevySwitched);
  },
  componentWillUnmount() {
    PostStore.off(POST.LOADING, this._onPostsLoading);
    PostStore.off(POST.LOADED, this._onPostsLoaded);
    BevyStore.off(BEVY.SWITCHED, this._onBevySwitched);
  },

  componentWillReceiveProps(nextProps) {
    var posts = nextProps.allPosts;
    posts = this.prunePosts(posts);
    this.setState({
      posts: this.state.posts.cloneWithRows(posts)
    });
  },

  requestJoin() {
    // send action
    BevyActions.requestJoin(this.props.activeBevy, this.props.user);
  },

  _onBevySwitched() {
    this.setState({
      navHeight: 0
    })
  },

  _onPostsLoading() {
    this.setState({
      loading: true
    });
  },
  _onPostsLoaded() {
    this.setState({
      loading: false
    });
  },

  prunePosts(posts) {
    posts = _.filter(posts, (post) => {
      if(this.props.activeBevy._id == '-1') return true;
      if(post.tag == undefined) return false;
      return _.findWhere(this.props.activeTags, { name: post.tag.name }) != undefined;
    });
    return posts;
  },

  onScroll(y) {
    // if theres nothing to compare it to yet, just set it and return
    if(this.state.scrollY == null || y < 0) {
      this.setState({
        scrollY: y,
        navHeight: 0
      });
      return;
    }
    //get the change in scroll
    var diff = (this.state.scrollY - y);
    //modify the navheight based on that
    var navHeight = (this.state.navHeight - diff);
    //set bounds
    if(navHeight < 0) navHeight = 0;
    if(navHeight > 45) navHeight = 45;
    //update data
    this.setState({
      scrollY: y,
      navHeight: navHeight
    })
  },

  onRefresh() {
    PostActions.fetch(this.props.activeBevy._id);
  },

  _renderHeader() {
    if(!this.props.renderHeader) return <View />;
    else return (
      <View style={ styles.header }>
        <BevyBar
          activeBevy={ this.props.activeBevy }
          bevyNavigator={ this.props.bevyNavigator }
          bevyRoute={ this.props.bevyRoute }
          height={ this.state.navHeight }
          disappearing={ true }
        />
      </View>
    );
  },

  _renderNewPostCard() {
    if(!this.props.showNewPostCard) return <View />;
    else return (
      <View style={{
        marginBottom: 10,
        marginTop: 45
      }}>
        <NewPostCard
          user={ this.props.user }
          loggedIn={ this.props.loggedIn }
          mainNavigator={ this.props.mainNavigator }
        />
      </View>
    );
  },

  _renderNoPosts() {
    if(_.isEmpty(this.props.allPosts) && !this.state.loading) {
      return (
        <View style={ styles.noPostsContainer }>
          <Text style={ styles.noPosts }>No Posts</Text>
        </View>
      );
    }
  },

  render() {
    if(this.props.activeBevy._id != -1 // if not the frontpage
      && this.props.activeBevy.settings.privacy == 1
      && !_.contains(this.props.user.bevies, this.props.activeBevy._id)) {
      // if this is a private bevy that the user is not a part of
      // dont show any posts. only show a request join view
      return (
        <View style={ styles.privateContainer }>
          <BevyBar
            activeBevy={ this.props.activeBevy }
            bevyNavigator={ this.props.bevyNavigator }
            bevyRoute={ this.props.bevyRoute }
            showActions={ true }
          />
          <Image
            style={ styles.privateImage }
            source={ require('./../../../images/private.png') }
          />
          <Text style={ styles.privateText }>
            This Bevy is Private
          </Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.requestJoin }
          >
            <View style={ styles.requestJoinButton }>
              <Text style={ styles.requestJoinButtonText }>
                Request to Join this Bevy
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      );
    }
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column'
      }}>
        <PullToRefreshViewAndroid
          style={{
            flex: 1
          }}
          refreshing={ this.state.loading }
          onRefresh={ this.onRefresh }
        >
          <ListView
            dataSource={ this.state.posts }
            style={ styles.postList }
            onScroll={(data) => {
              this.onScroll(data.nativeEvent.contentOffset.y);
            }}
            renderHeader={ this._renderNewPostCard }
            scrollRenderAheadDistance={ 300 }
            removeClippedSubviews={ true }
            initialListSize={ 10 }
            pageSize={ 10 }
            renderRow={post => {
              if(this.props.activeBevy._id == -1 &&
                post.pinned) return <View />;
              return (
                <Post
                  key={ 'post:' + post._id }
                  post={ post }
                  mainNavigator={ this.props.mainNavigator }
                  mainRoute={ this.props.mainRoute }
                  user={ this.props.user }
                  loggedIn={ this.props.loggedIn }
                  activeBevy={ this.props.activeBevy }
                />
              );
            }}
          />
        </PullToRefreshViewAndroid>
        { this._renderNoPosts() }
        { this._renderHeader() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  postList: {
    flex: 1
  },
  header: {
    flexDirection: 'column',
    width: constants.width,
    position: 'absolute',
    top: 0
  },
  noPostsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  noPosts: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    color: '#AAA'
  },
  privateContainer: {
    flex: 1,
    alignItems: 'center'
  },
  privateImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 15
  },
  privateText: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 22,
    marginBottom: 15
  },
  requestJoinButton: {
    backgroundColor: '#2CB673',
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2
  },
  requestJoinButtonText: {
    color: '#FFF'
  }
});

module.exports = PostList;
