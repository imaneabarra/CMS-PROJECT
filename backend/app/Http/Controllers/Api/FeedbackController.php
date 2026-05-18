<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Http\Resources\FeedbackResource;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index()
    {
        $feedback = Feedback::with('user')->latest()->paginate(20);
        return FeedbackResource::collection($feedback);
    }

    public function store(Request $request)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'message' => 'required|string',
        ]);

        $feedback = $request->user()->feedback()->create($request->all());

        $this->logActivity($request->user()->id, 'user', "Submitted feedback with {$feedback->rating} stars");
        $this->notifyAdmins('user', 'New Feedback Received', "{$request->user()->name} submitted a {$feedback->rating}-star feedback.");

        return new FeedbackResource($feedback->load('user'));
    }
}
