<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserDeletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_is_allowed_to_delete_users()
    {
        $adminRole = Role::create(['name' => 'administrator', 'description' => 'Admin']);
        $admin = User::factory()->create(['role_id' => $adminRole->id]);
        $otherUser = User::factory()->create();

        $response = $this->actingAs($admin, 'api')
            ->deleteJson("/api/users/{$otherUser->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('users', ['id' => $otherUser->id]);
    }

    public function test_member_is_forbidden_from_deleting_users()
    {
        $memberRole = Role::create(['name' => 'member', 'description' => 'Member']);
        $member = User::factory()->create(['role_id' => $memberRole->id]);
        $otherUser = User::factory()->create();

        $response = $this->actingAs($member, 'api')
            ->deleteJson("/api/users/{$otherUser->id}");

        $response->assertStatus(403);
    }

    public function test_unassigned_user_is_forbidden_from_deleting_users()
    {
        $unassigned = User::factory()->create(['role_id' => null]);
        $otherUser = User::factory()->create();

        $response = $this->actingAs($unassigned, 'api')
            ->deleteJson("/api/users/{$otherUser->id}");

        $response->assertStatus(403);
    }

    public function test_user_cannot_delete_themselves()
    {
        $adminRole = Role::create(['name' => 'administrator', 'description' => 'Admin']);
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $response = $this->actingAs($user, 'api')
            ->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(403)
            ->assertJson(['message' => 'You cannot delete your own account.']);
    }
}
