<?php
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;

class TokenMiddleware
{
    public function handle($request, Closure $next, $guard = null) {
    $token = $request->get('token');

    
    return $next($request);
}}

