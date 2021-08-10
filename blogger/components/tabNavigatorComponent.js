import React from 'react';
import {createAppContainer} from 'react-navigation';
// import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AllBlogs from './allBlogs';
import AllUsers from './allUsers';
import Profile from './profile';
import {Pressable} from 'react-native';

const TabNavigatorComponent = createBottomTabNavigator({
  Blogs: {
    screen: navigation => <AllBlogs {...navigation} />,
    navigationOptions: {
      tabBarLabel: 'All Blogs',
      tabBarIcon: () => <Icon name="list-alt" size={20} />,
    },
  },
  Users: {
    screen: navigation => <AllUsers {...navigation} />,
    navigationOptions: {
      tabBarLabel: 'Users',
      tabBarIcon: () => <Icon name="users" size={20} />,
    },
  },
  Profile: {
    screen: navigation => <Profile {...navigation} />,
    navigationOptions: {
      tabBarLabel: 'My Profile',
      headerRight: () => (
          <Icon
            name="signout"
            size={20}
            onPress={navigation.navigate('signin')}
          />
      ),
      tabBarIcon: () => <Icon name="user" size={20} />,
    },
  },
});
export default createAppContainer(TabNavigatorComponent);
