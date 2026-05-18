<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\DemoController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\PasswordResetController;

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password Reset (Public)
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
Route::get('/test-mail', [PasswordResetController::class, 'testMail']);

// Public Product/Category Routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// Reviews (Public)
Route::get('/products/{productId}/reviews', [ReviewController::class, 'index']);
Route::get('/products/{productId}/reviews/average', [ReviewController::class, 'getAverageRating']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    // Orders
    Route::post('/checkout', [CheckoutController::class, 'store']);
    Route::get('/orders/my', [OrderController::class, 'myOrders']);

    // Notifications & Feedback
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::delete('/notifications', [NotificationController::class, 'clearAll']);
    Route::post('/feedback', [FeedbackController::class, 'store']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{productId}', [FavoriteController::class, 'destroy']);
    Route::get('/favorites/check/{productId}', [FavoriteController::class, 'check']);

    // Reviews (Protected)
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/reviews/product/{productId}', [ReviewController::class, 'getUserReview']);

    // Technical Demo Requests
    Route::post('/demo-requests', [DemoController::class, 'store']);
    Route::get('/demo-requests/my', [DemoController::class, 'myRequests']);

    // Admin Only Routes
    Route::middleware('admin')->group(function () {
        // Product Management
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Order Management
        Route::get('/orders', [OrderController::class, 'index']);
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        // Feedback Management
        Route::get('/feedback', [FeedbackController::class, 'index']);

        // Activity Logs
        Route::get('/activity-logs', [DashboardController::class, 'activityLogs']);

        // Users Management
        Route::get('/users', [DashboardController::class, 'users']);

        // Settings Management
        Route::get('/settings', [\App\Http\Controllers\Api\SettingController::class, 'index']);
        Route::post('/settings', [\App\Http\Controllers\Api\SettingController::class, 'update']);

        // Dashboard & Reports
        Route::get('/admin/stats', [DashboardController::class, 'stats']);
        Route::get('/admin/reports/sales', [ReportController::class, 'salesReport']);
    });
    Route::post('/create-payment-intent', [PaymentController::class, 'createPaymentIntent']);
    Route::post('/confirm-stripe-order',  [PaymentController::class, 'confirmStripeOrder']);

});

// Stripe Webhook (Public)
Route::post('/webhooks/stripe', [PaymentController::class, 'webhook']);
