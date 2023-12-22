import { Command } from '@tauri-apps/api/shell'
import type { Repository } from '../types'
import { exec } from './utils'

async function root() {
  return await exec(new Command('ghq', ['root']))
}

async function list(): Promise<Repository[]> {
  return (await exec(new Command('ghq', ['list'])))
    .split('\n')
    .map((line) => ({ path: line, favorite: false } as Repository))
}

export default { root, list }
