// /* eslint-disable ts/ban-ts-comment */
// /* eslint-disable eslint-comments/no-unlimited-disable */
// // @ts-nocheck
// /* eslint-disable */

// import type { FavoriteItem } from '../logic/useFavorites'
// import type { Project } from '../types'
// import { Icon, List } from '@raycast/api'
// import { useMemo, useState } from 'react'
// import { appsConfig } from '../adapters'
// import { ProjectListItem } from '../components/ProjectListItem'
// import { showErrorToast, showSuccessToast, withErrorHandling } from '../logic'
// import { useFavorites } from '../logic/useFavorites'

// export default function Command() {
//   const [searchText, setSearchText] = useState('')
//   const { allFavorites, toggleFavorite, isLoading } = useFavorites()
//   const adapterMap = useMemo(() =>
//     Object.fromEntries(
//       Object.entries(appsConfig).map(([_, config]) => [config.adapter.appName, config.adapter]),
//     ), [])
//   const favoriteProjects: Project[] = useMemo(() => {
//     return allFavorites.map(item => ({
//       ...item,
//       isFavorite: true,
//     }))
//   }, [allFavorites])

//   // 获取所有收藏项目并转换为带有适配器信息的格式
//   // const favoriteProjects = useMemo(() => {
//   //   const projects: FavoriteProject[] = []

//   //   allFavorites.forEach((favorite) => {
//   //     const adapter = adapterMap[favorite.appName]
//   //     if (adapter) {
//   //       // 尝试从适配器获取项目信息
//   //       try {
//   //         const recentProjects = adapter.getRecentProjects()
//   //         const project = recentProjects.find((p: Project) => p.path === favorite.path)
//   //         if (project) {
//   //           projects.push({
//   //             ...project,
//   //             appName: favorite.appName,
//   //             adapter,
//   //             isFavorite: true, // 确保是收藏状态
//   //           })
//   //         }
//   //         else {
//   //           // 如果在最近项目中找不到，创建一个基本的项目对象
//   //           const fileName = favorite.path.split('\\').pop() || favorite.path
//   //           projects.push({
//   //             name: fileName,
//   //             path: favorite.path,
//   //             appName: favorite.appName,
//   //             adapter,
//   //             isFavorite: true,
//   //           })
//   //         }
//   //       }
//   //       catch (error) {
//   //         console.warn(`Failed to get projects from ${favorite.appName}:`, error)
//   //         // // 创建一个基本的项目对象
//   //         // const fileName = favorite.path.split('\\').pop() || favorite.path
//   //         // projects.push({
//   //         //   name: fileName,
//   //         //   path: favorite.path,
//   //         //   appName: favorite.appName,
//   //         //   adapter,
//   //         //   isFavorite: true,
//   //         // })
//   //       }
//   //     }
//   //   })

//   //   return projects
//   // }, [allFavorites, adapterMap])

//   // 按应用名称分组
//   const groupedProjects = useMemo(() => {
//     const groups: Record<string, FavoriteItem[]> = {}
//     allFavorites.forEach((item) => {
//       if (!groups[item.appName]) {
//         groups[item.appName] = []
//       }
//       groups[item.appName].push(item)
//     })

//     return groups
//   }, [allFavorites])

//   // 搜索过滤
//   const filteredGroups = useMemo(() => {
//     if (!searchText.trim()) {
//       return groupedProjects
//     }

//     const searchLower = searchText.toLowerCase()
//     const filtered: Record<string, FavoriteItem[]> = {}

//     Object.entries(groupedProjects).forEach(([appName, projects]) => {
//       const filteredProjects = projects.filter(project =>
//         project.name.toLowerCase().includes(searchLower)
//         || project.path.toLowerCase().includes(searchLower),
//       )

//       if (filteredProjects.length > 0) {
//         filtered[appName] = filteredProjects
//       }
//     })

//     return filtered
//   }, [groupedProjects, searchText])

//   const totalItems = Object.values(filteredGroups).reduce((sum, projects) => sum + projects.length, 0)

//   const handleOpenProject = async (project: Project) => {
//     console.log(project.path)

//     await withErrorHandling(
//       async () => {
//         await adapterMap[project.appName].openProject(project.path)
//       },
//       'Open Failed',
//       {
//         title: `Opened in ${project.appName}`,
//         message: project.name,
//       },
//     )
//   }

//   const handleToggleFavorite = async (project: Project) => {
//     await withErrorHandling(
//       async () => {
//         await toggleFavorite(project)
//       },
//       'Failed to update favorites',
//       {
//         title: `Project removed from favorites`,
//         message: project.name,
//       },
//     )
//   }

//   return (
//     <List
//       isLoading={isLoading}
//       onSearchTextChange={setSearchText}
//       searchBarPlaceholder="Search favorite projects..."
//       throttle={true}
//     >
//       {totalItems === 0 && !isLoading
//         ? (
//             <List.EmptyView
//               icon={Icon.Star}
//               title="No favorite projects found"
//               description={searchText ? 'No matches for your search' : 'Start favoriting projects to see them here'}
//             />
//           )
//         : (
//             Object.entries(filteredGroups).map(([appName, projects]) => {
//               return (
//                 <List.Section
//                   key={appName}
//                   title={`${appName} Favorites`}
//                   subtitle={`${projects.length} projects`}
//                 >
//                   {projects.map(project => (
//                     <ProjectListItem
//                       key={`${project.appName}-${project.path}`}
//                       project={project}
//                       openTitle={`Open in ${project.appName}`}
//                       onOpenProject={handleOpenProject}
//                       onToggleFavorite={handleToggleFavorite}
//                     />
//                   ))}
//                 </List.Section>
//               )
//             })
//           )}
//     </List>
//   )
// }
