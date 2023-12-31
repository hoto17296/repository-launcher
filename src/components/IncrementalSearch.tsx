import { useState, type ReactNode } from 'react'
import style from './IncrementalSearch.module.css'

interface IncrementalSearchProps<T> {
  items: T[]
  renderItem: (item: T, selected: boolean) => ReactNode
  filter: (item: T, words: string[]) => boolean
  sortCompare?: (a: T, b: T) => number
  onSubmit: (item: T) => void
}

const IncrementalSearch = <T,>({
  items,
  renderItem,
  filter,
  sortCompare,
  onSubmit,
}: React.PropsWithChildren<IncrementalSearchProps<T>>) => {
  const [query, setQuery] = useState<string>('')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const filterWords = query.split(' ').filter((item) => item.trim())
  const filteredItems = items.filter((item) => filter(item, filterWords))

  return (
    <div className={style.IncrementalSearch}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (selectedIndex !== null) onSubmit(filteredItems[selectedIndex])
        }}
      >
        <input
          type="text"
          value={query}
          autoFocus
          spellCheck="false"
          onChange={(event) => {
            setQuery(event.target.value)
            setSelectedIndex(filteredItems.length > 0 ? 0 : null)
          }}
          onKeyDown={(event) => {
            switch (event.code) {
              case 'ArrowUp':
                event.preventDefault()
                setSelectedIndex((value) => {
                  if (value === null) return 0
                  if (value - 1 < 0) return filteredItems.length - 1
                  return value - 1
                })
                break
              case 'ArrowDown':
                event.preventDefault()
                setSelectedIndex((value) => {
                  if (value === null) return 0
                  if (value + 1 >= filteredItems.length) return 0
                  return value + 1
                })
                break
              case 'Escape':
                event.preventDefault()
                setQuery('')
                setSelectedIndex(null)
                break
            }
          }}
        />
      </form>
      {filteredItems.length > 0 ? (
        <ul>
          {filteredItems.sort(sortCompare).map((item, index) => (
            <li key={index}>{renderItem(item, index === selectedIndex)}</li>
          ))}
        </ul>
      ) : (
        <p>No Items</p>
      )}
    </div>
  )
}

export default IncrementalSearch
