<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();

        $imageMap = [
            'camera' => [
                'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1621528445282-475269786430?auto=format&fit=crop&q=80&w=800',
            ],
            'nvr' => [
                'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800', // Server/Hardware
                'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800', // Tech stack
            ],
            'networking' => [
                'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800', // Switch
                'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800', // Router
            ],
            'security' => [
                'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800', // Keypad
            ],
            'default' => [
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', // Abstract Tech
            ]
        ];

        foreach ($products as $product) {
            $name = strtolower($product->name);
            $category = strtolower($product->category->name ?? '');
            
            $imageUrl = '';

            if (str_contains($name, 'camera') || str_contains($name, 'cctv') || str_contains($name, 'hikvision')) {
                $imageUrl = $imageMap['camera'][array_rand($imageMap['camera'])];
            } elseif (str_contains($name, 'nvr') || str_contains($name, 'dvr') || str_contains($name, 'recorder')) {
                $imageUrl = $imageMap['nvr'][array_rand($imageMap['nvr'])];
            } elseif (str_contains($name, 'switch') || str_contains($name, 'router') || str_contains($name, 'networking')) {
                $imageUrl = $imageMap['networking'][array_rand($imageMap['networking'])];
            } elseif (str_contains($name, 'access') || str_contains($name, 'control') || str_contains($name, 'lock')) {
                $imageUrl = $imageMap['security'][array_rand($imageMap['security'])];
            } else {
                $imageUrl = $imageMap['default'][0];
            }

            $product->update(['image' => $imageUrl]);
        }
    }
}
