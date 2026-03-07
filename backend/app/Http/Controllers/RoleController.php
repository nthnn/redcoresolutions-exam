<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
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
        return response()->json(Role::all());
    }

    public function store(Request $request)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Only administrators can create roles.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $role = Role::create($validated);
        return response()->json($role, 201);
    }

    public function show($id)
    {
        $role = Role::findOrFail($id);
        return response()->json($role);
    }

    public function update(Request $request, $id)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Only administrators can update roles.'], 403);
        }

        $role = Role::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $role->update($validated);
        return response()->json($role);
    }

    public function destroy(Request $request, $id)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Only administrators can delete roles.'], 403);
        }

        $role = Role::findOrFail($id);
        $role->delete();
        return response()->json(null, 204);
    }
}
