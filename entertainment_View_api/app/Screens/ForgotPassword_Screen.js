// Screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { global_Email } from '../store/userSlice.js';



const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkemail, setCheckemail] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const sendcode = async () => {
    const data = {
      "email":email,
    };

    // const data = "C110156104@nkust.edu.tw"

    if(email !== ""){
      await axios.get("http://192.168.1.55/api/getEmail",{params: { email }})
      .then(function(res){
        
        const data = res.data
        // console.log(res.data)
        // console.log(data.result[0].userName)

        if(data.message === "電子信箱已存在"){
          setCheckemail(true);
          dispatch(global_Email(email));


        }else{
          setCheckemail(false);
          Alert.alert("電子信箱不存在", "此信箱還沒有註冊過")
        }
      }).catch(function(err){
        setCheckemail(false);
        console.log(err);
        alert("錯誤1");
      });
    }else{
      Alert.alert("電子郵件不能為空的");
    }
    if(checkemail === true){
      await axios.get("http://192.168.1.55/api/getVerificationCode",{
        params: { email }
      })
      .then(function(res){
        const data = res.data
        console.log(res.data)
        // console.log(data.result[0].userName)

        if(data.message !== "已發送驗證碼至電子信箱"){
          setModalMessage('已發送驗證碼至電子信箱');
          setIsModalVisible(true);
          
          setTimeout(() => {
            setIsModalVisible(false);
            console.log(data.email);
            navigation.navigate('TextVerificationCode');
          }, 1500);
        }
        else if (data.message === "電子信箱不存在"){
          alert("電子信箱不存在");
        }

      }).catch(function(err){
        console.log(err);
        console.log(data);
        alert("錯誤");
      });
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>請輸入你的電子郵件</Text>
      <TextInput
        style={styles.input}
        placeholder="請輸入您的電子郵件"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={sendcode}>
        <Text style={styles.buttonText}>傳送驗證碼</Text>
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

export default ForgotPasswordScreen;
