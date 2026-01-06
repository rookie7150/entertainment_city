// Screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import qs from 'qs';
import { useDispatch } from 'react-redux';
import { global_Email } from '../store/userSlice';


const RegisterScreen = () => {
  const [userName, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pay, setpay] = useState('');
  const [account, setaccount] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const [email, setEmail] = useState('');
  const [checkemail, setcheckEmail] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const sendcode = async () => {

    await axios.get("http://192.168.1.55/api/getVerificationCode",{params: { email:email }})
    .then(function(res){

      data = res.data
      console.log(data)
      dispatch(global_Email(email))

      setModalMessage('傳送驗證碼');
      setIsModalVisible(true);
      setTimeout(() => {
        setIsModalVisible(false);
        navigation.navigate('NextRegister');
      }, 1500);

    }).catch(function(err){
      console.log(err);

      alert("錯誤");
    });
  }
  
  const handleNextRegister = async () => {
    if(userName === "" || phone === "" || address === "" || pay === "" || account === "" || password === "" || cpassword === "" || email === ""){
      alert("每格都要填喔");
    }
    if(email !== ""){
      await axios.get("http://192.168.1.55/api/getEmail",{params: { email:email }})
      .then(function(res){

        const data = res.data
        // console.log(res.data)
        // console.log(data.result[0].userName)

        if(data.message === "電子信箱不存在"){
          setcheckEmail(true)
        }else{
          Alert.alert("電子信箱已存在", "此信箱已經註冊過信箱")
          setcheckEmail(false)
        }
      }).catch(function(err){
        console.log(err);
        alert("錯誤1");
      });
    }
    if(String(password) !== String(cpassword)){
      alert("密碼與確認密碼不符");
    }
    else if(checkemail === true){
      const data2 = {
        "userName":userName,
        "phone":phone,
        "address":address,
        "pay":pay,
        "account":account,
        "password":password,
        "email":email,
      };
      await axios.post("http://192.168.1.55/api/register", qs.stringify(data2))
      .then(function(res){

        const data = res.data
        // console.log(res.data)
        // console.log(data.result[0].userName)

        if(data.message === "註冊成功"){
            sendcode();
        }
      }).catch(function(err){
        console.log(err);
        alert("錯誤2");
      });
    };
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>註冊</Text>
      <TextInput
        style={styles.input}
        placeholder="請輸入使用者名稱"
        value={userName}
        onChangeText={setUsername}
      />
      
      <TextInput
        style={styles.input}
        placeholder="請輸入電話號碼"
        value={phone}
        onChangeText={setPhone}
      />
      
      <TextInput
        style={styles.input}
        placeholder="請輸入地址"
        value={address}
        onChangeText={setAddress}
      />
      
      <TextInput
        style={styles.input}
        placeholder="請輸入付款資訊"
        value={pay}
        onChangeText={setpay}
      />

      <TextInput
        style={styles.input}
        placeholder="請輸入帳號"
        value={account}
        onChangeText={setaccount}
      />

      <TextInput
        style={styles.input}
        placeholder="請輸入密碼"
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="確認密碼"
        value={cpassword}
        onChangeText={setcPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="請輸入您的電子郵件"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleNextRegister}>
        <Text style={styles.buttonText}>前往驗證</Text>
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
  button: {
    backgroundColor: '#C73A3A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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

export default RegisterScreen;
