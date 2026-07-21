import * as fs from 'fs';
import * as path from 'path';

export interface AuditResult {
  passed: boolean;
  violations: string[];
}

export class ArchitectureBoundaryEnforcer {
  private baseDir: string;
  private violations: string[] = [];

  constructor(baseDir: string = path.resolve(process.cwd(), 'src/stores')) {
    this.baseDir = baseDir;
  }

  public enforce(): AuditResult {
    this.violations = [];
    
    if (!fs.existsSync(this.baseDir)) {
      return { passed: true, violations: [] };
    }

    const files = this.scanDir(this.baseDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(process.cwd(), file).replace(/\\/g, '/');

      // Rule 1: No direct browser storage access outside middleware/storage-engine
      if (
        !relativePath.includes('middleware/ssrStorage.ts') &&
        !relativePath.includes('systemStore.ts') &&
        !relativePath.includes('crossTabSync.ts')
      ) {
        if (content.match(/localStorage\.(getItem|setItem|removeItem|clear)/g) || content.match(/sessionStorage\.(getItem|setItem|removeItem|clear)/g)) {
          this.violations.push(
            `Rule Violation in [${relativePath}]: Directly bypassing ssrStorage.ts to write/read localStorage is prohibited.`
          );
        }
      }

      // Rule 2: UI-bound stores must not import core business stores
      const fileName = path.basename(file);
      if (
        fileName === 'themeStore.ts' ||
        fileName === 'sidebarStore.ts' ||
        fileName === 'notificationStore.ts' ||
        fileName === 'loadingStore.ts'
      ) {
        if (
          content.match(/import.*(authStore|userStore|orgStore)/g) ||
          content.match(/from.*'(.*\/)?(authStore|userStore|orgStore)'/g)
        ) {
          this.violations.push(
            `Rule Violation in [${relativePath}]: UI-bound state must not establish dependencies on core business stores.`
          );
        }
      }

      // Rule 3: Anti-bypass check: Every store must enforce the factory creation pattern
      if (
        fileName !== 'storeFactory.ts' &&
        fileName !== 'types.ts' &&
        fileName !== 'selectors.ts' &&
        fileName !== 'index.ts' &&
        fileName !== 'permissionStore.ts' &&
        fileName !== 'resetOrchestrator.ts' &&
        fileName !== 'storeEventBus.ts' &&
        !file.includes('__tests__') &&
        !file.includes('middleware')
      ) {
        if (content.match(/create\s*</g) && !content.match(/createEnterpriseStore/g)) {
          this.violations.push(
            `Rule Violation in [${relativePath}]: Bypassing createEnterpriseStore is prohibited. Standardize store initialization.`
          );
        }
      }
    }

    return {
      passed: this.violations.length === 0,
      violations: this.violations,
    };
  }

  private scanDir(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const fullPath = path.resolve(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(this.scanDir(fullPath));
      } else if (file.endsWith('.ts')) {
        results.push(fullPath);
      }
    });
    return results;
  }
}
