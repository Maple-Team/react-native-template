import tinify from 'tinify'
import { resolve } from 'path'
import { readdir } from 'fs'

tinify.key = 'ZNq3Tq1WKrc4tj3jxDrLrjTdgKCJZhBB'

const commonPath = resolve(__dirname, '../src/assets/compressed')
// TODO 更新处理新添加的资源
// `${commonPath}/account`,  `${commonPath}/apply/active|normal`
;(async () => {
  const dirs: string[] = await new Promise(reso => {
    readdir(commonPath, (err, files) => {
      if (err) {
        reso([])
      } else {
        reso(files)
      }
    })
  })
  const allImages = await dirs.reduce((prev, curr) => {
    return prev.then(async prevFiles => {
      const files: string[] = await new Promise(r => {
        readdir(`${commonPath}/${curr}`, (err, data) => {
          if (err) {
            r([])
          } else {
            r(data)
          }
        })
      })

      await files.forEach(async file => {
        if (file.endsWith('webp')) {
          prevFiles.push(`${commonPath}/${curr}/${file}`)
        } else {
          const ds: string[] = await new Promise(r => {
            readdir(`${commonPath}/${curr}/${file}`, (err, data) => {
              if (err) {
                r([])
              } else {
                r(data)
              }
            })
          })
          prevFiles.push(...ds.map(d => `${commonPath}/${curr}/${file}/${d}`))
        }
      })

      return prevFiles
    })
  }, Promise.resolve<string[]>([]))
  const total = allImages.length

  allImages.reduce((prev, curr, index) => {
    return prev.then(async () => {
      const target = curr.replace('images', 'compressed')
      await tinify.fromFile(curr).toFile(target)
      console.log(`progress: ${index + 1}/${total}`)
    })
  }, Promise.resolve())
})()
