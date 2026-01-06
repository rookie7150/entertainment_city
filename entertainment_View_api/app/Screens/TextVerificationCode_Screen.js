import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, route } from 'react-native';
import { useNavigation, } from '@react-navigation/native';
import axios from 'axios';
import qs from 'qs';
import { useSelector } from 'react-redux';

const TextVerificationCodeScreen = () => {
  const [Verification_code, setVerification_code] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();
  const email = useSelector((state) => state.user.email);


  const verifyCode = async () => {
    const data = {
      "email" : email,
      "Verification_code": Verification_code,
    };
    

    if (Verification_code === "") {
      alert("驗證碼不能為空的");
    } else {
      await axios.post("http://192.168.1.55/api/checkVerificationCode", qs.stringify(data))
        .then(function(res) {
          const data = res.data;
          console.log(res.data);

          if (data.message === "驗證成功") {
            setModalMessage('驗證成功');
            setIsModalVisible(true);
            // 在 1.5 秒鐘後關閉彈出視窗並導航到下一個頁面
            setTimeout(() => {
              setIsModalVisible(false);
              navigation.navigate('ConfirmPassword'); // 假設下一步是重設密碼
            }, 1500);
          } else if (data.message === "驗證碼錯誤") {
            alert("驗證碼錯誤");
          }
        }).catch(function(err) {
          console.log(err);
          console.log('1');
          alert("錯誤");  
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>請輸入您的驗證碼</Text>
      <TextInput
        style={styles.input}
        placeholder="請輸入您的驗證碼"
        value={Verification_code}
        onChangeText={setVerification_code}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={verifyCode}>
        <Text style={styles.buttonText}>下一步</Text>
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

export default TextVerificationCodeScreen;
