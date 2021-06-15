const { exec } = require('child_process')
const onlyAllow = [
    'MIT',
    'MIT OR X11',
    'BSD',
    'BSD-2-Clause',
    'BSD-3-Clause',
    'ISC',
    'CC-BY-3.0',
    'CC-BY-4.0',
    'CC0-1.0',
    'Apache-2.0',
    'Apache*', // this exists in @percy#storybook#walk#foreachasync"
    'ISC',
    'Public Domain',
    'Unlicense',
    'Artistic-2.0',
    'W3C-20150513',
]
exec(`license-checker --onlyAllow '${onlyAllow.join(';')}'`, (e) => {
    if (e) {
        console.error(e)
        process.exit(1)
    } else {
        console.log(`no license errors for ${process.cwd().split('/').pop()}`)
    }
})
