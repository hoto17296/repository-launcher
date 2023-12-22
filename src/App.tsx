import { useEffect, useState } from 'react'
import style from './App.module.css'
import Code from './lib/code'
import GHQ from './lib/ghq'
import { PersistentSet } from './lib/storage'
import type { Repository } from './types'

const favorites = new PersistentSet('favorites')

function App() {
  const [repositories, setRepositories] = useState<Repository[]>()

  useEffect(() => {
    GHQ.list()
      .then((list) =>
        setRepositories(
          list.map<Repository>((line) => ({
            path: line,
            favorite: favorites.has(line),
          }))
        )
      )
      .catch((error) => {
        console.error(error)
      })
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

  return (
    <main className={style.App}>
      <ul>
        {repositories.map((repository) => (
          <li key={repository.path}>
            <a
              onClick={async () =>
                Code.open(`${await GHQ.root()}/${repository.path}`)
              }
            >
              {repository.path}
            </a>
            <a onClick={() => toggleFavorite(repository)}>
              [{repository.favorite ? 'Unfavorite' : 'Favorite'}]
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
