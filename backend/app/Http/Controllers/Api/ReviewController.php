<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Review;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Get all reviews for a specific product.
     */
    public function index($productId)
    {
        $reviews = Review::with('user:id,name')
            ->where('product_id', $productId)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    /**
     * Add or update a review for a product.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors()
            ], 422);
        }

        $review = Review::updateOrCreate(
            [
                'user_id'    => Auth::id(),
                'product_id' => $request->product_id,
            ],
            [
                'rating'  => $request->rating,
                'comment' => $request->comment,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Review recorded successfully',
            'data'    => $review
        ]);
    }

    /**
     * Get average rating and total reviews for a product.
     */
    public function getAverageRating($productId)
    {
        $stats = Review::where('product_id', $productId)
            ->selectRaw('AVG(rating) as average_rating, COUNT(*) as total_reviews')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'average_rating' => round($stats->average_rating, 1),
                'total_reviews'  => $stats->total_reviews
            ]
        ]);
    }

    /**
     * Get the authenticated user's review for a product.
     */
    public function getUserReview($productId)
    {
        $review = Review::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->first();

        return response()->json([
            'success' => true,
            'data' => $review
        ]);
    }
}
