import { Command } from '@tauri-apps/api/shell'
import { exec } from './utils'

async function root() {
  return await exec(new Command('ghq', ['root']))
}

async function list(): Promise<string[]> {
  return (await exec(new Command('ghq', ['list']))).split('\n')
}

export default { root, list }
