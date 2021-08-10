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
  ScrollView,
  Pressable,
} from 'react-native';
import {Div} from 'reactnative-ui-bootstrap';
import * as ImagePicker from 'react-native-image-picker';
import noDpImage from '../utils/constants';
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

  const checkingChangeInForm = () => {
    console.log('old pic is',profilePic1,' new is ',profilePic)
    if (
      newFullName !== '' ||
      newCompanyName !== '' ||
      newPassword !== '' ||
      profilePic !== null
    ) {
      setchanges('Save Changes');
    }else{
      setchanges('Edit');
      alert('Please do chages')
    }
    
  };
  const getAllCommentsFun = blogId => {
    navigation.navigate('Comments', {blogId: blogId, userId: currentUserId});
  };
  function selectFile() {
    // console.log('cam clicked');
    // var options = {
    //   title: 'Select Image',
    //   customButtons: [
    //     {
    //       name: 'customOptionKey',
    //       title: 'Choose file from Custom Option',
    //     },
    //   ],
    //   storageOptions: {
    //     skipBackup: true,
    //     path: 'images',
    //   },
    // };
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        setprofilePic(source);
      }
    });
    // ImagePicker.launchImageLibrary(options,(res) => {
    //   console.log('Response = ', res);

    //   if (res.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else if (res.error) {
    //     console.log('ImagePicker Error: ', res.error);
    //   } else if (res.customButton) {
    //     console.log('User tapped custom button: ', res.customButton);
    //     alert(res.customButton);
    //   } else {
    //     const source = {uri: 'data:image/jpeg;base64,' + res.data, isStatic: true};

    //     // or a reference to the platform specific asset location
    //     if (Platform.OS === 'ios') {
    //        source = {uri: res.uri.replace('file://', ''), isStatic: true};
    //     } else {
    //        source = {uri: res.uri, isStatic: true};
    //     }
    //     setprofilePic(source);
    //     console.log('profile isss',profilePic)
    //   }
    // });
  }
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
                { profilePic === 'null' ? 
                <Image source={noDpImage}  style={{
                  width: 90,
                  height:50,
                  borderRadius: 50,
                  marginTop: 0,
                }}/>
                :
                <Image source={profilePic}  style={{
                  width: 90,
                  borderRadius: 50,
                  marginTop: 0,
                }}/>  
                }
              </Div>
              <Div className="col">
                <Button title="Selet image" onPress={() => selectFile()} />
              </Div>
              {/* <TouchableOpacity onPress={()=>selectFile} >
              <Text style={{fontSize:20,height:50,marginTop:20}}>Select File</Text> */}
              {/* <Button title="select file" onPress={selectFile}/> */}
              {/* </TouchableOpacity> */}
              {/* <Div className='col'>
            <Pressable onPress={selectFile}>
            <Icon name='camera' size={30}/>
            </Pressable>
         
          </Div> */}

              {/* <TouchableOpacity onPress={selectFile}>
              <Text style={{fontSize:20,height:50,marginTop:20}}>Select File</Text>
            </TouchableOpacity> */}
              <Div className="col">
                {/* <Image
            source={{
              uri: 'data:image/jpeg;base64,' + resourcePath.data,
            }}
            style={{ width: 100, height: 100 }}
          /> */}
                {/* <Image
            source={{ uri: resourcePath}}
            style={{ width: 200, height: 200 }}
          /> */}
                {/* <Text style={{ alignItems: 'center' }}>
            {resourcePath.uri}
          </Text> */}
              </Div>
            </Div>
            <Div className="col">
              <Text style={{fontSize: 20, height: 50, marginTop: 80}}>
                {email}
              </Text>
              <TextInput
                value={fullName}
                editable={true}
                style={styles.inputs}
                onChangeText={e => setNewFullName(e)}
              />
              <TextInput
                value={companyName}
                editable={true}
                style={styles.inputs}
                onChangeText={e => setnewCompanyName(e)}
              />
              <TextInput
                value={password}
                editable={true}
                style={styles.inputs}
                onChangeText={e => setnewPassword(e)}
              />
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
});
export default Profile;
