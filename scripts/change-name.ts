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
  program
    .option('-o, --on', 'old name')
    .option('-n, --nn', 'new name')
    .option('-e, --ext', 'ext extension')
  program.parse(process.argv)
  const [oldName, newName, ext] = program.args
  try {
    await rename(`${oldName}.${ext}`, `${newName}.${ext}`)
    await rename(`${oldName}@2x.${ext}`, `${newName}@2x.${ext}`)
    await rename(`${oldName}@3x.${ext}`, `${newName}@3x.${ext}`)
    console.log('done')
  } catch (error) {
    console.error(error)
  }
})()
