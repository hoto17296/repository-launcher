import { useEffect, useState } from 'react'
import style from './App.module.css'
import IncrementalSearch from './components/IncrementalSearch'
import Code from './lib/code'
import GHQ from './lib/ghq'
import { PersistentSet } from './lib/storage'
import type { Repository } from './types'

const favorites = new PersistentSet('favorites')

function App() {
  const [repositories, setRepositories] = useState<Repository[]>()

  useEffect(() => {
    async function initialize() {
      const repositories = (await GHQ.list()).map<Repository>((line) => ({
        path: line,
        favorite: favorites.has(line),
      }))
      setRepositories(repositories)
    }
    initialize()
    return () => {}
  }, [])

  if (!repositories) return 'Loading...'

  function toggleFavorite(repository: Repository) {
    repository.favorite = !repository.favorite
    repository.favorite
      ? favorites.add(repository.path)
      : favorites.delete(repository.path)
    favorites.persist()
    setRepositories((state) => state && [...state])
  }

  async function onSubmit(repository: Repository | null) {
    if (!repository) return
    Code.open(`${await GHQ.root()}/${repository.path}`)
  }

  return (
    <main className={style.App}>
      <IncrementalSearch
        items={repositories}
        renderItem={(repository, selected) => {
          const classNames = [style.item]
          if (selected) classNames.push(style.selected)
          if (repository.favorite) classNames.push(style.favorite)
          return (
            <div className={classNames.join(' ')}>
              <a
                className={style.favoriteButton}
                onClick={() => toggleFavorite(repository)}
              >
                {repository.favorite ? '★' : '☆'}
              </a>
              <span>{repository.path.replaceAll('/', ' / ')}</span>
            </div>
          )
        }}
        filter={(repository, words) => {
          const value = repository.path.toLowerCase()
          for (const filterWord of words) {
            if (!value.includes(filterWord.toLowerCase())) return false
          }
          return true
        }}
        sortCompare={(a, b) => {
          if (a.favorite !== b.favorite)
            return Number(b.favorite) - Number(a.favorite)
          return a.path.localeCompare(b.path)
        }}
        onSubmit={onSubmit}
      />
    </main>
  )
}

export default App
