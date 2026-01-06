import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing, ImageBackground, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { global_balance } from '../../store/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';

const SlotMachineScreen = () => {
  const [result, setResult] = useState([0, 0, 0]);
  const [animationValue] = useState(new Animated.Value(0));
  const initialCoins = useSelector((state) => state.user.balance);
  const userName = useSelector((state) => state.user.userName);
  const token = useSelector((state) => state.user.token);
  const [bet, setBet] = useState('0');
  const dispatch = useDispatch();
  const betAmount = parseInt(bet);

  const diceIcons = [
    require('../../images/slot_machine/1.jpg'),
    require('../../images/slot_machine/2.jpg'),
    require('../../images/slot_machine/3.jpg'),
    require('../../images/slot_machine/4.jpg'),
    require('../../images/slot_machine/5.jpg'),
    require('../../images/slot_machine/6.jpg'),
    require('../../images/slot_machine/7.jpg'), // 確保這個圖片文件存在並且路徑正確
  ];

  const playGame = async () => {
    if(userName === 'visitor'){
      Alert.alert('提醒','訪客沒有遊玩權限')
    }
    else if (betAmount === 0 || isNaN(betAmount)) {
      Alert.alert("請輸入下注金額");
    } 
    else if (initialCoins === 0){
      Alert.alert("沒有遊戲幣");
    }
    else {
      console.log('判斷遊戲幣');
      await axios.get(`http://192.168.1.55/api/is_enough?userName=${userName}&amount=${betAmount}`, {headers : {jwtToken: token}})
      .then(function(res) {
          const data = res.data;
          if(data.status === 200) {
            spin()
          } else {
              Alert.alert("數值異常");
          }
      }).catch(function(err) {
          console.error("Error Details:", err);
          if (err.response && err.response.status === 401) {
              // 已处理401错误，所以这里不需要重复处理
              Alert.alert('Token失效')
          } else {
              alert("請求出錯!");
          }
      });
    }
  };

  const spin = async () => {
    const data = {
      userName: userName,
      amount: betAmount,
    }; 
    
    console.log(data)
    console.log(token)

    await axios.patch("http://192.168.1.55/api/slot_machine", qs.stringify(data),  {headers : {jwtToken: token}})
      .then(function(res) {
        const data = res.data;
        console.log(data.result);
        if (data.status === 200) {
          Animated.sequence([
            Animated.timing(animationValue, {
              toValue: 10,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(animationValue, {
              toValue: 11,
              duration: 1000,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            })
          ]).start(() => {
            animationValue.setValue(0);
            const newResult = [
              (data.result.slot_machine[0]),
              (data.result.slot_machine[1]),
              (data.result.slot_machine[2]),
            ];
            setResult(newResult);

            // 添加调试信息
            console.log('data.result.message:', data.result.message);
            console.log('data.result.win_money:', data.result.win_money);
            console.log('data.balance:', data.balance);

            if (data.result.message === "你贏了"){
              console.log(data);
              if (data.balance && data.balance[0]) {
                dispatch(global_balance(Number(data.balance[0].balance)));
                Alert.alert("你贏了!!!", `恭喜獲得獎金${data.result.win_money}`);
              } else {
                Alert.alert("錯誤", "無法獲取新的餘額信息");
              }
            }
            else if (data.result.message === "你輸了"){
              console.log(data);
              if (data.balance && data.balance[0]) {
                dispatch(global_balance(Number(data.balance[0].balance)));
                Alert.alert("再接再厲", `下次會更好`);
              } else {
                Alert.alert("錯誤", "無法獲取新的餘額信息");
              }
            }
          });
        } else {
          Alert.alert("數值異常");
        }
      }).catch(function(err) {
        console.log(err);
        alert("錯誤1");
      });
  };

  const getInterpolate = (index) => {
    return animationValue.interpolate({
      inputRange: [0, 10, 11],
      outputRange: ['0deg', '3600deg', '3960deg'],
    });
  };

  return (
    <ImageBackground 
      source={require('../../images/slot_machine/slot_machine_bg.jpg')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.coinsWrapper}>
          <Text style={styles.coins}>遊戲幣: {initialCoins}</Text>
        </View>
        <View style={styles.slotContainer}>
          {result.map((iconIndex, index) => (
            <Animated.View
              key={index}
              style={[
                styles.slotWrapper,
                {
                  transform: [
                    { rotateY: getInterpolate(index) },
                  ],
                },
              ]}
            >
              <View style={styles.slot}>
                <Image source={diceIcons[iconIndex]} style={styles.icon} />
              </View>
            </Animated.View>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="輸入加注金額"
          keyboardType="numeric"
          value={bet}
          onChangeText={(text) => setBet(text)}
        />
        <TouchableOpacity style={styles.button} onPress={playGame}>
          <Text style={styles.buttonText}>START!</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinsWrapper: {
    width: '80%',
    borderWidth: 5,
    borderColor: '#FFD700',
    borderRadius: 10,
    backgroundColor: '#FFF8DC',
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coins: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  slotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  slotWrapper: {
    width: 120,
    height: 120,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    borderWidth: 5,
    borderColor: '#FFD700',
    borderRadius: 10,
    backgroundColor: '#FFF8DC',
  },
  slot: {
    width: '90%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default SlotMachineScreen;
