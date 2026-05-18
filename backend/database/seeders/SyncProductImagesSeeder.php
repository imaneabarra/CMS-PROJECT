<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class SyncProductImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $updates = [
            1  => 'products/nvr-hikvision-32-channels-4k-ds-7732nxi-k4.jpg',
            2  => 'products/Dahua 16-Channel DVR.jpg',
            3  => 'products/Hikvision 4K Dome Camera.jpg',
            4  => 'products/Dahua Bullet IP Camera.jpg',
            5  => 'products/ZKTeco SpeedFace-V5L.jpg',
            6  => 'products/Fingerprint Scanner Pro.webp',
            7  => 'products/TP-Link Archer AX55.webp',
            9  => 'products/Dell Latitude 5430.webp',
            11 => 'products/HP ProTower G9.png',
        ];

        foreach ($updates as $id => $path) {
            Product::where('id', $id)->update(['image' => $path]);
        }
    }
}
