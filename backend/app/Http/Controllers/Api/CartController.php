<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use App\Http\Resources\CartItemResource;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $items = $request->user()->cartItems()->with('product')->get();
        return CartItemResource::collection($items);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $item = $user->cartItems()->where('product_id', $request->product_id)->first();

        if ($item) {
            $item->update(['quantity' => $item->quantity + $request->quantity]);
        } else {
            $item = $user->cartItems()->create($request->all());
        }

        $product = Product::find($request->product_id);
        $this->notifyUser($user->id, 'product', 'Added to Cart', "{$product->name} has been added to your cart successfully.");

        return new CartItemResource($item->load('product'));
    }

    public function update(Request $request, $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);
        
        $item = $request->user()->cartItems()->findOrFail($id);
        $item->update(['quantity' => $request->quantity]);

        return new CartItemResource($item->load('product'));
    }

    public function destroy(Request $request, $id)
    {
        $item = $request->user()->cartItems()->findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item removed from cart.']);
    }
}
