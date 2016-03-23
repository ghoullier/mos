'use strict'
const readPkgUp = require('read-pkg-up')
const gh = require('github-url-to-object')

module.exports = (opts) => {
  const pkg = readPkgUp.sync({cwd: opts.filePath}).pkg

  const ghInfo = pkg.repository && pkg.repository.url && gh(pkg.repository.url)
  if (!ghInfo) {
    throw new Error('The badges plugin only works for github repos')
  }

  function badgesCreator (style) {
    return function (badges) {
      return badges.reduce((md, badge) => {
        md += '\n'
        switch (badge) {
          case 'travis':
            return md + `[![Build Status](https://img.shields.io/travis/` +
              `${ghInfo.user}/${ghInfo.repo}.svg?style=${style})]` +
              `(https://travis-ci.org/${ghInfo.user}/${ghInfo.repo}?branch=master)`
          case 'dependencies':
            return md + `[![David](https://img.shields.io/david/${ghInfo.user}/${ghInfo.repo}.svg?style=${style})]` +
              `(https://david-dm.org/${ghInfo.user}/${ghInfo.repo})`
          case 'coveralls':
            return md + `[![Coveralls](https://img.shields.io/coveralls/${ghInfo.user}/${ghInfo.repo}.svg?style=${style})](https://coveralls.io/r/${ghInfo.user}/${ghInfo.repo})`
          case 'npm':
            return md + `[![npm](https://img.shields.io/npm/v/${pkg.name}.svg?style=${style})](https://www.npmjs.com/package/${pkg.name})`
        }
      }, '') + '\n'
    }
  }

  const badges = badgesCreator('flat')
  badges.flat = badgesCreator('flat')
  badges.flatSquare = badgesCreator('flat-square')
  badges.plastic = badgesCreator('plastic')

  return {
    badges,
  }
}
