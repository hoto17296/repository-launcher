import type { Command } from '@tauri-apps/api/shell'

export class CommandError extends Error {
  message: string
  code?: number

  constructor(message: string, code?: number) {
    super()
    this.message = message
    this.code = code
  }
}

export function exec(command: Command): Promise<string> {
  return new Promise((resolve, reject) => {
    const stdout: string[] = []
    const stderr: string[] = []
    command.stdout.on('data', (line) => stdout.push(line.trim()))
    command.stderr.on('data', (line) => stderr.push(line.trim()))
    command.on('close', ({ code }) =>
      code === 0
        ? resolve(stdout.join('\n'))
        : reject(new CommandError(stderr.join('\n'), code))
    )
    command.on('error', (error) => reject(new CommandError(error)))
    command.spawn()
  })
}
