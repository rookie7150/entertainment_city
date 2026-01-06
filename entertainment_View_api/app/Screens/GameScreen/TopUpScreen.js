import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Alert  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';
import qs from 'qs';

import { useSelector, useDispatch } from 'react-redux';
import { global_balance } from '../../store/userSlice';

const TopUpScreen = () => {
    const navigation = useNavigation();
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const token = useSelector((state) => state.user.token);
    const userName = useSelector((state) => state.user.userName);
    const balance = useSelector((state) => state.user.balance);
    const dispatch = useDispatch();
    console.log(token)
    const handleTopUp = async () => {
        const data = {
            "userName": userName,
            "amount": selectedAmount,
        };

        await axios.patch("http://192.168.1.55/api/topup", qs.stringify(data) , {headers : {jwtToken: token}})
        .then(function(res) {
            const data = res.data;
            if(data.status === 200) {
                setIsModalVisible(true);
                setTimeout(() => {
                    setIsModalVisible(false);
                    dispatch(global_balance(selectedAmount + balance));
                    navigation.navigate('GameLobby'); // 假設你的登錄頁面路由名稱為 'Login'
                }, 1500);
            } else {
                if (err.response && err.response.status === 401) {
                    // 已处理401错误，所以这里不需要重复处理
                    Alert.alert('Token失效')
                } else {
                    alert("請求出錯!");
                }
            }
        }).catch(function(err) {
            console.log(err);
            alert("錯誤1");
        });
    };

    const topUpOptions = [
        { amount: 100, image: require('../../images/chip.png') },
        { amount: 300, image: require('../../images/chip.png') },
        { amount: 600, image: require('../../images/chip.png') },
        { amount: 1000, image: require('../../images/chips1.png') },
        { amount: 2000, image: require('../../images/chips1.png') },
        { amount: 3000, image: require('../../images/chips1.png') },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Give me that money</Text>
            <TouchableOpacity
                style={styles.withdrawButton}
                onPress={() => navigation.navigate('Withdraw')}
            >
                <Text style={styles.withdrawButtonText}>提款</Text>
            </TouchableOpacity>
            <View style={styles.optionsContainer}>
                {topUpOptions.map((option, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={[
                            styles.optionButton, 
                            selectedAmount === option.amount && styles.selectedOptionButton
                        ]}
                        onPress={() => setSelectedAmount(option.amount)}
                    >
                        <Image source={option.image} style={styles.optionImage} />
                        <Text style={styles.optionText}>${option.amount}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={handleTopUp}
                disabled={selectedAmount === null}
            >
                <Text style={styles.buttonText}>確認儲值</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>儲值成功！</Text>
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
    withdrawButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 10,
        backgroundColor: '#C73A3A',
        borderRadius: 5,
    },
    withdrawButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '100%',
    },
    optionButton: {
        width: '30%',
        alignItems: 'center',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#FFF',
    },
    selectedOptionButton: {
        borderColor: '#C73A3A',
        backgroundColor: '#FFEBEB',
    },
    optionImage: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    optionText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmButton: {
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

export default TopUpScreen;
