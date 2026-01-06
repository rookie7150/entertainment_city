import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { global_balance } from '../../store/userSlice';

import axios from 'axios';
import qs from 'qs';



const WithdrawScreen = ({ navigation }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const token = useSelector((state) => state.user.token);
    const userName = useSelector((state) => state.user.userName);
    var balance = useSelector((state) => state.user.balance);
    const [withdrawAmount, setWithdrawAmount]  = useState(0)
    const dispatch = useDispatch();


    const handleWithdraw = async () => {
        const data = {
            "userName": userName,
            "amount": withdrawAmount,
        };
        if (balance < withdrawAmount){
            Alert.alert("提款金額不能超過遊戲幣");
        }
        else{
            await axios.patch("http://192.168.1.55/api/withdrawmoney", qs.stringify(data), {headers : {jwtToken: token}})
            .then(function(res) {
                const data = res.data;
                if(data.status === 200) {
                    setIsModalVisible(true);
                    setTimeout(() => {
                        setIsModalVisible(false);
                        dispatch(global_balance(balance - withdrawAmount));
                        navigation.navigate('GameLobby'); // 假設你的登錄頁面路由名稱為 'Login'
                    }, 1500);
                } else {
                    Alert.alert("數值異常");
                }
            }).catch(function(err) {
                if (err.response && err.response.status === 401) {
                    // 已处理401错误，所以这里不需要重复处理
                    Alert.alert('Token失效')
                } else {
                    alert("請求出錯!");
                }
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>目前餘額:{balance}</Text>
            <TextInput
                style={styles.input}
                placeholder="輸入提款金額"
                keyboardType="numeric"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
            />
            <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
                <Text style={styles.buttonText}>確認提款</Text>
            </TouchableOpacity>
            <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>提款成功！</Text>
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
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'white',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#C73A3A',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
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

export default WithdrawScreen;
