// Screens/GameLobbyScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';


const GameLobbyScreen = () => {

  const navigation = useNavigation();
  const balance = useSelector((state) => state.user.balance);
  const userName = useSelector((state) => state.user.userName);

  const go_topup = () => {
    if(userName === 'visitor'){
      Alert.alert('提醒','訪客沒有儲值提款的權限')
    }
    else{
      navigation.navigate('TopUp')
    }
  }

  return (
    <ImageBackground source={require('../../images/Gamelobby_bg.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.creditContainer}>
          <Text style={styles.creditText}>{balance}</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={go_topup}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.title}>遊戲大廳</Text>
        
        <View style={styles.gameOptionsContainer}>
          <TouchableOpacity 
            style={styles.optionButton} 
            onPress={() => navigation.navigate('SlotMachine')}>
            <Image source={require('../../images/slot_machine.jpg')} style={styles.optionImage} />
            <Text style={styles.optionText}>拉霸機</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionButton} 
            onPress={() => navigation.navigate('DiceGame')}>
            <Image source={require('../../images/dice_game.jpg')} style={styles.optionImage} />
            <Text style={styles.optionText}>比大小</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // 白色半透明
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#000000',
  },
  creditText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#C73A3A',
    padding: 5,
    marginLeft: 5,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // 黑色陰影
    textShadowOffset: { width: 1, height: 1 }, // 陰影偏移量
  },
  
  gameOptionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  optionButton: {
    width: '80%',
    alignItems: 'center',
    padding: 0,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFF',
    overflow: 'hidden', // 確保圖片不會超出邊框
  },
  optionImage: {
    width: '100%',
    height: 180,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});

export default GameLobbyScreen;
