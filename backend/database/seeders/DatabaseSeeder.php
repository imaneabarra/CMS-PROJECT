<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin12345'),
            'role' => 'ADMIN',
        ]);

        // 2. Define 15 Categories as requested
        $categoriesData = [
            ['name' => 'Video Surveillance', 'slug' => 'video-surveillance'],
            ['name' => 'CCTV Cameras', 'slug' => 'cctv-cameras'],
            ['name' => 'Access Control', 'slug' => 'access-control'],
            ['name' => 'Networking', 'slug' => 'networking'],
            ['name' => 'PC Portables', 'slug' => 'pc-portables'],
            ['name' => 'PC Bureau', 'slug' => 'pc-bureau'],
            ['name' => 'Printers & Scanners', 'slug' => 'printers-scanners'],
            ['name' => 'Smart Home / Domotics', 'slug' => 'smart-home-domotics'],
            ['name' => 'Security Systems', 'slug' => 'security-systems'],
            ['name' => 'Accessories & Peripherals', 'slug' => 'accessories-peripherals'],
            ['name' => 'Storage Devices', 'slug' => 'storage-devices'],
            ['name' => 'Monitors', 'slug' => 'monitors'],
            ['name' => 'Smart Devices', 'slug' => 'smart-devices'],
            ['name' => 'Office Equipment', 'slug' => 'office-equipment'],
            ['name' => 'Alarm Systems', 'slug' => 'alarm-systems'],
        ];

        // 3. Define Products with UNIQUE images
        $productsBySlug = [
            'video-surveillance' => [
                [
                    'name' => 'Hikvision 32-Channel NVR',
                    'price' => 450,
                    'description' => 'Professional Network Video Recorder with 4K output and 32-channel support.',
                    'image' => 'products/nvr-hikvision-32-channels-4k-ds-7732nxi-k4.jpg',
                ],
                [
                    'name' => 'Dahua 16-Channel DVR',
                    'price' => 280,
                    'description' => 'Hybrid Digital Video Recorder for analog and IP cameras.',
                    'image' => 'products/Dahua 16-Channel DVR.jpg',
                ],
            ],
            'cctv-cameras' => [
                [
                    'name' => 'Hikvision 4K Dome Camera',
                    'price' => 120,
                    'description' => 'High-resolution indoor/outdoor dome camera with night vision.',
                    'image' => 'products/Hikvision 4K Dome Camera.jpg',
                ],
                [
                    'name' => 'Dahua Bullet IP Camera',
                    'price' => 95,
                    'description' => 'Weatherproof bullet camera with wide-angle lens and AI analytics.',
                    'image' => 'products/Dahua Bullet IP Camera.jpg',
                ],
            ],
            'access-control' => [
                [
                    'name' => 'ZKTeco SpeedFace-V5L',
                    'price' => 380,
                    'description' => 'Facial recognition terminal with body temperature detection.',
                    'image' => 'products/ZKTeco SpeedFace-V5L.jpg',
                ],
                [
                    'name' => 'Fingerprint Scanner Pro',
                    'price' => 150,
                    'description' => 'USB biometric fingerprint scanner for secure logins and access.',
                    'image' => 'products/Fingerprint Scanner Pro.webp',
                ],
            ],
            'networking' => [
                [
                    'name' => 'TP-Link Archer AX55',
                    'price' => 140,
                    'description' => 'Dual-Band Wi-Fi 6 Router with high-speed performance.',
                    'image' => 'products/TP-Link Archer AX55.webp',
                ],
                [
                    'name' => 'Cisco 24-Port Gigabit Switch',
                    'price' => 320,
                    'description' => 'Managed switch for high-performance enterprise networks.',
                    'image' => 'products/Cisco 24-Port Gigabit Switch.jpg',
                ],
            ],
            'pc-portables' => [
                [
                    'name' => 'Dell Latitude 5430',
                    'price' => 1200,
                    'description' => 'Professional business laptop with i7 processor and 16GB RAM.',
                    'image' => 'products/Dell Latitude 5430.webp',
                ],
                [
                    'name' => 'ASUS VivoBook 15',
                    'price' => 850,
                    'description' => 'Slim and powerful laptop for everyday productivity.',
                    'image' => 'products/ASUS VivoBook 15.jpg',
                ],
            ],
            'pc-bureau' => [
                [
                    'name' => 'HP ProTower G9',
                    'price' => 950,
                    'description' => 'Powerful desktop tower for office and creative work.',
                    'image' => 'products/HP ProTower G9.png',
                ],
                [
                    'name' => 'Dell OptiPlex 7000 Micro',
                    'price' => 780,
                    'description' => 'Compact and powerful micro-desktop for tight spaces.',
                    'image' => 'products/Dell OptiPlex 7000 Micro.jpg',
                ],
            ],
            'printers-scanners' => [
                [
                    'name' => 'HP LaserJet Pro M404n',
                    'price' => 250,
                    'description' => 'Fast and reliable monochrome laser printer for business.',
                    'image' => 'products/HP LaserJet Pro M404n.jpg',
                ],
                [
                    'name' => 'Epson WorkForce Scanner',
                    'price' => 320,
                    'description' => 'High-speed document scanner with duplex scanning.',
                    'image' => 'products/Epson WorkForce Scanner.jpg',
                ],
            ],
            'smart-home-domotics' => [
                [
                    'name' => 'Smart Video Intercom',
                    'price' => 220,
                    'description' => 'Touchscreen intercom with mobile app integration.',
                    'image' => 'products/Smart Video Intercom.jpg',
                ],
                [
                    'name' => 'Smart Thermostat V2',
                    'price' => 180,
                    'description' => 'Intelligent climate control for your home or office.',
                    'image' => 'products/Smart Thermostat V2.jpg',
                ],
            ],
            'security-systems' => [
                [
                    'name' => 'Complete Home Security Kit',
                    'price' => 450,
                    'description' => 'All-in-one security bundle with cameras and sensors.',
                    'image' => 'products/Complete Home Security Kit.jpg',
                ],
                [
                    'name' => 'X-Ray Scanner Pro',
                    'price' => 5000,
                    'description' => 'Professional security scanner for high-security areas.',
                    'image' => 'products/X-Ray Scanner Pro.jpg',
                ],
            ],
            'accessories-peripherals' => [
                [
                    'name' => 'Logitech Wireless Mouse MX',
                    'price' => 95,
                    'description' => 'Ergonomic wireless mouse for maximum productivity.',
                    'image' => 'products/Logitech Wireless Mouse MX.jpg',
                ],
                [
                    'name' => 'Mechanical Keyboard RGB',
                    'price' => 120,
                    'description' => 'Premium mechanical keyboard with customizable lighting.',
                    'image' => 'products/Mechanical Keyboard RGB.jpg',
                ],
            ],
            'storage-devices' => [
                [
                    'name' => 'Kingston 1TB NVMe SSD',
                    'price' => 110,
                    'description' => 'Ultra-fast storage for PCs and laptops.',
                    'image' => 'products/Kingston 1TB NVMe SSD.jpg',
                ],
                [
                    'name' => 'Seagate 4TB External HDD',
                    'price' => 130,
                    'description' => 'High-capacity external storage for backups.',
                    'image' => 'products/Seagate 4TB External HDD.jpg',
                ],
            ],
            'monitors' => [
                [
                    'name' => 'Dell 27-inch 4K Monitor',
                    'price' => 380,
                    'description' => 'Stunning 4K resolution with IPS panel for professional work.',
                    'image' => 'products/Dell 27-inch 4K Monitor.jpg',
                ],
                [
                    'name' => 'Samsung Curved Monitor 32"',
                    'price' => 420,
                    'description' => 'Immersive curved display for gaming and multi-tasking.',
                    'image' => 'products/Samsung Curved Monitor 32.jpg',
                ],
            ],
            'smart-devices' => [
                [
                    'name' => 'Amazon Echo Hub',
                    'price' => 150,
                    'description' => 'Central control for all your smart home devices.',
                    'image' => 'products/Amazon Echo Hub.jpg',
                ],
                [
                    'name' => 'Smart Watch Pro Series',
                    'price' => 280,
                    'description' => 'Advanced fitness and connectivity on your wrist.',
                    'image' => 'products/Smart Watch Pro Series.jpg',
                ],
            ],
            'office-equipment' => [
                [
                    'name' => 'Paper Shredder Ultra',
                    'price' => 180,
                    'description' => 'High-security cross-cut paper shredder for office use.',
                    'image' => 'products/Paper Shredder Ultra.jpg',
                ],
                [
                    'name' => 'Label Maker Professional',
                    'price' => 65,
                    'description' => 'Handy label printer for organizing your workspace.',
                    'image' => 'products/Label Maker Professional.jpg',
                ],
            ],
            'alarm-systems' => [
                [
                    'name' => 'Wireless Smart Alarm Kit',
                    'price' => 240,
                    'description' => 'Complete wireless alarm system with mobile alerts.',
                    'image' => 'products/Wireless Smart Alarm Kit.jpg',
                ],
                [
                    'name' => 'Outdoor Siren with Strobe',
                    'price' => 85,
                    'description' => 'High-decibel outdoor siren to deter intruders.',
                    'image' => 'products/Outdoor Siren with Strobe.jpg',
                ],
            ],
        ];

        // 4. Execute Seeding
        foreach ($categoriesData as $catData) {
            $category = Category::create([
                'name' => $catData['name'],
                'slug' => $catData['slug'],
            ]);

            if (isset($productsBySlug[$catData['slug']])) {
                foreach ($productsBySlug[$catData['slug']] as $index => $productData) {
                    Product::create([
                        'category_id' => $category->id,
                        'name' => $productData['name'],
                        'description' => $productData['description'],
                        'price' => $productData['price'],
                        'stock' => rand(10, 50),
                        'image' => $productData['image'],
                        'collection' => $category->name . ' Elite',
                        'badge' => ($index === 0) ? 'NEW' : (($index === 1) ? 'LIMITED' : null),
                    ]);
                }
            }
        }

        // 5. Correct Product Images
        $this->call(ProductImageSeeder::class);
    }
}
