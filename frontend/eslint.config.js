// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import eslintReact from '@eslint-react/eslint-plugin'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },

  // Base ESLint recommended rules
  js.configs.recommended,

  // @eslint-react recommended (registers all nested plugins: x, dom, hooks-extra, naming-convention, web-api)
  eslintReact.configs.recommended,

  // Prettier integration (must be last to override formatting rules)
  prettierConfig,

  {
    files: ['**/*.{js,jsx}'],
    plugins: { prettier: prettierPlugin },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        // Node.js globals (for config files)
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },

    rules: {
      // ===========================
      // PRETTIER INTEGRATION
      // ===========================
      'prettier/prettier': 'error',

      // ===========================
      // REACT BEST PRACTICES (@eslint-react)
      // ===========================

      // Component Patterns
      '@eslint-react/prefer-destructuring-assignment': 'error',
      '@eslint-react/jsx-shorthand-boolean': 'error',
      '@eslint-react/jsx-shorthand-fragment': 'error',
      '@eslint-react/dom/no-void-elements-with-children': 'error',

      // Props & State
      '@eslint-react/no-array-index-key': 'off',
      '@eslint-react/no-children-only': 'error',
      '@eslint-react/no-clone-element': 'off',
      '@eslint-react/no-direct-mutation-state': 'error',
      '@eslint-react/no-unstable-default-props': 'error',
      '@eslint-react/no-nested-component-definitions': 'error',

      // Hooks Rules
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off',
      '@eslint-react/no-unnecessary-use-callback': 'off',
      '@eslint-react/no-unnecessary-use-memo': 'off',
      '@eslint-react/prefer-use-state-lazy-initialization': 'off',

      // JSX Best Practices
      '@eslint-react/no-unstable-context-value': 'error',
      '@eslint-react/no-leaked-conditional-rendering': 'off',
      '@eslint-react/no-useless-fragment': 'error',
      '@eslint-react/jsx-uses-vars': 'error',

      // Naming Conventions
      '@eslint-react/naming-convention/component-name': ['error', { rule: 'PascalCase' }],
      '@eslint-react/naming-convention/filename': 'off',
      '@eslint-react/naming-convention/filename-extension': ['error', { allow: 'as-needed' }],
      '@eslint-react/naming-convention/use-state': 'off',

      // ===========================
      // FUNCTIONAL PROGRAMMING
      // ===========================

      // Immutability
      'no-param-reassign': ['error', { props: true }],
      'prefer-const': ['error', { destructuring: 'all' }],

      // Pure Functions
      'no-var': 'error',
      'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
      'arrow-body-style': ['error', 'as-needed'],

      // Modern JavaScript
      'prefer-destructuring': ['error', { array: true, object: true }, { enforceForRenamedProperties: false }],
      'prefer-template': 'error',
      'prefer-spread': 'error',
      'object-shorthand': ['error', 'always'],
      'no-useless-concat': 'error',

      // ===========================
      // CODE QUALITY
      // ===========================

      // Error Prevention
      'no-console': 'off',
      'no-debugger': 'error',
      'no-alert': 'off',
      'no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],

      // Best Practices
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-with': 'error',
      'no-new-func': 'error',
      'no-return-await': 'error',
      'require-await': 'error',
      'no-async-promise-executor': 'error',

      // Complexity Management
      complexity: 'off',
      'max-depth': 'off',
      'max-nested-callbacks': 'off',
      'max-params': 'off',

      // Code Style
      'consistent-return': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-return': 'error',

      // ===========================
      // SEPARATION OF CONCERNS
      // ===========================

      // Component Structure
      'max-lines': 'off',
      'max-lines-per-function': 'off',

      // Import Organization
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
    },

    settings: { 'react-x': { version: 'detect' } },
  },

  // Disable filename convention for config/entry files (must be last to override)
  {
    files: ['**/*.config.js', '**/main.jsx', '**/main.js', '**/index.jsx', '**/index.js'],
    rules: { '@eslint-react/naming-convention/filename': 'off' },
  },

  {
    files: ['src/**/*.{js,jsx}'],
    rules: { '@eslint-react/no-use-context': 'off', '@eslint-react/no-context-provider': 'off' },
  },
]
