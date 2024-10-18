<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

use Illuminate\Http\Response;

$router->get('/api/getEmail', "User@getEmail");
$router->post('/api/register', 'User@register');
$router->post('/api/login', 'User@login');
$router->post('/api/activate_account', 'User@activate_account');
$router->patch('/api/foget_password', 'User@foget_password');
$router->get('/api/is_enough', 'User@is_enough');
$router->patch('/api/dice_game','User@dice_game');
$router->patch('/api/slot_machine','User@slot_machine');
$router->patch('/api/topup','User@topup');
$router->patch('/api/withdrawmoney','User@withdrawmoney');
$router->get('/api/getVerificationCode', 'User@getVerificationCode');
$router->post('/api/checkVerificationCode', 'User@checkVerificationCode');
$router->get('/api/getall_paly_list', 'User@getall_play_list');


$router->get('/test', function () {
    return response()->json(['message' => 'CORS 設置成功']);
});





