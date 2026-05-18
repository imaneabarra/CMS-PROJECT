<!DOCTYPE html>
<html>
<head>
    <title>Sales Report</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; }
        .header { text-align: center; margin-bottom: 50px; }
        .header h1 { font-size: 28px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px; }
        .header p { color: #888; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background-color: #f9f9f9; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
        .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 20px; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #aaa; padding: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Sales Report</h1>
        <p>Generated on {{ date('M d, Y') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($orders as $order)
            <tr>
                <td>#{{ $order->id }}</td>
                <td>{{ $order->user->name }}</td>
                <td>{{ $order->created_at->format('M d, Y') }}</td>
                <td>{{ $order->status }}</td>
                <td>${{ number_format($order->total_price, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        Total Revenue: ${{ number_format($totalRevenue, 2) }}
    </div>

    <div class="footer">
        &copy; {{ date('Y') }} Luxury E-Commerce Platform. All rights reserved.
    </div>
</body>
</html>
