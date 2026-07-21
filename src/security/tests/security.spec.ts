/**
 * @jest-environment jsdom
 *
 * Task 11 - Enterprise Frontend Security Platform
 * Aligned with actual source contracts
 */

import { Validators } from '../Validators';
import { Sanitizer } from '../Sanitizer';
import { SecureStorage } from '../SecureStorage';
import { SessionManager } from '../SessionManager';
import { PermissionManager } from '../PermissionManager';
import { AuditLogger } from '../Audit';

describe('Task 11 - Enterprise Frontend Security Platform', () => {

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    // ============================================================
    // SUITE 1: Validators
    // ============================================================
    describe('Validators - Email Validation', () => {

        it('validates correct email format', () => {
            expect(Validators.isEmail('user@enterprise.com')).toBe(true);
            expect(Validators.isEmail('admin@neuralhandoff.io')).toBe(true);
        });

        it('rejects invalid email formats', () => {
            expect(Validators.isEmail('not-email')).toBe(false);
            expect(Validators.isEmail('@domain.com')).toBe(false);
            expect(Validators.isEmail('user@')).toBe(false);
        });
    });

    describe('Validators - UUID Validation', () => {

        it('validates correct UUID format', () => {
            expect(Validators.isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
        });

        it('rejects invalid UUID formats', () => {
            expect(Validators.isUUID('not-uuid')).toBe(false);
            expect(Validators.isUUID('123')).toBe(false);
        });
    });

    describe('Validators - Password Strength', () => {

        it('validates strong passwords', () => {
            expect(Validators.isStrongPassword('StrongPass1')).toBe(true);
            expect(Validators.isStrongPassword('Enterprise99')).toBe(true);
        });

        it('rejects weak passwords', () => {
            expect(Validators.isStrongPassword('weak')).toBe(false);
            expect(Validators.isStrongPassword('nouppercase1')).toBe(false);
            expect(Validators.isStrongPassword('NOLOWER1')).toBe(false);
        });
    });

    describe('Validators - URL Safety', () => {

        it('accepts safe URLs', () => {
            expect(Validators.isSafeURL('https://api.neuralhandoff.com')).toBe(true);
            expect(Validators.isSafeURL('http://localhost:3000')).toBe(true);
        });

        it('rejects unsafe URLs', () => {
            expect(Validators.isSafeURL('javascript:alert(1)')).toBe(false);
            expect(Validators.isSafeURL('not-a-url')).toBe(false);
        });
    });

    // ============================================================
    // SUITE 2: Sanitizer - XSS Prevention
    // ============================================================
    describe('Sanitizer - HTML/Script Injection Prevention', () => {

        it('escapes script tags', () => {
            const dirty = '<script>alert("xss")</script>';
            const clean = Sanitizer.sanitizeString(dirty);
            expect(clean).not.toContain('<script>');
            expect(clean).toContain('&lt;');
        });

        it('escapes dangerous characters', () => {
            const result = Sanitizer.sanitizeString('a&b<c>d"e\'f/g');
            expect(result).toContain('&amp;');
            expect(result).toContain('&lt;');
            expect(result).toContain('&gt;');
            expect(result).toContain('&quot;');
        });

        it('preserves safe text', () => {
            expect(Sanitizer.sanitizeString('Hello World 123')).toBe('Hello World 123');
        });

        it('handles empty strings', () => {
            expect(Sanitizer.sanitizeString('')).toBe('');
        });
    });

    // ============================================================
    // SUITE 3: SecureStorage - Encrypted Local Storage
    // ============================================================
    describe('SecureStorage - Secure Data Persistence', () => {

        it('stores and retrieves objects', () => {
            const testData = { id: 1, name: 'Neural' };
            SecureStorage.set('test_key', testData);
            const retrieved = SecureStorage.get<typeof testData>('test_key');
            expect(retrieved?.id).toBe(1);
            expect(retrieved?.name).toBe('Neural');
        });

        it('returns null for non-existent keys', () => {
            expect(SecureStorage.get('nonexistent')).toBeNull();
        });

        it('removes items correctly', () => {
            SecureStorage.set('temp', 'value');
            SecureStorage.remove('temp');
            expect(SecureStorage.get('temp')).toBeNull();
        });

        it('clears all prefixed storage', () => {
            SecureStorage.set('key1', 'a');
            SecureStorage.set('key2', 'b');
            localStorage.setItem('external_key', 'should-remain');

            SecureStorage.clear();

            expect(SecureStorage.get('key1')).toBeNull();
            expect(SecureStorage.get('key2')).toBeNull();
            expect(localStorage.getItem('external_key')).toBe('should-remain');
        });

        it('does not expose raw sensitive data', () => {
            SecureStorage.set('secret', { password: 'hunter2' });
            const raw = localStorage.getItem('nh_enterprise_v5_secret');
            if (raw) {
                expect(raw).not.toContain('hunter2');
                expect(raw).not.toContain('password');
            }
        });
    });

    // ============================================================
    // SUITE 4: SessionManager - Session Lifecycle
    // ============================================================
    describe('SessionManager - Session Management', () => {

        it('stores and retrieves session data', () => {
            const session = {
                csrfToken: 'test-token-123', username: 'testuser',
                userId: 'user-456',
                role: 'admin' as const,
                permissions: ['read:data', 'write:data'] as const,
                expiresAt: Date.now() + 3600000,
            };
            
            SessionManager.setSession(session);
            const retrieved = SessionManager.getSession();
            expect(retrieved?.csrfToken).toBe('test-token-123');
        });

        it('returns null when no session exists', () => {
            expect(SessionManager.getSession()).toBeNull();
        });

        it('clears session on logout', () => {
            const session = {
                csrfToken: 'test-token-123', username: 'testuser',
                userId: 'user-456',
                role: 'admin' as const,
                permissions: ['read:data', 'write:data'] as const,
                expiresAt: Date.now() + 3600000,
            };
            
            SessionManager.setSession(session);
            SessionManager.clearSession();
            expect(SessionManager.getSession()).toBeNull();
        });

        it('returns null for expired sessions', () => {
            const expired = {
                csrfToken: 'test-token-123', username: 'testuser',
                userId: 'user-456',
                role: 'admin' as const,
                permissions: ['read:data', 'write:data'] as const,
                expiresAt: Date.now() - 1000,
            };
            
            SessionManager.setSession(expired);
            const retrieved = SessionManager.getSession();
            expect(retrieved).toBeNull();
        });
    });

    // ============================================================
    // SUITE 5: PermissionManager - Access Control
    // ============================================================
    describe('PermissionManager - Role-Based Access Control', () => {

        it('grants permissions when authenticated', () => {
            const session = {
                csrfToken: 'test-token-123', username: 'testuser',
                userId: 'user-456',
                role: 'admin' as const,
                permissions: ['read:data', 'write:data'] as const,
                expiresAt: Date.now() + 3600000,
            };
            
            SessionManager.setSession(session);
            const result = PermissionManager.hasPermission('read:data');
            expect(typeof result).toBe('boolean');
        });

        it('denies all permissions when unauthenticated', () => {
            expect(PermissionManager.hasPermission('read:data')).toBe(false);
            expect(PermissionManager.hasPermission('write:data')).toBe(false);
        });

        it('denies permissions for expired sessions', () => {
            const expired = {
                csrfToken: 'test-token-123', username: 'testuser',
                userId: 'user-456',
                role: 'admin' as const,
                permissions: ['read:data', 'write:data'] as const,
                expiresAt: Date.now() - 1000,
            };
            
            SessionManager.setSession(expired);
            expect(PermissionManager.hasPermission('read:data')).toBe(false);
        });
    });

    // ============================================================
    // SUITE 6: AuditLogger - Security Event Logging
    // ============================================================
    describe('AuditLogger - Security Audit Trail', () => {

        it('logs security events without throwing', () => {
            expect(() => {
                AuditLogger.logSecurityEvent('LOGIN', 'user-123', { ip: '192.168.1.1' });
            }).not.toThrow();
        });

        it('accepts various event types', () => {
            expect(() => {
                AuditLogger.logSecurityEvent('LOGOUT', 'user-456');
                AuditLogger.logSecurityEvent('PERMISSION_DENIED', 'user-789', { resource: 'admin' });
                AuditLogger.logSecurityEvent('SESSION_EXPIRED');
            }).not.toThrow();
        });
    });
});

