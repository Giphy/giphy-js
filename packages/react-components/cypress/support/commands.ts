import { mount } from '@cypress/react18'

import { resetKnobs } from '../utils/storybook'

function stopVideo(elements: JQuery<HTMLVideoElement> | void) {
    const source = elements ? cy.wrap(elements) : cy.get('video')
    source
        .then((videos) =>
            Promise.all(
                videos.toArray().map(async (el: HTMLVideoElement) => {
                    // Wait until all a video is ready to avoid "play-request-was-interrupted-by-a-call-to-pause" error
                    await el.play()
                    el.autoplay = false
                    el.currentTime = 0

                    return new Promise((resolve) => {
                        function pauseHandler() {
                            el.removeEventListener('pause', pauseHandler)
                            resolve(null)
                        }

                        el.addEventListener('pause', pauseHandler)
                        el.pause()
                    })
                })
            )
        )
        .as('stopVideo')
}

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount
            resetKnobs: typeof resetKnobs
            stopVideo: () => void
        }
    }
}

Cypress.Commands.add('mount', mount)
Cypress.Commands.add('resetKnobs', resetKnobs)
Cypress.Commands.add('stopVideo', { prevSubject: ['optional'] }, stopVideo)
