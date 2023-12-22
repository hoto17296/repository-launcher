export class PersistentSet extends Set<string> {
  key: string
  separator: string
  storage: Storage

  constructor(
    key: string,
    separator: string = '\t',
    storage: Storage = localStorage
  ) {
    super(storage.getItem(key)?.split(separator) || [])
    this.key = key
    this.separator = separator
    this.storage = storage
  }

  persist() {
    this.storage.setItem(this.key, [...this].join(this.separator))
  }
}
