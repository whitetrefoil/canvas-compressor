import {fileURLToPath} from 'node:url'
import {defineConfig} from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'


export default defineConfig({
  root: 'src',

  plugins: [
    tsconfigPaths({}),
  ],

  test: {
    root: fileURLToPath(new URL('.', import.meta.url)),

    alias: [{find: /^~\/(.*)/u, replacement: fileURLToPath(new URL('src/$1', import.meta.url))}],

    reporters: ['verbose', 'junit'],

    outputFile: {
      junit: 'test_results/vitest/junit.xml',
    },

    restoreMocks: true,

    coverage: {
      enabled         : true,
      include         : ['src/**'],
      reportsDirectory: 'test_results/vitest',
      reporter        : [
        ['text'],
        ['clover', {file: 'clover.xml'}],
        ['lcov'],
      ],
    },

    typecheck: {
      enabled: true,
    },
  },
})
