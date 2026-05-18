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
                    'image' => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Dahua 16-Channel DVR',
                    'price' => 280,
                    'description' => 'Hybrid Digital Video Recorder for analog and IP cameras.',
                    'image' => 'https://images.unsplash.com/photo-1524143878510-e3b8d6312402?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'cctv-cameras' => [
                [
                    'name' => 'Hikvision 4K Dome Camera',
                    'price' => 120,
                    'description' => 'High-resolution indoor/outdoor dome camera with night vision.',
                    'image' => 'https://images.unsplash.com/photo-1551817812-790176866160?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Dahua Bullet IP Camera',
                    'price' => 95,
                    'description' => 'Weatherproof bullet camera with wide-angle lens and AI analytics.',
                    'image' => 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'access-control' => [
                [
                    'name' => 'ZKTeco SpeedFace-V5L',
                    'price' => 380,
                    'description' => 'Facial recognition terminal with body temperature detection.',
                    'image' => 'https://images.unsplash.com/photo-1555864326-5cf22ef123cf?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Fingerprint Scanner Pro',
                    'price' => 150,
                    'description' => 'USB biometric fingerprint scanner for secure logins and access.',
                    'image' => 'https://images.unsplash.com/photo-1510511459019-5dee2c127bb0?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'networking' => [
                [
                    'name' => 'TP-Link Archer AX55',
                    'price' => 140,
                    'description' => 'Dual-Band Wi-Fi 6 Router with high-speed performance.',
                    'image' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Cisco 24-Port Gigabit Switch',
                    'price' => 320,
                    'description' => 'Managed switch for high-performance enterprise networks.',
                    'image' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'pc-portables' => [
                [
                    'name' => 'Dell Latitude 5430',
                    'price' => 1200,
                    'description' => 'Professional business laptop with i7 processor and 16GB RAM.',
                    'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'ASUS VivoBook 15',
                    'price' => 850,
                    'description' => 'Slim and powerful laptop for everyday productivity.',
                    'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'pc-bureau' => [
                [
                    'name' => 'HP ProTower G9',
                    'price' => 950,
                    'description' => 'Powerful desktop tower for office and creative work.',
                    'image' => 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Dell OptiPlex 7000 Micro',
                    'price' => 780,
                    'description' => 'Compact and powerful micro-desktop for tight spaces.',
                    'image' => 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'printers-scanners' => [
                [
                    'name' => 'HP LaserJet Pro M404n',
                    'price' => 250,
                    'description' => 'Fast and reliable monochrome laser printer for business.',
                    'image' => 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Epson WorkForce Scanner',
                    'price' => 320,
                    'description' => 'High-speed document scanner with duplex scanning.',
                    'image' => 'https://images.unsplash.com/photo-1563906267088-b029e7101114?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'smart-home-domotics' => [
                [
                    'name' => 'Smart Video Intercom',
                    'price' => 220,
                    'description' => 'Touchscreen intercom with mobile app integration.',
                    'image' => 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Smart Thermostat V2',
                    'price' => 180,
                    'description' => 'Intelligent climate control for your home or office.',
                    'image' => 'https://images.unsplash.com/photo-1518005020250-68aef9f3c1d9?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'security-systems' => [
                [
                    'name' => 'Complete Home Security Kit',
                    'price' => 450,
                    'description' => 'All-in-one security bundle with cameras and sensors.',
                    'image' => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'X-Ray Scanner Pro',
                    'price' => 5000,
                    'description' => 'Professional security scanner for high-security areas.',
                    'image' => 'https://images.unsplash.com/photo-1541888941255-25217a944369?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'accessories-peripherals' => [
                [
                    'name' => 'Logitech Wireless Mouse MX',
                    'price' => 95,
                    'description' => 'Ergonomic wireless mouse for maximum productivity.',
                    'image' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Mechanical Keyboard RGB',
                    'price' => 120,
                    'description' => 'Premium mechanical keyboard with customizable lighting.',
                    'image' => 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'storage-devices' => [
                [
                    'name' => 'Kingston 1TB NVMe SSD',
                    'price' => 110,
                    'description' => 'Ultra-fast storage for PCs and laptops.',
                    'image' => 'https://images.unsplash.com/photo-1597872200349-016042e54a65?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Seagate 4TB External HDD',
                    'price' => 130,
                    'description' => 'High-capacity external storage for backups.',
                    'image' => 'https://images.unsplash.com/photo-1531492746076-1a1bd9b29fc0?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'monitors' => [
                [
                    'name' => 'Dell 27-inch 4K Monitor',
                    'price' => 380,
                    'description' => 'Stunning 4K resolution with IPS panel for professional work.',
                    'image' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Samsung Curved Monitor 32"',
                    'price' => 420,
                    'description' => 'Immersive curved display for gaming and multi-tasking.',
                    'image' => 'https://images.unsplash.com/photo-1547119957-630f9c44b798?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'smart-devices' => [
                [
                    'name' => 'Amazon Echo Hub',
                    'price' => 150,
                    'description' => 'Central control for all your smart home devices.',
                    'image' => 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Smart Watch Pro Series',
                    'price' => 280,
                    'description' => 'Advanced fitness and connectivity on your wrist.',
                    'image' => 'https://images.unsplash.com/photo-1544117518-29057b972161?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'office-equipment' => [
                [
                    'name' => 'Paper Shredder Ultra',
                    'price' => 180,
                    'description' => 'High-security cross-cut paper shredder for office use.',
                    'image' => 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Label Maker Professional',
                    'price' => 65,
                    'description' => 'Handy label printer for organizing your workspace.',
                    'image' => 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            'alarm-systems' => [
                [
                    'name' => 'Wireless Smart Alarm Kit',
                    'price' => 240,
                    'description' => 'Complete wireless alarm system with mobile alerts.',
                    'image' => 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
                ],
                [
                    'name' => 'Outdoor Siren with Strobe',
                    'price' => 85,
                    'description' => 'High-decibel outdoor siren to deter intruders.',
                    'image' => 'https://images.unsplash.com/photo-1524143878510-e3b8d6312402?auto=format&fit=crop&q=80&w=800',
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
