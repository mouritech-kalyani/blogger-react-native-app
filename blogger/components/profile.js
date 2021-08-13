import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import {Div} from 'reactnative-ui-bootstrap';
import * as ImagePicker from 'react-native-image-picker';
import {noDpImage} from '../utils/constants';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getAllUsersBlog, allBlogsApi} from '../utils/constants';

const Profile = ({navigation}) => {
  const [changes, setchanges] = useState('Edit');
  const [myProfile, setmyProfile] = useState([]);
  const [newFullName, setNewFullName] = useState('');
  const [newCompanyName, setnewCompanyName] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [isLoading, setisLoading] = useState(true);
  const [userBlogs, setuserBlogs] = useState([]);
  const [isPasswordVisible, setisPasswordVisible] = useState(false);
  const currentUserId = navigation.state.params.userId;
  const fullName = navigation.state.params.fullName;
  const password = navigation.state.params.password;
  const email = navigation.state.params.userName;
  const companyName = navigation.state.params.companyName;
  const profilePic1 = navigation.state.params.profilePic;
  const [profilePic, setprofilePic] = useState(profilePic1);
  useEffect(() => {
    axios.get(`${getAllUsersBlog}/${currentUserId}`).then(res => {
      setuserBlogs(res.data);
      setisLoading(false);
    });
  }, [userBlogs]);

  const checkingChangeInForm = async() => {
    setisLoading(true);
    console.log('profile is', profilePic);
    if (
      newFullName === '' &&
      newCompanyName === '' &&
      newPassword === '' &&
      profilePic === null
    ) {
      setisLoading(false)
      alert('Changes required');
    } else {
      console.log(
        'final data is',
        newFullName,
        newCompanyName,
        newPassword,
        profilePic,
        ' old is ',
        fullName,
        password,
        companyName,
      );
      setisLoading(false);
     await axios
        .put(getAllUsersBlog, {
          userId: currentUserId,
          fullName: newFullName === '' ? fullName : newFullName,
          password: newPassword === '' ? password : newPassword,
          companyName: companyName === '' ? companyName : newCompanyName,
          username:email,
          profilePic: profilePic === null ? profilePic1 : profilePic.uri,
        })
        .then(res => {
          console.log('resss is',res.data);
          if (res) {
            alert('Record updated');
          } else {
            alert('Error! Please try again');
          }
        })
        .catch(error => {
          console.log('errorr',error)
          alert('Error! Please try again ');
        });
    }
  };
  const getAllCommentsFun = blogId => {
    navigation.navigate('Comments', {blogId: blogId, userId: currentUserId});
  };
  const options = {
    title: 'Select Image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const selectFile = () => {
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log('response iss', response);
        setprofilePic(response.assets[0]);
      }
    });
  };
  const deleteBlog = id => {
    setisLoading(true);
    axios
      .delete(`${allBlogsApi}/${id}`)
      .then(res => {
        if (res) {
          alert('Blog Deleted');
          setisLoading(false);
        } else {
          alert('Error ! Please Try Again');
          setisLoading(false);
        }
      })
      .catch(error => {
        setisLoading(false);
        alert('Something went wrong. Please try again');
      });
  };
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator animating={isLoading} size={50} color="#0f66f2" />
      ) : (
        <ScrollView>
          <View style={styles.lists}>
            <Div className="row justify-content-space-evenly">
              <Div className="col">
                {profilePic === null ? (
                  <Image source={{uri: noDpImage}} style={styles.imageStyle} />
                ) : (
                  <Image source={profilePic} style={styles.imageStyle} />
                )}
              </Div>
              <Div className="col">
                <Button title="Selet image" onPress={selectFile} />
              </Div>
              {/* <Div className="col"> */}
              {/* <Image
            source={{
              uri: 'data:image/jpeg;base64,' + resourcePath.data,
            }}
            style={{ width: 100, height: 100 }}
          /> */}
            </Div>
            <Div className="col">
              <TextInput
                value={email}
                style={{fontSize: 20, height: 50, marginTop: 0}}
              />
              <TextInput
                defaultValue={fullName}
                editable={true}
                style={styles.inputs}
                onChangeText={e => setNewFullName(e)}
              />
              <TextInput
                defaultValue={companyName}
                editable={true}
                style={styles.inputs}
                onChangeText={e => setnewCompanyName(e)}
              />
              <Div>
                <TextInput
                  defaultValue={password}
                  secureTextEntry={!isPasswordVisible}
                  editable={true}
                  style={styles.inputs}
                  onChangeText={e => setnewPassword(e)}
                />
                <Icon
                  name={isPasswordVisible ? 'eye' : 'eye-slash'}
                  style={styles.toggleEye}
                  size={25}
                  onPress={() => setisPasswordVisible(!isPasswordVisible)}
                />
              </Div>
            </Div>

            <View style={{marginTop: 10}}>
              <Button title={changes} onPress={checkingChangeInForm} />
            </View>
            <View style={{marginTop: 10}}>
              <Button
                title="Add Blog"
                onPress={() =>
                  navigation.navigate('AddBlogs', {userId: currentUserId})
                }
              />
            </View>
          </View>
          <View>
            <FlatList
              data={userBlogs}
              inverted={1}
              keyExtractor={items => items.blogId}
              renderItem={({item}) => {
                return (
                  <View style={styles.lists1}>
                    <Div className="row">
                      <Div className="col">
                        <Text style={{fontSize: 15}}>{item.blogTime}</Text>
                      </Div>

                      <Div className="col">
                        <Pressable
                          onPress={() =>
                            navigation.navigate('AddBlogs', {
                              userId: currentUserId,
                              blogId: item.blogId,
                              description: item.description,
                              likes: item.likes,
                            })
                          }>
                          <Icon
                            name="edit"
                            size={20}
                            style={{marginLeft: 100}}
                          />
                        </Pressable>
                      </Div>
                      <Div className="col">
                        <Pressable onPress={() => deleteBlog(item.blogId)}>
                          <Icon name="trash" size={20} />
                        </Pressable>
                      </Div>
                    </Div>

                    <Text style={{fontSize: 18}}>{item.description}</Text>
                    <Div className="row">
                      <Div className="row">
                        <Icon
                          name="heart"
                          color="red"
                          size={20}
                          style={{marginLeft: 40, marginTop: 0, paddingTop: 10}}
                        />
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            paddingLeft: 10,
                            marginTop: -2,
                            position: 'absolute',
                            paddingTop: 10,
                          }}>
                          {item.likes}
                        </Text>
                      </Div>
                      <Div className="row">
                        <Pressable
                          onPress={() => {
                            getAllCommentsFun(item.blogId);
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              //   fontWeight: 'bold',
                              paddingRight: 10,
                              marginTop: 0,
                              paddingTop: 10,
                            }}>
                            Comments
                          </Text>
                          <Icon
                            name="comment"
                            size={20}
                            style={{marginLeft: 100, marginTop: -25}}
                          />
                        </Pressable>
                      </Div>
                    </Div>
                  </View>
                );
              }}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  lists: {
    flexDirection: 'column',
    width: 340,
    backgroundColor: 'white',
    marginVertical: 6,
    borderRadius: 10,
    alignSelf: 'center',
    padding: 10,
  },
  imageStyle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginTop: 0,
  },
  lists1: {
    flexDirection: 'column',
    width: 340,
    backgroundColor: 'white',
    marginVertical: 6,
    borderRadius: 10,
    alignSelf: 'center',
    padding: 10,
  },
  inputs: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    fontSize: 16,
    height: 38,
    marginVertical: 5,
  },
  toggleEye: {
    position: 'absolute',
    color: 'black',
    marginTop: 10,
    marginLeft: 280,
  },
});
export default Profile;
