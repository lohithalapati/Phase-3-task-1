/**
 * @jest-environment jsdom
 *
 * Task 10 - Enterprise Configuration Platform
 * Aligned with actual source contracts
 */

import { DEFAULT_APP_CONFIG } from '../defaults';
import { CONFIG_CONSTANTS } from '../constants';

describe('Task 10 - Enterprise Configuration Platform', () => {

    describe('DEFAULT_APP_CONFIG Structure', () => {

        it('has development as default environment', () => {
            expect(DEFAULT_APP_CONFIG.environment).toBe('development');
        });

        it('has valid API configuration', () => {
            expect(DEFAULT_APP_CONFIG.api.baseUrl).toBeTruthy();
            expect(DEFAULT_APP_CONFIG.api.timeoutMs).toBeGreaterThan(0);
            expect(DEFAULT_APP_CONFIG.api.retryCount).toBeGreaterThan(0);
            expect(DEFAULT_APP_CONFIG.api.version).toBeTruthy();
        });

        it('has valid security configuration', () => {
            expect(DEFAULT_APP_CONFIG.security.tokenStorageKey).toBeTruthy();
            expect(DEFAULT_APP_CONFIG.security.sessionTimeoutMs).toBeGreaterThan(0);
            expect(DEFAULT_APP_CONFIG.security.enableCsrfProtection).toBe(true);
        });

        it('has valid pagination configuration', () => {
            expect(DEFAULT_APP_CONFIG.pagination.defaultLimit).toBeGreaterThan(0);
            expect(DEFAULT_APP_CONFIG.pagination.maxLimit).toBeGreaterThanOrEqual(DEFAULT_APP_CONFIG.pagination.defaultLimit);
        });

        it('has valid localization configuration', () => {
            expect(DEFAULT_APP_CONFIG.localization.defaultLocale).toBeTruthy();
            expect(DEFAULT_APP_CONFIG.localization.fallbackLocale).toBeTruthy();
        });

        it('has valid theme configuration', () => {
            expect(DEFAULT_APP_CONFIG.theme.defaultMode).toMatch(/^(light|dark|system)$/);
        });

        it('has valid logging configuration', () => {
            expect(DEFAULT_APP_CONFIG.logging.level).toBeTruthy();
            expect(typeof DEFAULT_APP_CONFIG.logging.enableTelemetry).toBe('boolean');
        });
    });

    describe('CONFIG_CONSTANTS', () => {

        it('has valid API version constant', () => {
            expect(CONFIG_CONSTANTS.API_VERSION).toBe('v1');
        });

        it('has valid storage prefix constant', () => {
            expect(CONFIG_CONSTANTS.LOCAL_STORAGE_PREFIX).toBeTruthy();
            expect(CONFIG_CONSTANTS.LOCAL_STORAGE_PREFIX).toContain('nh_enterprise');
        });

        it('has valid session timeout constant', () => {
            expect(CONFIG_CONSTANTS.SESSION_TIMEOUT_DEFAULT).toBeGreaterThan(0);
        });

        it('has valid pagination limit constant', () => {
            expect(CONFIG_CONSTANTS.DEFAULT_MAX_LIMIT).toBeGreaterThan(0);
        });

        it('has valid locale constants', () => {
            expect(CONFIG_CONSTANTS.DEFAULT_LOCALE).toBe('en-US');
            expect(CONFIG_CONSTANTS.FALLBACK_LOCALE).toBe('en-US');
        });
    });
});
