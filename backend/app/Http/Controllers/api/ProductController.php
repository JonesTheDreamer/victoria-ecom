<?php

namespace App\Http\Controllers\api;

use App\Models\Checkout;
use App\Models\Checkout_Product;
use App\Models\Product;
// use Illuminate\Container\Attributes\Storage;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        if ($products->count() > 0) {
            $products->map(function ($product) {
                $product->image = Storage::disk('public')->url("product_image/" . $product->image);
            });
        }
        return response()->json(["data" => $products], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => "required|max:255",
                'description' => "required|max:255",
                'price' => "required|numeric",
                'stock' => 'required|numeric',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
            ]);

            $data = Product::create($validated);
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename = $data->id . "_" . str_replace(" ", "_", $validated['name']) . '.' . $extension;
            $file = $file->storeAs('product_image', $filename, 'public');

            $data->image = $filename;
            $data->save();

            return response()->json(["data" => $data], 201);
        } catch (\Throwable $th) {
            return response()->json(["data" => $th->getMessage()], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $image = Storage::disk('public')->url("product_image/" . $product->image);
        $product->imageObj = $image;
        return response()->json(["data" => $product], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        try {
            $validated = $request->validate([
                'name' => "max:255",
                'description' => "max:255",
                'price' => "numeric",
                'stock' => 'numeric',
                'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
            ]);

            if (array_key_exists('name', $validated)) {
                $image_url = $product->image;
                $extension = pathinfo($image_url, PATHINFO_EXTENSION);
                $new = $product->id . "_" . str_replace(" ", "_", $validated['name']) . "." . $extension;
                Storage::disk('public')->move("product_image/{$image_url}", "product_image/$new");

                $product->image = $new;
                $product->save();
            }

            if (array_key_exists('image', $validated)) {
                $name = $product->name;
                if (array_key_exists('name', $validated)) {
                    $name = $validated["name"];
                }
                $old_image_path = $product->image;
                $file = $request->file('image');
                $extension = $file->getClientOriginalExtension();
                $new = $product->id . "_" . str_replace(" ", "_", $name) . "." . $extension;

                Storage::disk("public")->delete("product_image/{$old_image_path}");
                $file = $file->storeAs('product_image', $new, 'public');

                $validated["image"] = $new;
            }

            $product->update($validated);
            return response()->json(["message" => "Updated", "data" => $product], 200);
        } catch (\Throwable $th) {
            return response()->json(["data" => $th->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $isUsed = Checkout_Product::where("product_id", $product->id)->exists();
        if ($isUsed) {
            return response()->json(["message" => "Product details can't be deleted"], 400);
        }
        Storage::delete("public/product_image/{$product->image}");
        $product->delete();
        return response()->json(["message" => "Deleted"], 200);
    }
}