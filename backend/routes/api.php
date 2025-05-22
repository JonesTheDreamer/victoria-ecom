<?php

use App\Http\Controllers\api\CartController;
use App\Http\Controllers\api\CheckoutController;
use App\Http\Controllers\api\CheckoutProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(["prefix" => "user", "namespace"], function () {
    Route::post("/", [AuthController::class, "register"]);
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/logout", [AuthController::class, "logout"])->middleware("auth:sanctum");
});

Route::group(["prefix" => "checkouts", "middleware" => "auth:sanctum"], function () {
    Route::get('/', [CheckoutController::class, "index"])->middleware("role:EMPLOYEE");
    Route::post('/', [CheckoutController::class, "store"])->middleware("role:CUSTOMER");
    Route::get('/user', [CheckoutController::class, "show"])->middleware("role:CUSTOMER");
});

Route::get("/products", [ProductController::class, "index"]);
Route::apiResource('products', ProductController::class)->except(["index"])->middleware(['auth:sanctum', 'role:EMPLOYEE']);

Route::apiResource('carts', CartController::class)->middleware(["auth:sanctum", "role:CUSTOMER"]);