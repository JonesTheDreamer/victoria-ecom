<?php

namespace App\Http\Controllers\api;

use App\Models\Checkout;
use App\Models\Checkout_Product;
use App\Models\Product;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CheckoutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkouts = Checkout::with([
            'Checkout_Product' => function ($query) {
                $query->with(['product']);
            },
            "user"
        ])->get();
        return response()->json(["data" => $checkouts], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'total_amount' => 'required|numeric',
            'checkoutProducts' => 'required|array',
            'checkoutProducts.*.product_id' => 'required|exists:products,id',
            'checkoutProducts.*.quantity' => 'nullable|integer',
        ]);

        $validated["user_id"] = auth()->user()->id;

        $data = Checkout::create($validated);

        foreach ($validated["checkoutProducts"] as $temp) {
            $checkoutProduct = new Checkout_Product();
            $checkoutProduct->checkout_id = $data->id;
            $checkoutProduct->product_id = $temp['product_id'];
            $checkoutProduct->quantity = $temp['quantity'];
            $checkoutProduct->save();
            $updateStock = Product::findOrFail($temp["product_id"]);
            $updateStock->stock -= $temp["quantity"];
            $updateStock->save();
            $cart = Cart::where('user_id', $validated["user_id"])->where("product_id", $temp["product_id"])->first();
            $cart->delete();
        }



        return response()->json(["data" => "Added Successfully"], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $checkouts = Checkout::where('user_id', auth()->user()->id)->with([
            'Checkout_Product' => function ($query) {
                $query->with(['product']);
            },
            "user"
        ])->get();

        return response()->json(["data" => $checkouts], 200);
    }
}