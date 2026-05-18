<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function salesReport()
    {
        $orders = Order::with('user')->where('payment_status', 'PAID')->latest()->get();
        $totalRevenue = $orders->sum('total_price');

        $pdf = Pdf::loadView('reports.sales', compact('orders', 'totalRevenue'));

        return $pdf->download('sales-report.pdf');
    }
}
