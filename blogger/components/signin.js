import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Div, Button} from 'reactnative-ui-bootstrap';
import {requiredError, passwordErrorMsg, emailErrorMsg,loginApi} from '../utils/constants';
import axios from 'axios';

const Signin = ({navigation}) => {
  const [userName, setuserName] = useState('');
  const [password, setpassword] = useState('');
  const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [usernameError, setusernameError] = useState('');
  const [passwordError, setpasswordError] = useState('');
  const [isPasswordVisible, setisPasswordVisible] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const getUserData = () => {
    if (userName === '' && password === '') {
      setusernameError(requiredError);
      setpasswordError(requiredError);
    } else if (userName === '') {
      setusernameError(requiredError);
    } else if (!userName.match(regEmail)) {
      setusernameError(emailErrorMsg);
    } else if (password === '') {
      setpasswordError(requiredError);
    } else if (password.length < 8) {
      setpasswordError(passwordErrorMsg);
    } else {
      setisLoading(true);
      axios
        .post(loginApi, {
            "username": userName,
            "password": password,
          },
        )
        .then(res => {
          if (res.data !== false) {
            setisLoading(false);
            var parseingRes=res.data;
            var resUserId;
            var resFullName;
            var resUserName;
            var resCompanyName;
            var resPassword;
            var resProfilePic;
            parseingRes.map((datas)=>{
              resUserId=datas.userId;
              resFullName=datas.fullName;
              resUserName=datas.username;
              resCompanyName=datas.companyName;
              resPassword=datas.password;
              resProfilePic=datas.profilePic
            })
            navigation.navigate('TabNavigator',{userId:resUserId,fullName:resFullName,userName:resUserName,companyName:resCompanyName,password:resPassword,profilePic:resProfilePic});
          } else {
            setisLoading(false);
            Alert.alert('Error', 'Invalid Credentials.Please try again');
          }
        })
        .catch(error => {
          setisLoading(false);
          Alert.alert('Error', 'Something went wrong please try again.');
        });
    }
  };

  return (
    <View style={styles.container}>
      <Div className="col">
        <TextInput
          keyboardType="email-address"
          style={styles.ip}
          placeholder="Enter Email Address"
          onChangeText={e => {
            if (e.match(regEmail)) {
              setusernameError('');
              setuserName(e);
            } else {
              setusernameError(emailErrorMsg);
            }
          }}
        />
        <Text style={styles.err}>{usernameError}</Text>
      </Div>
      <Div className="col">
        <TextInput
          secureTextEntry={!isPasswordVisible}
          style={styles.ip}
          maxLength={12}
          placeholder="Enter Password"
          onChangeText={e => {
            if (e.length < 8) {
              setpasswordError(passwordErrorMsg);
            } else {
              setpassword(e);
              setpasswordError('');
            }
          }}
        />
        <Icon
          name={isPasswordVisible ? 'eye' : 'eye-slash'}
          style={styles.toggleEye}
          size={25}
          onPress={() => setisPasswordVisible(!isPasswordVisible)}
        />
      </Div>
      <Text style={styles.err}>{passwordError}</Text>
      <Div className="col">
        <Button style={styles.ip} variant="primary" onPress={getUserData}>
          <Text style={styles.btnText}>Log in </Text>
        </Button>
        <ActivityIndicator animating={isLoading} size="large" color="#0f66f2" />
      </Div>
      <Div className="col">
        <Text
          style={styles.links}
          onPress={() => navigation.navigate('Signup')}>
          Don't Have an Account ? Sign up here
        </Text>
      </Div>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    margin: 10,
  },
  ip: {
    borderColor: 'grey',
    borderWidth: 1,
    marginVertical: 8,
    fontSize: 16,
    borderRadius: 5,
  },
  toggleEye: {
    position: 'absolute',
    color: 'black',
    marginTop: 20,
    marginLeft: 280,
  },
  btnText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
  },
  err: {
    color: 'red',
  },
  links: {
    color: '#0f66f2',
    marginTop: 15,
    fontSize: 18,
    alignSelf: 'center',
  },
});
export default Signin;
