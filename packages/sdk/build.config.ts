import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/api/client',
    'src/adapters/runtime.adapter',
    'src/adapters/aria.adapter',
    'src/hooks/index'
  ],
  clean: true,
  declaration: true,
  rollup: { emitCJS: true },
  outDir: 'dist'
})
