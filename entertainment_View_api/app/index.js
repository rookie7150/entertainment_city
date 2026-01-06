import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Screens/Login_Screen';
import ForgotPasswordScreen from './Screens/ForgotPassword_Screen';
import RegisterScreen from './Screens/Register_Screen';
import NextRegister from './Screens/NextRegister_Screen';
import ConfirmPasswordScreen from './Screens/ConfirmPassword_Screen';
import GameLobbyScreen from './Screens/GameScreen/GameLobbyScreen';
import SlotMachineScreen from './Screens/GameScreen/SlotMachineScreen';
import DiceGameScreen from './Screens/GameScreen/DiceGameScreen';
import TopUpScreen from './Screens/GameScreen/TopUpScreen';
import TextVerificationCodeScreen from './Screens/TextVerificationCode_Screen';
import WithdrawScreen from './Screens/GameScreen/WithdrawScreen';
import SendCodeScreen from './Screens/sendcode_screen';

import store from './store/store';
import { Provider } from 'react-redux';




const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="NextRegister" component={NextRegister} options={{ headerShown: false }}/>

        <Stack.Screen name="ConfirmPassword" component={ConfirmPasswordScreen} options={{ headerShown: false }} />

        <Stack.Screen name="GameLobby" component={GameLobbyScreen} options={{ headerShown: false }} />

          <Stack.Screen name="SlotMachine" component={SlotMachineScreen} options={{ headerShown: false }} />
          
          <Stack.Screen name="DiceGame" component={DiceGameScreen} options={{ headerShown: false }} />

          <Stack.Screen name="TopUp" component={TopUpScreen} options={{ headerShown: false }} />

          <Stack.Screen name="Withdraw" component={WithdrawScreen} options={{ headerShown: false }} />

          <Stack.Screen name="TextVerificationCode" component={TextVerificationCodeScreen} options={{ headerShown: false }} />

          <Stack.Screen name="SendCode" component={SendCodeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </Provider>
  );
}

export default App;


