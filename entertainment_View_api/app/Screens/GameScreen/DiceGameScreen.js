import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing, ImageBackground, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import qs from 'qs';
import { global_balance } from '../../store/userSlice';


const DiceGameScreen = () => {
  const [playerDice1, setPlayerDice1] = useState(1);
  const [playerDice2, setPlayerDice2] = useState(1);
  const [computerDice1, setComputerDice1] = useState(1);
  const [computerDice2, setComputerDice2] = useState(1);
  const [animationRunning, setAnimationRunning] = useState(false);

  const initialCoins = useSelector((state) => state.user.balance);
  const userName = useSelector((state) => state.user.userName);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const [bet, setBet] = useState('');
  var amount = bet;

  const diceImages = [
    require('../../images/Dice/1.png'),
    require('../../images/Dice/2.png'),
    require('../../images/Dice/3.png'),
    require('../../images/Dice/4.png'),
    require('../../images/Dice/5.png'),
    require('../../images/Dice/6.png'),
  ];

  const bodyguard = async () => {
    if(userName === 'visitor'){
      Alert.alert('提醒','訪客沒有遊玩權限')
    }
    else if(bet <= 0){
      Alert.alert('沒有下注','請下注')
    }
    else if (initialCoins === 0){
      Alert.alert("沒有遊戲幣");
    }
    else{
      await axios.get(`http://192.168.1.55/api/is_enough?userName=${userName}&amount=${amount}`,{headers : {jwtToken: token}}, )
      .then(function(res){
        const data = res.data
        if(data.status === 400){
          Alert.alert("遊戲幣不足",'下注金額超過你擁有的遊戲幣')
        }
        else{
          rollDice()
        }
      }).catch(function(err){
        console.error("Error Details:", err);
        if (err.response && err.response.status === 401) {
            // 已处理401错误，所以这里不需要重复处理
            Alert.alert('Token失效')
        } else {
            alert("請求出錯!");
        }
      });
    }
  }

  const rollDice = async () => {
    setAnimationRunning(true);

    const interval = setInterval(() => {
      setPlayerDice1(Math.floor(Math.random() * 6) + 1);
      setPlayerDice2(Math.floor(Math.random() * 6) + 1);
      setComputerDice1(Math.floor(Math.random() * 6) + 1);
      setComputerDice2(Math.floor(Math.random() * 6) + 1);
    }, 100);

    data = {
      'userName':userName,
      'amount':amount,
    }
    axios.patch("http://192.168.1.55/api/dice_game", qs.stringify(data),{headers : {jwtToken: token}}, )
    .then(function(res){
      const data = res.data
      console.log(data.result)
      console.log(data.result.Dice_value[0])

      setTimeout(() => {
        clearInterval(interval);
        const newPlayerDice1 = data.result.Dice_value[0] + 1;
        const newPlayerDice2 = data.result.Dice_value[1] + 1;
        const newComputerDice1 = data.result.other_side[0] + 1;
        const newComputerDice2 = data.result.other_side[1] + 1;
  
        setPlayerDice1(newPlayerDice1);
        setPlayerDice2(newPlayerDice2);
        setComputerDice1(newComputerDice1);
        setComputerDice2(newComputerDice2);

        setAnimationRunning(false);
        if(data.result.message === "你贏了"){
          dispatch(global_balance(initialCoins + Number(data.result.win_money)))
          Alert.alert("你贏了!!!", `恭喜獲得獎金${data.result.win_money}`)
        }
        else if (data.result.message === "你輸了"){
          dispatch(global_balance(initialCoins + Number(data.result.win_money)))
          Alert.alert("再接再厲", `下次會更好`)
        }
      }, 2000);

     
    }).catch(function(err){
      console.error("Error Details:", err);
      if (err.response && err.response.status === 401) {
          // 已处理401错误，所以这里不需要重复处理
          Alert.alert('Token失效')
      } else {
          alert("請求出錯!");
      }
    });
  };

  const renderDiceImage = (value) => {
    return (
      <View style={styles.wrapper}>
        <Image source={diceImages[value - 1]} style={styles.dice} />
      </View>
    );
  };

  return (
    <ImageBackground 
      source={require('../../images/Dice/Dice_bg.jpg')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.coinsWrapper}>
          <Text style={styles.coins}>遊戲幣: {initialCoins}</Text>
        </View>
        <View style={styles.diceContainer}>
          <View style={styles.diceRow}>
            {renderDiceImage(playerDice1)}
            {renderDiceImage(playerDice2)}
          </View>
          <View style={[styles.diceRow]}>
            {renderDiceImage(computerDice1)}
            {renderDiceImage(computerDice2)}
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="輸入加注金額"
          keyboardType="numeric"
          value={bet}
          onChangeText={setBet}
        />
        <TouchableOpacity onPress={bodyguard} style={styles.button}>
          <Text style={styles.buttonText}>開始</Text>
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
  diceContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  diceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  wrapper: {
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
  wrapper: {
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
  Cupwrapper: {
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
  dice: {
    width: 100,
    height: 100,
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DiceGameScreen;
