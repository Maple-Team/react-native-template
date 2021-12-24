#!/usr/bin/env node
import fs from 'fs'
import { Command } from 'commander'
import path from 'path'

const dir = (o: string) => path.resolve(__dirname, `../src/assets/images/${o}`)
const rename = (o: string, n: string) =>
  new Promise<void>((resolve, reject) => {
    fs.rename(dir(o), dir(n), err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

;(async () => {
  const program = new Command()
  program.option('-o, --on', 'old name').option('-n, --nn', 'new name')
  program.parse(process.argv)
  const [oldName, newName] = program.args
  try {
    await rename(`${oldName}.png`, `${newName}.png`)
    await rename(`${oldName}@2x.png`, `${newName}@2x.png`)
    await rename(`${oldName}@3x.png`, `${newName}@3x.png`)
    console.log('done')
  } catch (error) {
    console.error(error)
  }
})()
