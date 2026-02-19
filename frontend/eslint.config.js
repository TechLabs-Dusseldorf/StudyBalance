// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import eslintReact from '@eslint-react/eslint-plugin'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
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
      '@eslint-react/no-array-index-key': 'warn',
      '@eslint-react/no-children-only': 'error',
      '@eslint-react/no-clone-element': 'warn',
      '@eslint-react/no-direct-mutation-state': 'error',
      '@eslint-react/no-unstable-default-props': 'error',
      '@eslint-react/no-nested-component-definitions': 'error',

      // Hooks Rules
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'error',
      '@eslint-react/no-unnecessary-use-callback': 'warn',
      '@eslint-react/no-unnecessary-use-memo': 'warn',
      '@eslint-react/prefer-use-state-lazy-initialization': 'warn',

      // JSX Best Practices
      '@eslint-react/no-unstable-context-value': 'error',
      '@eslint-react/no-leaked-conditional-rendering': 'error',
      '@eslint-react/no-useless-fragment': 'error',
      '@eslint-react/jsx-uses-vars': 'error',

      // Naming Conventions
      '@eslint-react/naming-convention/component-name': ['error', { rule: 'PascalCase' }],
      '@eslint-react/naming-convention/filename': ['error', { rule: 'PascalCase' }],
      '@eslint-react/naming-convention/filename-extension': ['error', { allow: 'as-needed' }],
      '@eslint-react/naming-convention/use-state': 'error',

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
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'warn',
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
      complexity: ['warn', 15],
      'max-depth': ['warn', 4],
      'max-nested-callbacks': ['warn', 3],
      'max-params': ['warn', 4],

      // Code Style
      'consistent-return': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-return': 'error',

      // ===========================
      // SEPARATION OF CONCERNS
      // ===========================

      // Component Structure
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],

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

  { files: ['**/Navbar.jsx'], rules: { '@eslint-react/no-leaked-conditional-rendering': 'off' } },
]
