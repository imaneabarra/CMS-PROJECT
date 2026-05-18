<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\ActivityLog;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        // 1. Aggregated Monthly Sales (Include PENDING for Manual Checkout)
        $monthlySales = Order::whereIn('status', ['PENDING', 'COMPLETED'])
            ->select(
                DB::raw('SUM(total_price) as total'), 
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month')
            )
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->take(12)
            ->get();

        // 2. Daily Revenue Flow (Last 30 Days) as requested
        $revenueFlow = Order::whereIn('status', ['PENDING', 'COMPLETED'])
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->select(
                DB::raw('SUM(total_price) as revenue'),
                DB::raw('DATE(created_at) as date')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // 3. Top Velocity Hardware
        $topProducts = Product::withCount(['orderItems as units_deployed' => function($query) {
                $query->whereHas('order', function($q) {
                    $q->whereIn('status', ['PENDING', 'COMPLETED']);
                });
            }])
            ->orderBy('units_deployed', 'desc')
            ->take(5)
            ->get();

        // 4. Client Acquisition
        $newUsers = User::where('role', 'USER')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'monthly_sales' => $monthlySales,
            'revenue_flow' => $revenueFlow,
            'top_products' => ProductResource::collection($topProducts),
            'new_users' => $newUsers,
            'total_orders' => Order::count(),
            'total_revenue' => Order::whereIn('status', ['PENDING', 'COMPLETED'])->sum('total_price'),
        ]);
    }

    public function activityLogs()
    {
        $logs = ActivityLog::with('user')->latest()->take(10)->get();
        return response()->json($logs);
    }

    public function users()
    {
        $users = User::withCount('orders')
            ->withSum('orders', 'total_price')
            ->latest()
            ->get();
            
        return response()->json($users);
    }
}
