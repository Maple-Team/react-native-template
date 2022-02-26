import { resolve } from 'path'
import rimraf from 'rimraf'
import fs from 'fs'
export const remove = async () => {
  const dirs: string[] = await new Promise((res, rej) => {
    fs.readdir(resolve(__dirname, '../src/assets/one'), (err, files) => {
      if (err) {
        rej(err)
      } else {
        res(files)
      }
    })
  })
  dirs.forEach(async dir => {
    const files: string[] = await new Promise((res, rej) => {
      fs.readdir(resolve(__dirname, `../src/assets/one/${dir}`), (err, fss) => {
        if (err) {
          rej(err)
        } else {
          res(fss)
        }
      })
    })
    files.forEach(file => {
      if (file.includes('@')) {
        const _file = resolve(__dirname, `../src/assets/one/${dir}/${file}`)
        const stat = fs.statSync(_file)
        if (stat.isFile()) {
          rimraf(_file, err => {
            if (!err) {
              console.log(_file, 'deleted')
            }
          })
        } else {
          //
        }
      }
    })
  })
}
export const rename = async () => {
  const dirs: string[] = await new Promise((res, rej) => {
    fs.readdir(resolve(__dirname, '../src/assets/one'), (err, files) => {
      if (err) {
        rej(err)
      } else {
        res(files)
      }
    })
  })
  dirs.forEach(async dir => {
    const files: string[] = await new Promise((res, rej) => {
      fs.readdir(resolve(__dirname, `../src/assets/one/${dir}`), (err, fss) => {
        if (err) {
          rej(err)
        } else {
          res(fss)
        }
      })
    })
    files.forEach(file => {
      if (file.endsWith('@3x.webp')) {
        const _file = resolve(__dirname, `../src/assets/one/${dir}/${file}`)
        const stat = fs.statSync(_file)
        if (stat.isFile()) {
          fs.rename(_file, _file.replace(/@3x/, ''), err => {
            if (!err) {
              console.log(_file, _file.replace(/@3x/, ''))
            }
          })
        } else {
          //
        }
      }
    })
  })
}
remove()
