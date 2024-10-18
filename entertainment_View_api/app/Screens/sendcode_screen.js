// Screens/SendCodeScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import qs from 'qs';
import { useDispatch } from 'react-redux';
import { global_Email } from '../store/userSlice';


const SendCodeScreen = () => {
  const [email, setEmail] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigation = useNavigation();
  const dispatch = useDispatch();


  const handleSendCode = async () => {
    if (email === "") {
      alert("請輸入電子郵件");
      return;
    }
    else{
        console.log(email)
        await axios.get("http://192.168.1.55/api/getVerificationCode",{params: { email:email }})
        .then(function(res){
          data = res.data
          console.log(data);
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
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>發送驗證碼</Text>
      
      <TextInput
        style={styles.input}
        placeholder="請輸入您的電子郵件"
        value={email}
        onChangeText={setEmail}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSendCode}>
        <Text style={styles.buttonText}>發送</Text>
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

export default SendCodeScreen;
