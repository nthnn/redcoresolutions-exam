<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_first_registered_user_gets_admin_role()
    {
        $this->seed(\Database\Seeders\RoleSeeder::class);

        $response = $this->postJson('/api/register', [
            'full_name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(200);
        
        $user = User::first();
        $this->assertNotNull($user->role_id);
        $this->assertEquals('admin', $user->role->name);
    }

    public function test_subsequent_registered_user_gets_no_role()
    {
        $this->seed(\Database\Seeders\RoleSeeder::class);

        User::factory()->create();
        $response = $this->postJson('/api/register', [
            'full_name' => 'Member User',
            'email' => 'member@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(200);
        
        $user = User::where('email', 'member@example.com')->first();
        $this->assertNull($user->role_id);
    }
}
