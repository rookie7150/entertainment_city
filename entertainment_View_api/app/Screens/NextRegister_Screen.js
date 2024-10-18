// Screens/RegisterStepTwoScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import qs from 'qs';
import {useSelector} from 'react-redux';


const NextRegister = () => {

  const email = useSelector((state) => state.user.email);
  const [checkcode, setcheckCode] = useState(false);
  const [verification_code, setVerification_code] = useState('');

  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleCompleteRegistration = async () => {


    if(verification_code === ""){
      alert("每格都要填喔");
    }
    if(verification_code !== ""){
      const data = {
        "email" : email,
        "Verification_code": verification_code,
      };
      await axios.post("http://192.168.1.55/api/checkVerificationCode", qs.stringify(data))
        .then(function(res) {
          const data = res.data;
          console.log(res.data);

          if (data.message === "驗證成功") {
            turn_on()
          } else if (data.message === "驗證碼錯誤") {
            setcheckCode(false)
            alert("驗證碼錯誤");
          }
        }).catch(function(err) {
          console.log(err);
          console.log('1');
          alert("錯誤");  
        });
    }
    // if(checkcode){
    //   turn_on();
    // }
  }
  const turn_on = async () => { 
    data = {
     'email':email
   }

   await axios.post("http://192.168.1.55/api/activate_account", qs.stringify(data))
   .then(function(res){
     const data = res.data
     console.log(data)
     if (data.message === "帳號已啟用"){
        console.log('驗證成功')
        setModalMessage('驗證成功');
        setIsModalVisible(true);
        setTimeout(() => {
        setIsModalVisible(false);
          navigation.navigate('Login'); // 假設返回的數據包含 userId 和 credit
        }, 1500);
     }
     else if (data.message === "帳號啟用失敗"){
       alert("帳號啟用失敗")
     }
     else{
        Alert.alert('提示','帳號已啟用')
     }

   }).catch(function(err){
     console.log(err);
     alert("錯誤");
   });
 }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>啟用帳號</Text>
      
      <TextInput
        style={styles.input}
        placeholder="請輸入驗證碼"
        value={verification_code}
        onChangeText={setVerification_code}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleCompleteRegistration}>
        <Text style={styles.buttonText}>完成驗證</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEFEF',
    padding: 20,
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

export default NextRegister;
