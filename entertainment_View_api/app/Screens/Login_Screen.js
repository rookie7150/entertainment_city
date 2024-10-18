import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import qs from 'qs';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { global_userName, global_phone, global_address, global_pay, global_account, global_password, global_Email, global_enable, global_balance, global_token } from '../store/userSlice.js';
import { Request } from '../store/api.js'


const LoginScreen = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const data = {
      account: account,
      password: password,
    };

    if (account === "" || password === "") {
      alert("帳號密碼不得為空!");
      return;
    }

    try {
      const response = await axios.post("http://192.168.1.55/api/login", qs.stringify(data));
      const resData = response.data;

      if (resData.message === "登入成功") {
        const userInfo = resData.result[0];
        const token = resData.token;

        dispatch(global_userName(userInfo.userName));
        dispatch(global_phone(userInfo.phone));
        dispatch(global_address(userInfo.address));
        dispatch(global_pay(userInfo.pay));
        dispatch(global_account(userInfo.account));
        dispatch(global_password(userInfo.password));
        dispatch(global_Email(userInfo.email));
        dispatch(global_enable(userInfo.enable));
        dispatch(global_balance(userInfo.balance));
        dispatch(global_token(token));


        console.log()
        setModalMessage('登入成功');
        setIsModalVisible(true);
        setTimeout(() => {
          setIsModalVisible(false);
          navigation.navigate('GameLobby');
        }, 1500);
      } else if (resData.message === "帳號未啟用") {
        alert("帳號未啟用! 請去驗證!");
      } else {
        Alert.alert('帳號或密碼錯誤', '請確認帳號跟密碼');
      }
    } catch (err) {
      console.log(err);
      alert("錯誤!");
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleGuestMode = () => {
    navigation.navigate('GuestMode'); // 示例中的GuestMode页面，您可以替换成您需要的页面名称
  };

  const handleVerifyAccount = () => {
    navigation.navigate('SendCode');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        if (jwtToken) {
          // 在这里处理已存储的 token
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []); // 空数组作为第二个参数确保 useEffect 只运行一次

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../images/spades.png')} style={[styles.icon]} />
        <Image source={require('../images/love.png')} style={styles.icon} />
        <Image source={require('../images/poke_diamond.png')} style={styles.icon} />
        <Image source={require('../images/clubs.png')} style={styles.icon} />
      </View>

      <Text style={styles.title}>歡迎來到登入畫面</Text>

      <TextInput
        style={styles.input}
        placeholder="請輸入帳號"
        value={account}
        onChangeText={(text) => setAccount(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="請輸入密碼"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>忘記密碼?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.register}>註冊</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>登入</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.guestMode} onPress={handleGuestMode}>
        <Text style={styles.guestModeText}>訪客模式</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.verifyAccount} onPress={handleVerifyAccount}>
        <Text style={styles.verifyAccountText}>驗證帳號</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEFEF',
  },
  imageContainer: {
    position: 'absolute',
    top: '10%', 
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  forgotPassword: {
    color: '#007AFF',
  },
  register: {
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#C73A3A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginVertical: 10, // Adjusted margin to create space between buttons
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    width: 110,
    height: 110
  },
  guestMode: {
    position: 'absolute',
    left: 10,
    bottom: 10,
  },
  guestModeText: {
    color: '#007AFF',
    textAlign: 'center'
  },
  verifyAccount: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  verifyAccountText: {
    color: '#007AFF',
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
