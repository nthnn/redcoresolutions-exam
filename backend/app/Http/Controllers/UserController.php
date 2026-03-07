<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    private function isAdmin(Request $request)
    {
        $user = $request->user();
        if (!$user) return false;
        
        $user->loadMissing('role');
        if (!$user->role) return false;

        $adminNames = ['admin', 'Admin', 'administrator', 'Administrator'];
        return in_array($user->role->name, $adminNames);
    }

    public function index()
    {
        return response()->json(User::with('role')->get());
    }

    public function store(Request $request)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Only administrators can create users.'], 403);
        }

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role_id' => 'nullable|exists:roles,id'
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = User::with('role')->findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Only administrators can update users.'], 403);
        }

        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'full_name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes', 
                'required', 
                'string', 
                'email', 
                'max:255', 
                Rule::unique('users')->ignore($user->id)
            ],
            'password' => 'nullable|string|min:6|confirmed',
            'role_id' => 'nullable|exists:roles,id'
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy(Request $request, $id)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Only administrators can delete users.'], 403);
        }

        if ($request->user()->id == $id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(null, 204);
    }
}
