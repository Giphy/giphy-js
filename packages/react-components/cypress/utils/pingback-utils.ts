const timeout = 1_000

export const interceptPingbacks = () => {
    cy.intercept(`https://pingback.giphy.com/**`).as('pingback')
}

export const checkNoTelemetryHappens = () => {
    Cypress.once('fail', (err) => {
        if (!err.toString().includes(`CypressError: Timed out retrying after ${timeout}ms`)) {
            throw err
        }
    })

    cy.wait('@pingback', { requestTimeout: timeout }).then((interception) => {
        expect(interception).to.not.exist
    })
}

export const checkUsualTelemetryHappens = () => {
    cy.wait('@pingback', { requestTimeout: timeout })
}
