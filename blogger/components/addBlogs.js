import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Button,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {Div} from 'reactnative-ui-bootstrap';
import axios from 'axios';
import {allBlogsApi} from '../utils/constants';

const AddBlogs = ({navigation}) => {
  const [description, setDescription] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const currentUserId = navigation.state.params.userId;
  const descriptionProp = navigation.state.params.description;
  const blogId = navigation.state.params.blogId;
  const likes = navigation.state.params.likes;
  const addBlog = () => {
    setisLoading(true)
    if (description === '') {
      alert('Please add your blog');
    } else {
      const newDate = new Date();
      const day = ('0' + newDate.getDate()).slice(-2);
      const mon = ('0' + (newDate.getMonth() + 1)).slice(-2);
      const year = newDate.getFullYear();
      const blogTime = year + '-' + mon + '-' + day;
      const likes = 0;
      console.log('blogtime', blogTime);
      console.log('all data is', currentUserId, description, blogTime, likes);
      axios
        .post(allBlogsApi, {
          blogTime: blogTime,
          description: description,
          likes: likes,
          user: {
            userId: currentUserId,
          },
        })
        .then(res => {
            setisLoading(false)
          if (res) {
            navigation.navigate('Profile',{userId:currentUserId})
          } else {
            alert('Error! Please try again');
          }
        })
        .catch(error => {
          alert('Error! Please try again');
        });
    }
  };
  const updateBlog = () => {
      setisLoading(true)
      const newDate = new Date();
      const day = ('0' + newDate.getDate()).slice(-2);
      const mon = ('0' + (newDate.getMonth() + 1)).slice(-2);
      const year = newDate.getFullYear();
      const blogTime = year + '-' + mon + '-' + day;
    console.log('update blog', blogId, currentUserId, descriptionProp);
    axios
      .put(allBlogsApi, {
        blogTime: blogTime,
        description: description,
        likes: likes,
        blogId: blogId,
        user: {
          userId: currentUserId,
        },
      })
      .then(res => {
        setisLoading(false)
        if (res) {
            navigation.navigate('Profile',{userId:currentUserId})
        } else {
          setisLoading(false);
          alert('Error! Please try again');
        }
      })
      .catch(error => {
        setisLoading(false);
        alert('Error! Please try again');
      });
  };
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator animating={isLoading} size={50} color="#0f66f2" />
      ) : (
        <View>
          <Div class="row">
            <TextInput
              placeholder="Write blog from here.."
              style={{
                borderRadius: 1,
                borderWidth: 1,
                borderColor: 'grey',
                marginTop: 20,
                marginBottom: 10,
              }}
              defaultValue={
                descriptionProp !== undefined ? descriptionProp : description
              }
              onChangeText={e => setDescription(e)}
            />
            <Button
              title={descriptionProp !== undefined ? 'Edit Blog' : 'Add Blog'}
              onPress={
                descriptionProp !== undefined && blogId !== undefined
                  ? updateBlog
                  : addBlog
              }
            />
          </Div>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  lists: {
    flexDirection: 'column',
    flex: 1,
    width: 340,
    backgroundColor: 'white',
    marginVertical: 6,
    borderRadius: 10,
    alignSelf: 'center',
    padding: 10,
  },
  noBlogs: {
    alignSelf: 'center',
    marginVertical: 200,
  },
  names: {
    fontSize: 20,
    marginLeft: 0,
  },
  companyStyle: {
    marginLeft: 70,
    fontSize: 15,
    marginTop: -15,
    marginBottom: 10,
  },
});
export default AddBlogs;
