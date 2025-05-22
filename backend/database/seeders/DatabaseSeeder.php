<?php

namespace Database\Seeders;

use App\Models\Checkout;
use App\Models\Cart;
use App\Models\Checkout_Product;
use App\Models\User;
use App\Models\Product;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create([
            "name" => "employee",
            "email" => "ihome@email.com",
            "password" => "ihome",
            "role" => "EMPLOYEE"
        ]);

        User::factory()->create([
            "name" => "John Doe",
            "email" => "johndoe@email.com",
            "password" => "johndoe",
            "role" => "CUSTOMER"
        ]);

        Product::factory()->create([
            'name' => "VIMLE Sofa",
            'description' => "Lorem ipsum dolor sit, debitis repudiandae accusantium nobis explicabo? Repudiandae ipsum nostrum quae! Asperiores.",
            'price' => 44000,
            'stock' => 20,
            'image' => "1_VIMLE_Sofa.jpg",
        ]);

        Product::factory()->create([
            'name' => "Hauge Dining Setup",
            'description' => "Lorem ipsum dolor sit, debitis repudiandae accusantium nobis explicabo? Repudiandae ipsum nostrum quae! Asperiores.",
            'price' => 31000,
            'stock' => 11,
            'image' => "2_Hauge_Dining_Setup.jpg"
        ]);


        Product::factory()->create([
            'name' => "Otlsh Arched Mirror",
            'description' => "Lorem ipsum dolor sit, debitis repudiandae accusantium nobis explicabo? Repudiandae ipsum nostrum quae! Asperiores.",
            'price' => 4000,
            'stock' => 23,
            'image' => "3_Otlsh_Arched_Mirror.jpg"
        ]);

        Product::factory()->create([
            'name' => "Endy Wooden Bed",
            'description' => "Lorem ipsum dolor sit, debitis repudiandae accusantium nobis explicabo? Repudiandae ipsum nostrum quae! Asperiores.",
            'price' => 27500,
            'stock' => 20,
            'image' => "4_Endy_Wooden_Bed.jpg"
        ]);

        Product::factory()->create([
            'name' => "Wool Rug",
            'description' => "Lorem ipsum dolor sit, debitis repudiandae accusantium nobis explicabo? Repudiandae ipsum nostrum quae! Asperiores.",
            'price' => 1300,
            'stock' => 15,
            'image' => "5_Wool_Rug.jpg"
        ]);

        Checkout::factory()->create([
            'total_amount' => 53000,
            "user_id" => 2,
            "created_at" => "2025-05-20T06:48:29.000000Z",
            "updated_at" => "2025-05-20T06:48:29.000000Z"
        ]);

        Checkout_Product::factory()->create([
            'checkout_id' => 1,
            'product_id' => 5,
            "quantity" => 1
        ]);

        Checkout_Product::factory()->create([
            'checkout_id' => 1,
            'product_id' => 4,
            "quantity" => 1
        ]);

        Checkout::factory()->create([
            'total_amount' => 2750,
            "user_id" => 2
        ]);

        Checkout_Product::factory()->create([
            'checkout_id' => 2,
            'product_id' => 3,
            "quantity" => 1
        ]);

        Checkout::factory()->create([
            'total_amount' => 90000,
            "user_id" => 2
        ]);

        Checkout_Product::factory()->create([
            'checkout_id' => 3,
            'product_id' => 2,
            "quantity" => 2
        ]);

        Cart::factory()->create([
            "user_id" => 2,
            "product_id" => 1,
            "quantity" => 2
        ]);

        Cart::factory()->create([
            "user_id" => 2,
            "product_id" => 4,
            "quantity" => 2
        ]);

        Cart::factory()->create([
            "user_id" => 2,
            "product_id" => 3,
            "quantity" => 1
        ]);

        Cart::factory()->create([
            "user_id" => 2,
            "product_id" => 5,
            "quantity" => 1
        ]);

    }
}