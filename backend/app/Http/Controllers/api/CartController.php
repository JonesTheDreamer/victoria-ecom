<?php

namespace App\Http\Controllers\api;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $carts = Cart::where('user_id', auth()->user()->id)->with('product')->get();
        if ($carts->count() > 0) {
            $carts->map(function ($cart) {
                $cart->product->image = Storage::disk('public')->url("product_image/" . $cart->product->image);
            });
        }

        return response()->json(["data" => $carts], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|numeric'
            ]);
            $validated["user_id"] = auth()->user()->id;

            $product = Product::find($validated["product_id"]);
            if ($validated["quantity"] > $product->stock) {
                return response()->json(["message" => "Insufficient stock available"], 400);
            }

            $duplicate = Cart::where('user_id', auth()->id())->where("product_id", $validated["product_id"])->first();
            if ($duplicate) {
                $duplicate->quantity += (int) $validated["quantity"];
                $duplicate->save();
                return response()->json(["data" => $duplicate], 201);
            }

            $data = Cart::create($validated);

            return response()->json(["data" => $data], 201);

        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 400);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Cart $cart)
    {
        if (auth()->user()->id !== $cart->user_id) {
            return response()->json(["data" => "No data found"], 404);
        }
        $cart->product;
        $cart->product->image = Storage::disk('public')->url("product_image/" . $cart->product->image);

        return response()->json(["data" => $cart], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cart $cart)
    {
        $user = auth()->user();

        $cart = Cart::where('id', $cart->id)->where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        if ($validated['quantity'] === 0) {
            $cart->delete();
            return response()->json(['message' => 'Cart item deleted due to zero quantity']);
        }

        $cart->quantity = $validated['quantity'];
        $cart->save();

        return response()->json(['message' => 'Cart quantity updated', 'cart' => $cart], 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cart $cart)
    {
        try {

            if (auth()->user()->id !== $cart->user_id) {
                return response()->json(["data" => "No data found"], 404);
            }

            $cart->delete();

            return response()->json(["message" => "Deleted"], 200);

        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 400);
        }
    }
}