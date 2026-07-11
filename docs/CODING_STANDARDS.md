# Coding Standards

## 1. Naming Conventions
- Components: \PascalCase.tsx\ 
- Hooks: \useCamelCase.ts\ 
- Utilities: \camelCase.ts\ 

## 2. Folder Rules
- Components specific to a feature live in \eatures/feature-name/components\.
- Reusable components live in \shared/components\.

## 3. Import Order
1. React imports
2. External library imports
3. Internal absolute imports (\@/shared\, \@/features\)
4. Relative imports (\./\, \../\)
5. CSS imports
