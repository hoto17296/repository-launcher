import { useEffect, useState } from 'react'
import style from './App.module.css'
import Code from './lib/code'
import GHQ from './lib/ghq'
import type { Repository } from './types'

function App() {
  const [repositories, setRepositories] = useState<Repository[]>()

  useEffect(() => {
    GHQ.list()
      .then(setRepositories)
      .catch((error) => {
        console.error(error)
      })
    return () => {}
  }, [])

  if (!repositories) return 'Loading...'

  return (
    <main className={style.App}>
      <ul>
        {repositories.map((repository) => (
          <li
            key={repository.path}
            onClick={async () =>
              Code.open(`${await GHQ.root()}/${repository.path}`)
            }
          >
            {repository.path}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
