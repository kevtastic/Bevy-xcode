/**
 * Event.ios.js
 * kevin made this
 * i will never drink again
 */
 'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var ImageOverlay = require('./ImageOverlay.ios.js');
var PostActionList = require('./PostActionList.ios.js');
var Collapsible = require('react-native-collapsible');


var constants = require('./../../constants');
var POST = constants.POST;
var routes = require('./../../routes');
var timeAgo = require('./../../shared/helpers/timeAgo');
var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');

var Event = React.createClass({
  propTypes: {
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    inCommentView: React.PropTypes.bool,
    post: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      inCommentView: false,
      post: {}
    };
  },

  getInitialState() {
    return {
      post: this.props.post,
      overlayVisible: false,
      voted: this.props.post.voted,
      collapsed: true
    };
  },

  componentDidMount() {
    PostStore.on(POST.CHANGE_ONE + this.props.post._id, () => {
      this.setState({
        post: PostStore.getPost(this.props.post._id)
      });
    });
  },

  componentWillUnmount() {
    PostStore.off(POST.CHANGE_ONE + this.props.post._id);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      post: nextProps.post
    });
  },

  countVotes: function() {
    var sum = 0;
    this.state.post.votes.forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  },

  _renderPostTitle() {
    var date = new Date(this.state.post.event.date);
    if(_.isEmpty(this.state.post.title)) return null;
    return (
      <View style={styles.body}>
        <TouchableHighlight
          underlayColor='rgba(0,0,0,0.1)'
          onPress={() => {
            // go to comment view
            // return if we're already in comment view
            if(this.props.inCommentView) return;

            var commentRoute = routes.MAIN.COMMENT;
            commentRoute.postID = this.state.post._id;
            this.props.mainNavigator.push(commentRoute);
        }}>
          <View>
            <Text style={styles.eventDetail}>
              { date.toLocaleDateString() }
            </Text>
            <Text style={styles.eventDetail}>
              { date.toLocaleTimeString() }
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='rgba(0,0,0,0.1)'
          onPress={() => {
            // go to comment view
            // return if we're already in comment view
            if(this.props.inCommentView) return;

            var commentRoute = routes.MAIN.COMMENT;
            commentRoute.postID = this.state.post._id;
            this.props.mainNavigator.push(commentRoute);
        }}>
          <View style={styles.titleTextColumn}>
            <Text style={styles.bodyText}>
              { this.state.post.title }
            </Text>
            <Text style={styles.descriptionText}>
              { this.state.post.event.description }
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='rgba(0,0,0,0.1)'
          onPress={() => {
            var mapRoute = routes.MAIN.MAP;
            mapRoute.location = this.state.post.event.location;
            this.props.mainNavigator.push(mapRoute);
        }}>
          <Text style={styles.eventDetail}>
            { this.state.post.event.location }
          </Text>
        </TouchableHighlight>
      </View>
    );
  },

  _renderImageOverlay() {
    if(this.state.post.images.length <= 0) return null;
    return (
      <ImageOverlay 
        images={ this.state.post.images }
        isVisible={ this.state.overlayVisible } 
      />
    );
  },

  _renderPostImage() {
    var imageURL = _.isEmpty(this.state.post.images[0])? '/img/default_group_img.png' : this.state.post.images[0];

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,0.1)'
        onPress={() => {
          // go to comment view
          // return if we're already in comment view
          if(this.props.inCommentView) return;

          var commentRoute = routes.MAIN.COMMENT;
          commentRoute.postID = this.state.post._id;
          this.props.mainNavigator.push(commentRoute);
        }}
      >
        <Image
          style={ styles.postImage }
          source={{ uri: imageURL }}
          resizeMode='cover'
        />
      </TouchableHighlight>
    );
  },

  render: function() {
    var post = this.state.post;

    return (
      <View style={styles.postCard}>

        { this._renderImageOverlay() }
        { this._renderPostImage() }
        {/*<View style={styles.titleRow}>
          <Image 
            style={styles.titleImage}
            source={{ uri: post.author.image_url }}
          />
          <View style={styles.titleTextColumn}>
            <Text numberOfLines={ 1 } style={styles.titleText}>
              { post.author.displayName } • { post.bevy.name }
            </Text>
            <Text style={styles.subTitleText}>
              { timeAgo(Date.parse(post.created)) }
            </Text>
          </View>
        </View>*/}
        
        { this._renderPostTitle() }
        <View style={styles.postActionsRow}>
          <TouchableHighlight 
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.actionTouchable, { flex: 2 } ]}
            onPress={() => {
              PostActions.vote(post._id);
              this.setState({
                voted: !this.state.voted
              });
            }}
          >
            <View style={[ styles.actionTouchable, { flex: 1 } ]}>
              <Text style={ styles.pointCountText }>
                { this.countVotes() }
              </Text>
              <Icon
                name={ (this.state.voted) ? 'ios-heart' : 'ios-heart-outline' }
                size={20}
                color='#757d83'
                style={styles.actionIcon}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight 
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.actionTouchable, { flex: 2 } ]}
            onPress={() => {
              // go to comment view
              // return if we're already in comment view
              if(this.props.inCommentView) return;

              var commentRoute = routes.MAIN.COMMENT;
              commentRoute.postID = this.state.post._id;
              this.props.mainNavigator.push(commentRoute);
            }}
          >
            <View style={[ styles.actionTouchable, { flex: 1 } ]}>
              <Text style={ styles.commentCountText }>
                { post.comments.length }
              </Text>
              <Icon
                name='ios-chatbubble-outline'
                size={20}
                color='#757d83'
                style={styles.actionIcon}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight 
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.actionTouchable, { flex: 1 } ]}
            onPress={() => {
              this.setState({
                collapsed: !this.state.collapsed
              })
            }}
          >
            <Icon
              name='ios-more'
              size={20}
              color='#757d83'
              style={styles.actionIcon}
            />
          </TouchableHighlight>
        </View>
        <Collapsible collapsed={this.state.collapsed} >
          <PostActionList post={ this.state.post } { ...this.props } />
        </Collapsible>
      </View>
    );
  },
});

var sideMargins = 10;
var cardWidth = constants.width - sideMargins * 2;

var styles = StyleSheet.create({
  postCard: {
    flexDirection: 'column',
    width: cardWidth,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: sideMargins,
    marginRight: sideMargins,
    paddingTop: 0,
    backgroundColor: 'white',
    borderRadius: 2,
    shadowColor: '#000',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  {width: 0, height: 0}
  },
  titleRow: {
    flexDirection: 'row',
    width: cardWidth,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 8,
    marginBottom: 0
  },
  titleImage: {
    width: 25,
    height: 25,
    backgroundColor: '#000',
    borderRadius: 12.5,
    marginLeft: 0
  },
  titleTextColumn: {
    flex: 2,
    width: cardWidth - 40 - 10 - 16 - 100,
    flexDirection: 'column',
    height: 26,
    marginLeft: 5
  },
  titleText: {
    width: cardWidth - 40 - 10 - 16,
    color: '#282929',
    fontSize: 12
  },
  subTitleText: {
    fontSize: 9,
    color: '#282929'
  },

  body: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 10,
    paddingTop: 5,
    fontSize: 20
  },
  bodyText: {
    fontSize: 15,
    color: '#393939',
    fontWeight: 'bold'
  },
  descriptionText: {
    color: '#777',
    fontSize: 12
  },
  eventDetail: {
    color: '#777',
    fontSize: 12,
    width: 70
  },

  postImage: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  postImageCountText: {
    marginTop: 5,
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#eee',
    fontSize: 17
  },

  postActionsRow: {
    height: 36,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  pointCountText: {
    color: '#757d83',
    fontSize: 15,
    marginRight: 10
  },
  commentCountText: {
    color: '#757d83',
    fontSize: 15,
    marginRight: 10
  },
  actionTouchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 36
  },
  actionIcon: {
    width: 20,
    height: 36
  }
});

module.exports = Event;