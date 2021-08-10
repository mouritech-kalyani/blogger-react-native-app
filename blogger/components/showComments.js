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
import {getAllCommentsApi} from '../utils/constants';

const ShowComments = ({navigation}) => {
  const [userBlogs, setuserComments] = useState([]);
  const [comment, setComment] = useState('');
  const [isLoading, setisLoading] = useState(true);
  const currentBlogId = navigation.state.params.blogId;
  const currentUserId = navigation.state.params.userId;

  useEffect(() => {
    getAllComments();
  }, [isLoading]);
  const getAllComments = () => {
    axios.get(`${getAllCommentsApi}/${currentBlogId}`).then(res => {
      setuserComments(res.data);
      setisLoading(false);
    });
  };

  const addComments =() => {
    if (comment === '') {
      alert('Please add your comment');
    } else {
      setisLoading(true);
      const newDate = new Date();
      const day = ("0" + (newDate.getDate())).slice(-2)
      const mon = ("0" + (newDate.getMonth() + 1)).slice(-2);
      const year = newDate.getFullYear();
      const commentTime = year+'-'+mon+'-'+day;
      axios.post(getAllCommentsApi,
      {
        "commentTime": commentTime,
        "commentDescription": comment,
        "blogs": {
            "blogId": currentBlogId,
          },
       "user": {
            "userId": currentUserId,
          },
      
    }
      )
        .then(res => {
          if (res) {
            setisLoading(false);
            setComment('');
          }else{
            setisLoading(false);
            alert('Error! Please try again')
          }
        })
        .catch((error)=>{
            setisLoading(false);
            alert('Error! Please try again')
        });
    }
  };
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator animating={isLoading} size={50} color="#0f66f2" />
      ) : userBlogs.length < 1 ? (
        <ScrollView>
          <View>
            <Div class="row">
              <TextInput
                placeholder="Enter comment here.."
                style={{
                  borderRadius: 1,
                  borderWidth: 1,
                  borderColor: 'grey',
                  marginTop: 20,
                  marginBottom: 10,
                }}
                value={comment}
                onChangeText={e => setComment(e)}
              />
              <Button title="Comment" onPress={addComments} />
            </Div>
          </View>
          <View style={styles.noBlogs}>
            <Text style={{fontSize: 20}}>No Comments yet</Text>
          </View>
        </ScrollView>
      ) : (
        <View>
          <FlatList
            data={userBlogs}
            inverted={1}
            keyExtractor={items => items.commentId}
            renderItem={({item}) => {
              return (
                <View style={styles.lists}>
                  <Div className="row">
                    <Div className="col">
                      <Image
                        source={
                          item.profilePic !== undefined
                            ? {uri: item.profilePic}
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
                      <Text style={{fontSize: 15}}>{item.commentTime}</Text>
                    </Div>
                  </Div>
                  <Text style={styles.companyStyle}>
                    {item.user.companyName}
                  </Text>
                  <Text style={styles.names}>{item.commentDescription}</Text>
                </View>
              );
            }}
          />
          <ScrollView>
            <View>
              <Div class="row">
                <TextInput
                  placeholder="Enter comment here.."
                  style={{
                    borderRadius: 1,
                    borderWidth: 1,
                    borderColor: 'grey',
                    marginTop: 20,
                    marginBottom: 10,
                  }}
                  value={comment}
                  onChangeText={e => setComment(e)}
                />
                <Button title="Comment" onPress={addComments} />
              </Div>
            </View>
          </ScrollView>
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
    marginLeft:0
  },
  companyStyle: {
    marginLeft: 70,
    fontSize: 15,
    marginTop: -15,
    marginBottom: 10,
  },
});
export default ShowComments;
