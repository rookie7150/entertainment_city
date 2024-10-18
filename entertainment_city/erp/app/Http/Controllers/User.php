<?php

namespace App\Http\Controllers;

use App\Models\User as UserModel;
use Illuminate\Http\Request;
use PHPMailer\PHPMailer\PHPMailer;
use Firebase\JWT\ExpiredException;
use Exception;
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;
class User extends Controller 
{

    protected $usermodel;
    protected $mail;
    protected $jwtcode;

    public function __construct()
    {   
        $this->jwtcode = new JWT();
        $this->usermodel = new UserModel();
        $this->mail = new PHPMailer(true);
    }
    public function login(Request $request)
    {
        $account = $request->input('account');
        $password = $request->input('password');
        $response['result'] = $this->usermodel->login($account, $password);
        if (count($response['result']) > 0) {
            if ($response['result'][0]->enable == 0) {
                $response['status'] = 400;
                $response['message'] = '帳號未啟用';
                return $response;
            }
            $response['status'] = 200;
            $response['message'] = '登入成功';
            $object = $response['result'][0];
            $userName = $object->userName;
            $response['token'] = $this->genToken($userName);
        } else {
            $response['status'] = 400;
            $response['message'] = '登入失敗';
        }
        return $response;
    }

    public function register(Request $request)
    {
        $userName = $request->input('userName');
        $phone = $request->input('phone');
        $address = $request->input('address');
        $pay = $request->input('pay');
        $account = $request->input('account');
        $password = $request->input('password');
        $email = $request->input('email');
        if ($this->usermodel->register($userName, $phone, $address, $pay,$account,$password,$email) == 1) {
            $response['status'] = 200;
            $response['message'] = '註冊成功';
        } else {
            $response['status'] = 400;
            $response['message'] = '資料不得為空值';
        }
        return $response;
    }
  
    public function AccountEnable(Request $request)
    {
        $userName = $request->input('userName');
        $userModel = new UserModel();
        $response = $userModel->is_enable($userName);
        if ($response) {
        } else {
            return response()->json(['message' => '登入或未啟用'], 401);
        }
    }

    private function genToken($id){
        $secret_key = "C110156119";
        $issuer_claim = "http://blog.vhost.com";
        $audience_claim = "http://blog.vhost.com";
        $issuedat_claim = time(); // issued at
        $expire_claim = $issuedat_claim + 600;
        $payload = array(
            "iss" => $issuer_claim,
            "aud" => $audience_claim,
            "iat" => $issuedat_claim,
            "exp" => $expire_claim,
            "data" => array(
                "id" => $id,
        ));
        $jwt = JWT::encode($payload, $secret_key, 'HS256');
        return $jwt;

    }

    public function activate_account(Request $request)
    {
        $email = $request->input('email');
        if ($this->usermodel->activate_account($email) != 0) {
            $response['status'] = 200;
            $response['message'] = '帳號已啟用';
        } else {
            $response['status'] = 400;
            $response['message'] = '帳號啟用失敗';
        }
        return $response;
    }

    public function foget_password(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');
        $response['result'] = $this->usermodel->foget_password($email, $password);
        if ($response['result'] > 0) {
            $response['status'] = 200;
            $response['message'] = '密碼已更改';
            // $response['message'] = '已寄送驗證信';
        } else {
            $response['status'] = 400;
            $response['message'] = '更改失敗';
        }
        return $response;
    }

    public function is_enough(Request $request)
    {   
        $jwt = $this->checkToken($request);
        if($jwt){
            return $jwt;
        }

        $userName = $request->input('userName');
        $amount = $request->input('amount');
        
        $function_name = __FUNCTION__; // 獲取當前函數的名稱
        $response = $this->check_role($userName, $function_name);
        if(!($response['status'] == 200)){
            return $response;
        }
        $response['result'] = $this->usermodel->is_enough($userName, $amount);
        if ($response['result']) {
            $response['status'] = 200;
            $response['message'] = '餘額充足';
        } elseif($response['result']['enable'] == 1) {
            $response['status'] = 400;
            $response['message'] = '帳號未啟用請啟用帳號';
        } else {
            $response['status'] = 400;
            $response['message'] = '餘額不足';
        }
        return $response;
    }
    
    public function dice_game(Request $request)
    {   
        $jwt = $this->checkToken($request);
        if($jwt){
            return $jwt;
        }
        $userName = $request->input('userName');    
        $amount = $request->input('amount');
        $amount_temp = $amount;
        $function_name = __FUNCTION__; // 獲取當前函數的名稱
        $check_role = $this->check_role($userName, $function_name);
        if(!($check_role['status'] == 200)){
            return $check_role;
        }
        $response['result']['other_side'] = [rand(0, 5), rand(0, 5)];
        $response['result']['Dice_value'] = [rand(0, 5), rand(0, 5)];
        $total_other_side = array_sum($response['result']['other_side']);
        $total_Dice_value = array_sum($response['result']['Dice_value']);

        if ($total_Dice_value > $total_other_side) {
            $response['result']['status'] = 200;
            $response['result']['message'] = '你贏了';
            $amount = $amount * 2;
            $response['result']['win_money'] = $amount;
        } else {
            $response['result']['status'] = 204;
            $response['result']['message'] = '你輸了';
            $amount = -$amount;
            $response['result']['win_money'] = $amount;
        }

        $response['result']['web_result'] = $this->usermodel->dice_game($userName, $amount);
        if ( $response['result']['web_result']) {
            $response['status'] = 200;
            $response['message'] = '成功';
        }else {
            $response['status'] = 400;
            $response['message'] = '數值異常';
        }
        $this->usermodel->into_play_list($userName, $function_name , $amount_temp, $amount);
        return $response;
    }

    public function slot_machine(Request $request)
    {   
        $jwt = $this->checkToken($request);
        if($jwt){
            return $jwt;
        }
        $userName = $request->input('userName');
        $amount = $request->input('amount');
        $amount_temp = $amount;
    
        $function_name = __FUNCTION__; // 獲取當前函數的名稱
        $check_role = $this->check_role($userName, $function_name);
        if(!($check_role['status'] == 200)){
            return $check_role;
        }
        $response['result']['slot_machine'] = [rand(0, 6), rand(0, 6), rand(0, 6)];
        $value_counts = array_count_values($response['result']['slot_machine']);
        $multipliers = [
            7 => 10,
            6 => 5,
            5 => 3,
            4 => 2,
            3 => 1.5,
            2 => 1.8,
            1 => 1.5
        ];
        
        // 检查是否有相同的三个数字组合
        foreach ($multipliers as $num => $multiplier) {
            if ($response['result']['slot_machine'] === [$num, $num, $num]) {
                $response['result']['status'] = 200;
                $response['result']['message'] = '你贏了';
                $amount *= $multiplier;
                $response['result']['win_money'] = $amount;
                $response['result']['web_result'] = $this->usermodel->slot_machine($userName, $amount);
                if ( $response['result']['web_result']) {
                    $response['status'] = 200;
                    $response['message'] = '成功';
                } elseif($response['result']['enable'] == 1) {
                    $response['status'] = 400;
                    $response['message'] = '帳號未啟用請啟用帳號';
                }else {
                    $response['status'] = 400;
                    $response['message'] = '數值異常';
                }
                $this->usermodel->into_play_list($userName, $function_name , $amount_temp, $amount);
                return $response;
                exit;
            }
        }
        
        // 使用 for 循环检查 1 到 7 的每个数字是否出现两次
        for ($i = 1; $i <= 7; $i++) {
            if (isset($value_counts[$i]) && $value_counts[$i] == 2) {
                $response['result']['status'] = 200;
                $response['result']['message'] = '你贏了';
                $amount *= 1.2;
                $response['result']['win_money'] = $amount;
                $response['result']['web_result'] = $this->usermodel->slot_machine($userName, $amount);
                if ( $response['result']['web_result']) {
                    $response['status'] = 200;
                    $response['message'] = '成功';
                }  elseif($response['result']['enable'] != 1) {
                    $response['status'] = 400;
                    $response['message'] = '帳號未啟用請啟用帳號';
                }   else {
                    $response['status'] = 400;
                    $response['message'] = '數值異常';
                }
                $this->usermodel->into_play_list($userName, $function_name , $amount_temp, $amount);
                return $response;
                exit;
            }
        }
        
        // 如果没有任何获胜组合
        $response['result']['status'] = 204;
        $response['result']['message'] = '你輸了';
        $amount = -$amount;
        $response['result']['win_money'] = $amount;

        $response['result']['web_result'] = $this->usermodel->slot_machine($userName, $amount);
        if ( $response['result']['web_result']) {
            $response['status'] = 200;
            $response['message'] = '成功';
        }else {
            $response['status'] = 400;
            $response['message'] = '數值異常';
        }
        $this->usermodel->into_play_list($userName, $function_name , $amount_temp, $amount);
        return $response;
    }

    public function topup(Request $request)
    {   
        $jwt = $this->checkToken($request);
        if($jwt){
            return $jwt;
        }
        $userName = $request->input('userName');
        $amount = $request->input('amount');
        
        $function_name = __FUNCTION__; // 獲取當前函數的名稱
        $response = $this->check_role($userName, $function_name);
        if(!($response['status'] == 200)){
            return $response;
        }
        $response['result'] = $this->usermodel->topup($userName, $amount);
        if ($response['result']) {
            $response['status'] = 200;
            $response['message'] = '儲值成功';
        }else {
            $response['status'] = 400;
            $response['message'] = '數值異常';
        }
        return $response;
    }

    public function withdrawmoney(Request $request)
    {   
        $jwt = $this->checkToken($request);
        if($jwt){
            return $jwt;
        }
        $userName = $request->input('userName');
        $amount = $request->input('amount');
        $function_name = __FUNCTION__; // 獲取當前函數的名稱
        $response = $this->check_role($userName, $function_name);
        if(!($response['status'] == 200)){
            return $response;
        }
        $response['result'] = $this->usermodel->withdrawmoney($userName, $amount);
        if ($response['result']) {
            $response['status'] = 200;
            $response['message'] = '提款成功';
        }else {
            $response['status'] = 400;
            $response['message'] = '數值異常';
        }
        return $response;
    }
    
    public function getVerificationCode(Request $request) {
        $email = $request->input('email');

        $Verification_code = rand(1000, 9999);
        $time =  time();
        
        $this->mail->SMTPDebug = 0;                              // Enable verbose debug output
        $this->mail->isSMTP();
        $this->mail->SMTPAuth = true;
        $this->mail->Host = 'smtp.gmail.com';
        $this->mail->SMTPSecure = 'tls';
        $this->mail->Port = 587;
        $this->mail->Username = 'c110156109@nkust.edu.tw';
        $this->mail->Password = 'A130984109';

        $this->mail->setFrom('c110156109@nkust.edu.tw', 'Mailer');
        $this->mail->addAddress($email);
        $this->mail->isHTML(true);
        $this->mail->Subject = 'Verification Code';
        $this->mail->Body = 'Verification Code: ' . $Verification_code;
        $this->mail->send();

        $response['result'] = $this->usermodel->getVerificationCode($email, $Verification_code);
        if ($response['result']) {
            $response['status'] = 200;
            $response['message'] = '已發送驗證碼至電子信箱';
        } else {
            $response['status'] = 400;
            $response['message'] = '電子信箱不存在';
        }
        return $response;
    }
    public function getall_play_list(Request $request)
    {
        // $jwt = $this->checkToken($request);
        // if($jwt){
        //     return $jwt;
        // }
        
        $userName = $request->input('userName');
        
        $calling_function_name = __FUNCTION__; // 獲取當前函數的名稱
        $role = $this->check_role($userName, $calling_function_name);
        if(!($role['status']==200)){
            return $role;
        }
        $userName = $request->input('userName');
        $response['result'] = $this->usermodel->getall_play_list($userName);
        if ($response['result']) {
            $response['status'] = 200;
            $response['message'] = '成功';
        } else {
            $response['status'] = 400;
            $response['message'] = '失敗';
        }
        return $response;
    }
    public function checkVerificationCode(Request $request)
    {  
        $email = $request->input('email');
        $Verification_code = $request->input('Verification_code');
        $response['result'] = $this->usermodel->checkVerificationCode($email, $Verification_code);
        if ($response['result']) {
            $response['status'] = 200;
            $response['message'] = '驗證成功';
        } else {
            $response['status'] = 400;
            $response['message'] = '驗證失敗';
        }
        return $response;
    }

    public function check_role($userName, $calling_function_name)
    {
        $response['result'] = false;
        $response['result'] = $this->usermodel->check_role($userName, $calling_function_name);
        if ($response['result']) {
            $response['status'] = 200;
            $response['message'] = '有權限';
        } else{
            $response['status'] = 400;
            $response['message'] = '無權限';
        }
        return $response;
    }
    public function checkToken($request){
        $jwtToken = $request->header('jwtToken');
        $secret_key = "C110156119";
        
        if (empty($jwtToken)) {
            // 如果沒有提供 jwtToken
            return response()->json(['message' => 'Token未提供'], 400);
        }
        $jwtToken = trim($jwtToken, '"');
        try {
            $payload = JWT::decode($jwtToken, new Key($secret_key, 'HS256'));
            // 如果解碼成功
        } catch (Exception $e) {
            // 如果解碼失敗，回傳 token 錯誤
            return response()->json(['message' => 'Token錯誤'], 401);
        }
    }

}   
