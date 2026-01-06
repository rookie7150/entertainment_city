<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User as UserModel;

class CheckAccountEnable
{
    public function handle($request, Closure $next)
    {
        $userName = $request->input('userName');
        $userModel = new UserModel();
        $response = $userModel->is_enable($userName);
        if ($response) {
            return $next($request);
        } else {
            return response()->json(['message' => '登入或未啟用'], 401);
        }
    }
}