import { loadEnvConfig } from '@next/env'

module.exports = async () => {
  const projectDir = process.cwd()
  await loadEnvConfig(projectDir)
}
