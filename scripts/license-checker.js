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
                    const json = JSON.parse(data.replace(/(\/\/|#).*/g, ''))
                    resolve(json)
                })
            })
            .on('error', reject)
    })
}

async function fetchLicenseCategories(categories) {
    const data = {}
    const uniqueCategories = [...new Set([...categories])]
    for (const category of uniqueCategories) {
        data[category] = await fetchJSON(`${LICENSE_CATEGORIES_LOCATION}/${category}.json`)
    }
    return data
}

function toSemicolonList(list) {
    if (list == null) {
        return ''
    }
    return list.join(';')
}

function pickLicensesForCategories(categoriesMapping, categories) {
    return categories.flatMap((category) => categoriesMapping[category])
}

async function main() {
    const projCfg = await fetchJSON(LICENSE_PROJECT_LOCATION)
    const categories = await fetchLicenseCategories(projCfg.license_categories)

    try {
        console.log(`\x1b[33mChecking dependencies in ${process.cwd()}\x1b[0m`)
        execSync(`npx license-checker \
            --start '${process.cwd()}' \
            --excludePackages='${toSemicolonList(projCfg.package_ignore)}' \
            --onlyAllow="${toSemicolonList(pickLicensesForCategories(categories, projCfg.license_categories))}"`)
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
