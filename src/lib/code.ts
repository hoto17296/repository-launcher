import { Command } from '@tauri-apps/api/shell'
import { exec } from './utils'

async function open(path: string) {
  return await exec(new Command('code', [path]))
}

export default { open }
