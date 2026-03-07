<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::updateOrCreate(
            ['name' => 'admin'],
            ['description' => 'Administrator']
        );

        Role::updateOrCreate(
            ['name' => 'member'],
            ['description' => 'Standard member']
        );
    }
}
