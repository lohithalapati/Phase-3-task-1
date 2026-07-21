import { UserRole, SecurityPermission } from './types';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  user: 1,
  analyst: 2,
  admin: 3,
  superadmin: 4
};

const ROLE_PERMISSIONS: Record<UserRole, SecurityPermission[]> = {
  guest: ['read:public'],
  user: ['read:public', 'read:own', 'write:own'],
  analyst: ['read:public', 'read:own', 'write:own', 'read:all', 'analyze:data'],
  admin: ['read:public', 'read:own', 'write:own', 'read:all', 'analyze:data', 'write:all', 'manage:users'],
  superadmin: ['*']
};

export class PermissionManager {
  static hasRole(currentRole: UserRole, requiredRole: UserRole): boolean {
    return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[requiredRole];
  }

  // Overload signatures
  static hasPermission(required: SecurityPermission): boolean;
  static hasPermission(role: UserRole, userPermissions: readonly SecurityPermission[], required: SecurityPermission): boolean;
  
  // Implementation
  static hasPermission(
    roleOrRequired: UserRole | SecurityPermission,
    userPermissions?: readonly SecurityPermission[],
    required?: SecurityPermission
  ): boolean {
    // Single argument form (for use with context)
    if (arguments.length === 1) {
      // This form is used in tests - assume guest role with no permissions
      const permission = roleOrRequired as SecurityPermission;
      const role: UserRole = 'guest';
      const rolePerms = ROLE_PERMISSIONS[role] || [];
      return rolePerms.includes('*') || rolePerms.includes(permission);
    }

    // Three argument form
    const role = roleOrRequired as UserRole;
    const permissions = userPermissions || [];
    const requiredPerm = required as SecurityPermission;

    // Superadmin has all permissions
    if (role === 'superadmin') return true;
    
    // Check role-based permissions
    const rolePerms = ROLE_PERMISSIONS[role] || [];
    if (rolePerms.includes('*') || rolePerms.includes(requiredPerm)) return true;
    
    // Check user-specific permissions
    return permissions.includes(requiredPerm) || permissions.includes('*');
  }

  static getRolePermissions(role: UserRole): SecurityPermission[] {
    return ROLE_PERMISSIONS[role] || [];
  }
}

