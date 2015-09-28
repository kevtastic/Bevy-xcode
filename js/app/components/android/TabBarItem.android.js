/**
 * TabBarItem.android.js
 * @author  albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;

var noop = function() {};

var TabBarItem = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    content: React.PropTypes.node,
    tab: React.PropTypes.string,
    activeTab: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      onPress: noop,
      content: <Text>Tab</Text>,
      tab: '',
      activeTab: ''
    };
  },

  getInitialState() {
    return {
      active: this.props.activeTab == this.props.tab
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      active: nextProps.activeTab == nextProps.tab
    });
  },

  _renderContent() {
    if(typeof this.props.content === 'string') {
      return <Text>{ this.props.content }</Text>
    } else {
      return this.props.content;
    }
  },

  render() {
    var buttonStyles = (this.state.active)
    ? [styles.tabBarItem, { backgroundColor: '#2CB673' }]
    : [styles.tabBarItem, { backgroundColor: '#FFF', }];
    return (
      <TouchableNativeFeedback
        onPress={ this.props.onPress }
      >
        <View style={ buttonStyles }>
          { this._renderContent() }
        </View>
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  tabBarItem: {
    height: 48,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = TabBarItem;