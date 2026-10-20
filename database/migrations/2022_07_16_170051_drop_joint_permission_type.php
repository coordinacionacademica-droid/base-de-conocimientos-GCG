<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('joint_permissions')
            ->where('action', '!=', 'view')
            ->delete();

        if (Schema::hasColumn('joint_permissions', 'action')) {
            try {
                Schema::table('joint_permissions', function (Blueprint $table) {
                    $table->dropPrimary(['role_id', 'entity_type', 'entity_id', 'action']);
                    $table->dropColumn('action');
                    $table->primary(['role_id', 'entity_type', 'entity_id'], 'joint_primary');
                });
            } catch (\Throwable $e) {
                // TiDB clustered index fallback
                DB::statement('CREATE TABLE IF NOT EXISTS joint_permissions_new (
                    role_id int NOT NULL,
                    entity_type varchar(191) NOT NULL,
                    entity_id int NOT NULL,
                    has_permission tinyint(1) NOT NULL DEFAULT 0,
                    has_permission_own tinyint(1) NOT NULL DEFAULT 0,
                    owned_by int NOT NULL,
                    PRIMARY KEY (role_id, entity_type, entity_id),
                    KEY joint_permissions_entity_id_entity_type_index (entity_id, entity_type),
                    KEY joint_permissions_has_permission_index (has_permission),
                    KEY joint_permissions_has_permission_own_index (has_permission_own),
                    KEY joint_permissions_role_id_index (role_id),
                    KEY joint_permissions_created_by_index (owned_by)
                )');
                DB::statement('INSERT IGNORE INTO joint_permissions_new SELECT role_id, entity_type, entity_id, has_permission, has_permission_own, owned_by FROM joint_permissions WHERE action = "view"');
                DB::statement('DROP TABLE joint_permissions');
                DB::statement('RENAME TABLE joint_permissions_new TO joint_permissions');
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
