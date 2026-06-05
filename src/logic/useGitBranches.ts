import type { Project } from '../types'
import { join } from 'node:path'
import { readFile } from 'fs-extra'
import { useEffect, useRef, useState } from 'react'

export function useGitBranches(projects: Project[]) {
  const [branchMap, setBranchMap] = useState<Record<string, string>>({})
  const prevProjectIds = useRef<string>('')

  useEffect(() => {
    const projectIds = projects.map(p => p.id).sort().join(',')
    if (projectIds === prevProjectIds.current)
      return
    prevProjectIds.current = projectIds

    let cancelled = false

    async function load() {
      const entries = await Promise.all(
        projects.map(async (project) => {
          try {
            const headPath = join(project.path, '.git', 'HEAD')
            const content = await readFile(headPath, 'utf-8')
            const match = content.match(/^ref: refs\/heads\/(.+)$/m)
            return [project.id, match ? match[1] : null] as const
          }
          catch {
            return [project.id, null] as const
          }
        }),
      )

      if (cancelled)
        return

      const map: Record<string, string> = {}
      for (const [id, branch] of entries) {
        if (branch)
          map[id] = branch
      }
      setBranchMap(map)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [projects])

  return branchMap
}
