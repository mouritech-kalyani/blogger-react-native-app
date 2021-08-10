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
import {requiredError, passwordErrorMsg, emailErrorMsg,signupApi} from '../utils/constants';
import axios from 'axios';

const Signup = ({navigation}) => {
  const [fullName, setfullName] = useState('');
  const [compnyName, setcompanyName] = useState('');
  const [userName, setuserName] = useState('');
  const [password, setpassword] = useState('');
  const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [fullNameError, setfullNameError] = useState('');
  const [companyNameError, setcnameError] = useState('');
  const [usernameError, setusernameError] = useState('');
  const [passwordError, setpasswordError] = useState('');
  const [isPasswordVisible, setisPasswordVisible] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const getUserData = () => {
    if (
      fullName === '' &&
      compnyName === '' &&
      userName === '' &&
      password === ''
    ) {
      setfullNameError(requiredError);
      setcnameError(requiredError);
      setusernameError(requiredError);
      setpasswordError(requiredError);
    } else if (fullName === '') {
      setfullNameError(requiredError);
    } else if (compnyName === '') {
      setcnameError(requiredError);
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
        .post(signupApi, {
          "fullName": fullName,
          "companyName": compnyName,
          "username": userName,
          "password": password,
        })
        .then(res => {
            
          if (res.data === "Record Added Successfully !") { 
            setisLoading(false);         
            navigation.navigate('Signin');
          } else if (res.data === "Email already Exists !") {
            setisLoading(false);   
            Alert.alert('Error', 'Email already exists.Try with another');
          } else {
            setisLoading(false); 
            Alert.alert('Error.', 'Something went wrong ! Please try again');
          }
        })
        .catch(error => {
            setisLoading(false); 
        Alert.alert('Error.', 'Something went wrong ! Please try again');
        });
    }
  };

  return (
    <View style={styles.container}>
          <Div className="col">
            <TextInput
              style={styles.ip}
              placeholder="Enter Full Name"
              onChangeText={e => {
                if (e.length > 1) {
                  setfullName(e);
                  setfullNameError('');
                }
              }}
            />
            <Text style={styles.err}>{fullNameError}</Text>
          </Div>
          <Div className="col">
            <TextInput
              style={styles.ip}
              placeholder="Enter Company Name"
              onChangeText={e => {
                if (e.length > 1) {
                  setcompanyName(e);
                  setcnameError('');
                }
              }}
            />
            <Text style={styles.err}>{companyNameError}</Text>
          </Div>
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
              <Text style={styles.btnText}>Sign Up </Text>
            </Button>
            <ActivityIndicator
              animating={isLoading}
              size="large"
              color="#0f66f2"
            />
          </Div>
          <Div className="col">
            <Text
              style={styles.links}
              onPress={() => navigation.navigate('Signin')}>
              Already Have an Account ? Log in here
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
export default Signup;
