import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import qs from 'qs';



const ConfirmPasswordScreen = () => {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const email = useSelector((state) => state.user.email);

  const handleChangePassword = async () => {
    const data = {
      "email":email,
      "password":newPassword,
    };

    // const data = "C110156104@nkust.edu.tw"
    if (newPassword !== confirmPassword){
      Alert.alert("密碼不相符","密碼與確認密碼不同");
    }
    else if(newPassword && confirmPassword !== ""){
      await axios.patch("http://192.168.1.55/api/foget_password",qs.stringify(data))
      .then(function(res){
        
        const data = res.data
        // console.log(res.data)
        // console.log(data.result[0].userName)

        if(data.status === 200){
          setModalMessage("密碼更改成功");
          setIsModalVisible(true)
          setTimeout(() => {
            setIsModalVisible(false);
            navigation.navigate('Login'); // 假設你的登錄頁面路由名稱為 'Login'
          }, 1500);
        }else{
          Alert.alert("密碼重複", "密碼不能與舊密碼相符")
        }
      }).catch(function(err){
        console.log(err);
        alert("錯誤1");
      });
    }
    else{
      Alert.alert("密碼不能為空值");
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>重設密碼</Text>
      <TextInput
        style={styles.input}
        placeholder="請輸入新密碼"
        secureTextEntry={true}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="確認新密碼"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>重設密碼</Text>
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

export default ConfirmPasswordScreen;
