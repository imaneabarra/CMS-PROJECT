<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function index()
    {
        $favorites = Favorite::with('product.category')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'favorites' => $favorites
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $favorite = Favorite::firstOrCreate([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Product added to favorites',
            'favorite' => $favorite
        ]);
    }

    public function destroy($productId)
    {
        $favorite = Favorite::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Product removed from favorites'
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Favorite not found'
        ], 404);
    }

    public function check($productId)
    {
        $isFavorited = Favorite::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->exists();

        return response()->json([
            'status' => 'success',
            'is_favorited' => $isFavorited
        ]);
    }
}
