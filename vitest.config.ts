export default {
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './tests/setup.ts',
    include: ['tests/**/*.test.ts'],
  },
}
