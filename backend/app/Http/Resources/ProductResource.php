<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'stock' => $this->stock,
            'image_url' => $this->image ? (filter_var($this->image, FILTER_VALIDATE_URL) ? $this->image : asset('storage/' . $this->image)) : null,
            'collection' => $this->collection,
            'badge' => $this->badge,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'reviews_avg_rating' => $this->reviews_avg_rating ? round($this->reviews_avg_rating, 1) : 0,
            'reviews_count' => $this->reviews_count ?? 0,
            'created_at' => $this->created_at,
        ];
    }
}
