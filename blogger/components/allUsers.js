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
  Button,
} from 'react-native';
import {Div} from 'reactnative-ui-bootstrap';
import axios from 'axios';
import {getAllUnfollowApi, followUserApi} from '../utils/constants';

const AllUsers = ({navigation}) => {
  const [userBlogs, setuserBlogs] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const currentUserId = navigation.state.params.userId;

  useEffect(() => {
    axios.get(`${getAllUnfollowApi}/${currentUserId}`).then(res => {
      console.log('in unfollow', res.data);
      setuserBlogs(res.data);
      console.log('len is', userBlogs.length);
      setisLoading(false);
    });
  }, [currentUserId, userBlogs.length, isLoading]);
  // getUsers()

  const followFunction = userId => {
    console.log('in followers');
    axios
      .post(`${followUserApi}`, {
        user1: {
          userId: currentUserId,
        },
        user2: {
          userId: userId,
        },
      })
      .then(res => {
        console.log('res in followers is', res.data);
        setisLoading(true);
        navigation.navigate('Blogs', {currentUserId: currentUserId});
      });
  };
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator animating={isLoading} size={50} color="#0f66f2" />
      ) : userBlogs.length <= 0 ? (
        <ScrollView>
          <View style={styles.noBlogs}>
            <Text style={{fontSize: 20}}>You followed all bloggers</Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={userBlogs}
          keyExtractor={items => items.userId}
          renderItem={({item}) => {
            console.log('imgg is', item.profilePic);
            return (
              <View style={styles.lists}>
                <Div className="row justify-content-space-evenly">
                  <Div className="col">
                    <Image
                      source={
                        item.profilePic !== null
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
                    <Text style={styles.names}>{item.fullName} </Text>
                  </Div>

                  <Div className="col">
                    <Text style={styles.companyStyle}>{item.companyName}</Text>
                  </Div>
                  <Div className="col">
                    <Button
                      title="Follow"
                      className="primary"
                      onPress={() => {
                        followFunction(item.userId);
                      }}
                    />
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
    width: 350,
    backgroundColor: 'white',
    marginVertical: 6,
    borderRadius: 10,
    alignSelf: 'center',
    padding: 7,
  },
  noBlogs: {
    alignSelf: 'center',
    marginVertical: 240,
  },
  names: {
    fontSize: 18,
  },
  companyStyle: {
    // marginLeft: 70,
    fontSize: 18,
    paddingLeft: 2,
    paddingRight: 2,
    // marginTop: -15,
    // marginBottom: 10,
  },
});
export default AllUsers;
