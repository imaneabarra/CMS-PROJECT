<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ActivityLog;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->withAvg('reviews', 'rating')->withCount('reviews');

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $products = $query->latest()->get();

        return ProductResource::collection($products);
    }

    public function show($id)
    {
        $product = Product::with('category')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->findOrFail($id);
        return new ProductResource($product);
    }

    public function store(Request $request)
    {
        \Log::info('Product store attempt:', $request->all());
        
        try {
            $request->validate([
                'category_id' => 'required|exists:categories,id',
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'stock' => 'required|integer',
                'image' => 'nullable|image|max:2048',
            ]);

            $data = $request->all();

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('products', 'public');
                \Log::info('Image stored at:', ['path' => $data['image']]);
            }

            $product = Product::create($data);
            $product->load('category');

            $this->logActivity($request->user()->id, 'stock', "Created product: {$product->name}");
            $this->notifyAdmins('stock', 'Product Added', "New product '{$product->name}' was added to the catalog.");

            \Log::info('Product created successfully:', ['id' => $product->id]);
            return new ProductResource($product);
            
        } catch (\Exception $e) {
            \Log::error('Product store failed:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to create product', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        \Log::info("Product update attempt for ID {$id}:", $request->all());
        
        try {
            $product = Product::findOrFail($id);

            $request->validate([
                'category_id' => 'sometimes|exists:categories,id',
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'price' => 'sometimes|numeric',
                'stock' => 'sometimes|integer',
                'image' => 'nullable|image|max:2048',
            ]);

            $data = $request->all();

            if ($request->hasFile('image')) {
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }
                $data['image'] = $request->file('image')->store('products', 'public');
            }

            $product->update($data);
            $product->load('category');

            $this->logActivity($request->user()->id, 'stock', "Updated product: {$product->name}");

            // Low Stock Alert
            if ($product->stock < 5) {
                $this->notifyAdmins('stock', 'Low Stock Alert', "Warning: '{$product->name}' stock is low ({$product->stock} remaining).");
            }

            \Log::info('Product updated successfully:', ['id' => $product->id]);
            return new ProductResource($product);
            
        } catch (\Exception $e) {
            \Log::error('Product update failed:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to update product', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $this->logActivity(request()->user()->id, 'stock', "Deleted product: {$product->name}");

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully.']);
    }
}
