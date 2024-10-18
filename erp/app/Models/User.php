<?php

namespace App\Models;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User 
{   


    public function getEmail($email){
        $sql = "select * from user where email=:email";
        $user = DB::select($sql, ['email'=>$email]);

        // 如果找到了用戶，表示電子郵件存在
        // 如果沒有找到用戶，表示電子郵件不存在
        return $user ? true : false;
    }
    
    public function register($userName, $phone, $address, $pay,$account,$password,$email)
    {
        $sql = "insert into user (userName, phone, address, pay,account,password,email) values (:userName, :phone, :address, :pay, :account, :password, :email)";
        $response = DB::insert($sql, ['userName' => $userName, 'phone' => $phone, 'address' => $address,'pay'=>$pay ,'account' => $account, 'password' => $password,'email'=>$email]);
        return $response;
    }

    public function login ($account, $password){
        $sql = "select * from user where account=:account and password=:password";
        $response = DB::select($sql, ['account'=>$account, 'password'=>$password]);
        return  $response;
    }
    public function activate_account ($email){
        $sql = "UPDATE user SET `enable` = 1 WHERE email = :email";
        $response = DB::update($sql, ['email'=>$email]);
        return $response;
    }

    public function foget_password ($email, $password){
        $sql = "UPDATE user SET password = :password WHERE email = :email";
        $response = DB::update($sql, ['email'=>$email, 'password'=>$password]);
        return $response;
    }

    public function is_enough ($userName, $amount){
        $sql = "select * from user where userName= :userName and balance >= :amount";
        $response = DB::select($sql, ['userName'=>$userName, 'amount'=>$amount]);
        return $response ;
    }
    // 倍率帶改
    public function dice_game ($userName, $amount){
        $sql = "UPDATE user SET balance = balance + :amount WHERE userName = :userName";
        $response = DB::update($sql, ['userName'=>$userName, 'amount'=>$amount]);
        return $response;
    }

    public function slot_machine ($userName, $amount){
        $sql = "UPDATE user SET balance = balance + :amount WHERE userName = :userName And enable = 1";
        $response = DB::update($sql, ['userName'=>$userName, 'amount'=>$amount]);
        return $response;
    }

    public function topup ($userName, $amount){
        $sql = "UPDATE user SET balance = balance + :amount WHERE userName = :userName";
        $response = DB::update($sql, ['userName'=>$userName, 'amount'=>$amount]);
        return $response;
    }

    public function withdrawmoney ($userName, $amount){
        $sql = "UPDATE user SET balance = balance - :amount WHERE userName = :userName";
        $response = DB::update($sql, ['userName'=>$userName, 'amount'=>$amount]);
        return $response;
    }

    public function getVerificationCode($email,$Verification_code) {

        $sql = "UPDATE user SET Verification_code = :Verification_code WHERE email = :email ";

        $response = DB::update($sql, ['email'=>$email, 'Verification_code'=>$Verification_code]);
        return $response;
    }

    public function checkVerificationCode($email,$Verification_code){
        $sql = "select * from user where email=:email and Verification_code=:Verification_code";
        $response = DB::select($sql, ['email'=>$email, 'Verification_code'=>$Verification_code]);
        return $response ? true : false;
    }
    
    public function is_enable($userName){
        $sql = "select * from user where userName=:userName and enable=1";
        $response = DB::select($sql, ['userName'=>$userName]);
        return $response ? true : false;
    }

    public function check_role($userName,$function_name){
        $sql = 'SELECT * from module_permissions,user,roles 
        where user.userName = :userName 
        and module_permissions.Name = :function_name
        AND user.enable = roles.roles_id 
        and roles.roles_id =module_permissions.role_id;';
        $response = DB::select($sql, ['userName'=>$userName,'function_name'=>$function_name]);
        return $response ? true : false;;
    }

    public function into_play_list($userName,$game_name,$amount,$win_money){
        $time = time();
        $time = date("Y-m-d H:i:s",$time);
        $sql = "insert into `play_list` (user_Name, game_name,time,amount,win_money) values (:userName, :game_name, :time, :amount, :win_money)";
        $response = DB::insert($sql, ['userName'=>$userName, 'game_name'=>$game_name, 'time'=>$time, 'amount'=>$amount, 'win_money'=>$win_money]);
        return $response;
    }
    public function getall_play_list($userName){
        $sql = "select * from play_list where user_Name=:userName";
        $response = DB::select($sql, ['userName'=>$userName]);
        return $response;
    }
    

    // public function removeUser($id){
    //     $sql = "delete from user where id=:id";
    //     $response = DB::delete($sql, ['id'=>$id]);
    //     return $response;
    // }

   

    // public function register($id, $pass, $name, $email){
    //     $sql = "insert into user (userName, phone, address, pay,account,password) values (:userName, :phone, :address, :pay, :account, :password)";
    //     $response = DB::insert($sql, ['id'=>$id, 'name'=>$name, 'pass'=>$pass, 'email'=>$email]);
    //     return $response;
    // }
}
