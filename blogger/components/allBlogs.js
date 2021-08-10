import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Div} from 'reactnative-ui-bootstrap';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {allBlogsApi} from '../utils/constants';

const AllBlogs = ({navigation}) => {
  const [userBlogs, setuserBlogs] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const currentUserId = navigation.state.params.userId;

  useEffect(() => {
    axios.get(`${allBlogsApi}/${currentUserId}`).then(res => {
      setuserBlogs(res.data);
      setisLoading(false);
    });
  }, [currentUserId, isLoading]);

  const likeBlogFunction = (blogId, desc, time, likes, userId) => {
    var like = likes + 1;
    setisLoading(true);
    axios
      .put(`${allBlogsApi}`, {
        user: {
          userId: userId,
        },
        description: desc,
        blogTime: time,
        likes: like,
        blogId: blogId,
      })
      .then(res => {
        setisLoading(false);
      });
  };
  const getAllCommentsFun = blogId => {
    navigation.navigate('Comments', {blogId: blogId, userId: currentUserId});
  };
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator animating={isLoading} size={50} color="#0f66f2" />
      ) : userBlogs.length <= 0 ? (
        <ScrollView>
          <View style={styles.noBlogs}>
            <Text style={{fontSize: 20}}>
              Please follow the user to see blogs
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={userBlogs}
          inverted={1}
          keyExtractor={items => items.blogId}
          renderItem={({item}) => {
            return (
              <View style={styles.lists}>
                <Div className="row">
                  <Div className="col">
                    <Image
                      source={
                        item.user.profilePic !== null
                          ? {uri: item.user.profilePic}
                          : {
                              uri: 'https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg',
                            }
                      }
                      style={{
                        width: 50,
                        height: 40,
                        borderRadius: 50,
                        marginTop: 0,
                      }}
                    />
                  </Div>
                  <Div className="col">
                    <Text style={styles.names}>{item.user.fullName} </Text>
                  </Div>

                  <Div className="col">
                    <Text style={{fontSize: 15}}>{item.blogTime}</Text>
                  </Div>
                </Div>
                <Text style={styles.companyStyle}>{item.user.companyName}</Text>

                <Text style={styles.names}>{item.description}</Text>
                <Div className="row">
                  <Div className="row">
                    <Pressable
                      onPress={() => {
                        likeBlogFunction(
                          item.blogId,
                          item.description,
                          item.blogTime,
                          item.likes,
                          item.user.userId,
                        );
                      }}>
                      <Icon
                        name="heart"
                        color='red'
                        size={25}
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
                    </Pressable>
                  </Div>
                  <Div className="row">
                    <Pressable
                      onPress={() => {
                        getAllCommentsFun(item.blogId);
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                        //   fontWeight: 'bold',
                          paddingRight: 10,
                          marginTop: 0,
                          paddingTop: 10,
                        }}>
                        Comments
                      </Text>
                      <Icon
                        name="comment"
                        size={25}
                        style={{marginLeft: 100, marginTop: -25}}
                      />
                    </Pressable>
                  </Div>
                </Div>
              </View>
            );
          }}
        />
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
    marginVertical: 240,
  },
  names: {
    fontSize: 20,
  },
  companyStyle: {
    marginLeft: 70,
    fontSize: 18,
    marginTop: -15,
    marginBottom: 10,
  },
});
export default AllBlogs;
