<?php

namespace App\Http\Controllers\API;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        try {

            $validated = $request->validate([
                'name' => "required|max:255",
                'email' => "required|email|unique:users",
                'password' => "required|min:6",
            ]);
            $validated["role"] = "CUSTOMER";
            $data = User::create($validated);
            return response()->json(["message" => "User {$data->name} is created", "user" => $data], 201);
        } catch (\Throwable $th) {
            return response()->json(["message" => "Error: {$th->getMessage()} "], 400);
        }

    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(["message" => "Credentials not found"], 404);
        }
        $token = $user->createToken($user->email);
        return response()->json(["message" => "Welcome {$user->name}", "user" => $user, "token" => $token->plainTextToken], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(["message" => "Logged out"], 200);
    }
}