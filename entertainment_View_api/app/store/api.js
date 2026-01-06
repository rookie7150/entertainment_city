// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for React Native
// import { store } from '../index';
// import { useSelector, useDispatch } from 'react-redux';
// // import { REMOVE_ACTIVE_USER } from '../state/slice.js';

// // 创建 axios 实例
// const token = useSelector((state) => state.user.token);
// export function Request() {
    
//     const req = axios.create({
//         baseURL: 'http://192.168.1.55', //192.168.1.55
//     });

//     // 请求拦截器
//     req.interceptors.request.use(
//         async (config) => {
           
//             if (token) {
//                 config.headers.jwtToken = token;
//             }
//             console.log('Request Headers:', config.headers); // 输出请求头信息到控制台
//             return config;
//         },
//         (error) => {
//             return Promise.reject(error);
//         }
//     );

    // // 响应拦截器
    // req.interceptors.response.use(
    //     response => response,
    //     async (error) => {
    //         if (error.response && error.response.status === 401) {
    //             await setAuthToken(null);  // 清理无效的 token
    //             // store.dispatch(REMOVE_ACTIVE_USER()); // 触发登出动作
    //             alert('Token 失效，请重新登录!');
    //             // 此处无法直接导航，因为 React Native 中没有 window 对象
    //             // 需要在调用的地方处理导航逻辑
    //         }else {
    //             alert("請求出錯!");
    //         }
    //         return Promise.reject(error);
    //     }
    // );

    // return req;
// }

// 设置授权 token
// export const setAuthToken = async (token) => {
//     try {
//         const req = await Request(); // 確保 Request 返回的是 Axios 實例
//         if (token) {
//             // 將 token 添加到默認的請求頭中
//             req.defaults.headers.common['jwtToken'] = token;
//             await AsyncStorage.setItem('jwtToken', token); // 將 token 存儲在 AsyncStorage 中
//         } else {
//             // 如果 token 為空，則刪除默認請求頭中的 token
//             delete req.defaults.headers.common['jwtToken'];
//             await AsyncStorage.removeItem('jwtToken');
//             // 如果有需要，可以在這裡觸發其他的操作，比如觸發登出 action
//             // store.dispatch(REMOVE_ACTIVE_USER());
//         }
//     } catch (error) {
//         console.error('Error setting auth token:', error);
//     }
// };

// export default Request;  // 导出 Request 函数供其他模块使用