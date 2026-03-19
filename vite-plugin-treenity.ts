import type { Plugin } from 'vite'
import { readFile } from 'node:fs/promises'

export function treenityServer(configPath = 'root.json'): Plugin {
  return {
    name: 'treenity-server',
    async configureServer() {
      const { treenity } = await import('@treenity/core/server/factory')
      const rootNode = JSON.parse(await readFile(configPath, 'utf-8'))
      const t = await treenity({ rootNode })
      await t.listen(3211)
    },
  }
}
