#!/usr/bin/env node
const { execSync } = require('child_process')
const https = require('https')

const LICENSE_CATEGORIES_LOCATION = process.env.LICENSE_CATEGORIES_LOCATION
const LICENSE_PROJECT_LOCATION = process.env.LICENSE_PROJECT_LOCATION

async function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        return https
            .get(url, (resp) => {
                if (resp.statusCode >= 400) {
                    const lastSegment = url.substring(url.lastIndexOf('/') + 1)
                    return reject(`[${resp.statusCode}] ${resp.statusMessage} ${lastSegment}`)
                }

                let data = ''
                resp.on('data', (chunk) => {
                    data += chunk
                })
                resp.on('end', () => {
                    resolve(JSON.parse(data))
                })
            })
            .on('error', reject)
    })
}

async function fetchCategoryLicenses(categories) {
    let result = []
    for (const category of categories) {
        const ctgLicenses = await fetchJSON(`${LICENSE_CATEGORIES_LOCATION}/${category}.json`)
        const flatCtgLicenses = Object.entries(ctgLicenses).flatMap(([licenseName, license]) => [
            licenseName,
            ...license.aliases,
        ])
        result = [...result, ...flatCtgLicenses]
    }
    return result
}

function toSemicolonList(list) {
    if (list == null) {
        return ''
    }
    return list.join(';')
}

async function main() {
    const projCfg = await fetchJSON(LICENSE_PROJECT_LOCATION)
    const allowedLicenses = await fetchCategoryLicenses(projCfg.license_categories)

    try {
        console.log(`\x1b[33mChecking dependencies in ${process.cwd()}\x1b[0m`)
        execSync(`npx license-checker \
            --start '${process.cwd()}' \
            --excludePackages='${toSemicolonList(projCfg.package_ignore)}' \
            --onlyAllow="${toSemicolonList(allowedLicenses)}"`)
        console.log('\x1b[32mAll licenses are valid.\x1b[0m')
    } catch (e) {
        throw new Error(e.message)
    }
}

if (require.main === module) {
    main().catch((err) => {
        console.error(err)
        process.exit(1)
    })
}
