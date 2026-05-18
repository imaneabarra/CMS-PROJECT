<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SyncAllImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $files = Storage::disk('public')->files('products');
        
        foreach ($products as $product) {
            $productName = $product->name;
            $bestMatch = null;

            // Try exact name match (ignoring extension)
            foreach ($files as $file) {
                $filename = pathinfo($file, PATHINFO_FILENAME);
                
                // Clean both for comparison
                $cleanProduct = Str::slug($productName);
                $cleanFile = Str::slug($filename);

                if ($cleanProduct === $cleanFile) {
                    $bestMatch = $file;
                    break;
                }
            }

            // Manual fallbacks for tricky names
            if (!$bestMatch) {
                if ($productName === 'Hikvision 32-Channel NVR') {
                    $bestMatch = 'products/nvr-hikvision-32-channels-4k-ds-7732nxi-k4.jpg';
                } elseif (str_contains($productName, 'Samsung Curved Monitor')) {
                    $bestMatch = 'products/Samsung Curved Monitor 32.jpg';
                }
            }

            if ($bestMatch) {
                $product->update(['image' => $bestMatch]);
                $this->command->info("Matched: {$productName} -> {$bestMatch}");
            } else {
                $this->command->warn("No match found for: {$productName}");
            }
        }
    }
}
