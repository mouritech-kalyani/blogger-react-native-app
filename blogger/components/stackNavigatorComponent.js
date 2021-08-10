import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Signin from './signin'
import Signup from './signup'
import ShowComments from './showComments'
import TabNavigatorComponent from './tabNavigatorComponent'
import AddBlogs from './addBlogs'
const StackNavigatorComponent = createStackNavigator({
   Signin:{
       screen:Signin,
       navigationOptions:{
           title:'Log in'
       }
   },
   Signup:{
       screen:Signup,
       navigationOptions:{
        title:'Sign Up'
    }
   },
   TabNavigator:{
       screen:TabNavigatorComponent,
       navigationOptions:{
           title:'Blogs',
           headerLeft: null
       }
   },
   Comments:{
       screen:ShowComments,
       navigationOptions:{
           title:'Comments'
       }
   },
   AddBlogs:{
       screen:AddBlogs,
       navigationOptions:{
           title:'Add Blog'
       }
   }
})

export default createAppContainer(StackNavigatorComponent)
