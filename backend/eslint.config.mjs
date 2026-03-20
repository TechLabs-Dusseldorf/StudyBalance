/* eslint-disable prettier/prettier */
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'eslint/config'
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import node from 'eslint-plugin-node'
import _import from 'eslint-plugin-import'
import promise from 'eslint-plugin-promise'
import security from 'eslint-plugin-security'
import functional from 'eslint-plugin-functional'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import globals from 'globals'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)
const prettierOptions = require('./.prettierrc.json')

// eslint-disable-next-line no-restricted-syntax
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default defineConfig([
    // Base configs via FlatCompat (node, import, promise, security - no native flat config)
    ...fixupConfigRules(
        compat.extends(
            'eslint:recommended',
            'plugin:node/recommended',
            'plugin:import/recommended',
            'plugin:promise/recommended',
            'plugin:security/recommended-legacy'
        )
    ),

    // Native flat config: functional plugin (lite = JS-friendly, disableTypeChecked = no TS parser needed)
    functional.configs.lite,
    functional.configs.disableTypeChecked,

    // Native flat config: Prettier (must be last to override formatting rules)
    eslintConfigPrettier,

    {
        plugins: {
            node: fixupPluginRules(node),
            import: fixupPluginRules(_import),
            promise: fixupPluginRules(promise),
            security: fixupPluginRules(security),
            prettier,
        },

        languageOptions: {
            globals: { ...globals.node },

            ecmaVersion: 2022,
            sourceType: 'module',
        },

        rules: {
            'prettier/prettier': ['error', prettierOptions],

            'no-restricted-syntax': [
                'error',
                { selector: 'ClassDeclaration', message: 'Classes are not allowed. Use plain objects with functions instead.' },
                { selector: 'ClassExpression', message: 'Classes are not allowed. Use plain objects with functions instead.' },
                {
                    selector: 'ThisExpression',
                    message: "The 'this' keyword is not allowed. Use explicit parameters or closures.",
                },
                {
                    selector: 'NewExpression[callee.name!=/^(Date|Error|RegExp|Map|Set|WeakMap|WeakSet|Promise|Array|Object)$/]',
                    message: "The 'new' keyword is only allowed for native JavaScript objects.",
                },
                {
                    selector: 'ForStatement',
                    message: 'Traditional for loops are not allowed. Use map/filter/reduce/forEach instead.',
                },
                {
                    selector: 'ForInStatement',
                    message: 'for...in loops are not allowed. Use Object.keys/values/entries with array methods.',
                },
                {
                    selector: 'ForOfStatement',
                    message: 'for...of loops are not allowed. Use map/filter/reduce/forEach instead.',
                },
                {
                    selector: 'WhileStatement',
                    message: 'While loops are not allowed. Use recursive functions or array methods.',
                },
                {
                    selector: 'DoWhileStatement',
                    message: 'Do-while loops are not allowed. Use recursive functions or array methods.',
                },
            ],

            'prefer-const': 'error',
            'no-var': 'error',
            'no-let': 'off',

            'prefer-destructuring': ['error', { array: true, object: true }],

            'prefer-arrow-callback': 'error',
            'arrow-body-style': ['error', 'as-needed'],

            'no-param-reassign': ['error', { props: true }],

            'functional/no-classes': 'error',
            'functional/no-this-expressions': 'error',
            'functional/no-let': 'warn',

            'functional/immutable-data': ['error', { ignoreAccessorPattern: ['*.current', 'module.exports', 'req.*'] }],

            'functional/prefer-readonly-type': 'off',
            'functional/prefer-immutable-types': 'off',
            'functional/no-mixed-type': 'off',
            'functional/no-expression-statement': 'off',
            'functional/functional-parameters': 'off',
            'functional/no-return-void': 'off',
            'functional/no-conditional-statement': 'off',
            'functional/no-try-statement': 'off',

            'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],

            'node/no-missing-import': 'off',
            'node/no-unpublished-require': 'off',

            'import/order': [
                'error',
                { groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'], 'newlines-between': 'always' },
            ],

            'promise/always-return': 'error',
            'promise/catch-or-return': 'error',
            'security/detect-object-injection': 'off',
            'security/detect-non-literal-fs-filename': 'warn',

            'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

            'no-undef': 'error',
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'no-throw-literal': 'error',
            'prefer-promise-reject-errors': 'error',
        },
    },

    // eslint.config.mjs: allow dev-only imports; resolver doesn't understand package.json "exports"
    {
        files: ['eslint.config.mjs'],
        rules: {
            'import/no-unresolved': ['error', { ignore: ['^eslint/config$', '^@eslint/', '^eslint-plugin-'] }],
            'node/no-unpublished-import': 'off',
        },
    },
])
