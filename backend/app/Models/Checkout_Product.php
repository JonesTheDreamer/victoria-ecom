<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Checkout_Product extends Model
{
    /** @use HasFactory<\Database\Factories\Checkout_ProductFactory> */
    use HasFactory;

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function Checkout()
    {
        return $this->belongsTo(Checkout::class);
    }

    protected $fillable = [
        'checkout_id',
        'product_id',
        'quantity',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'checkout_id' => 'integer',
            'product_id' => 'integer',
            'quantity' => 'integer',
        ];
    }
}