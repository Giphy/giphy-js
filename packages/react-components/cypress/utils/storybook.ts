import { manager as knobsManager } from '@storybook/addon-knobs/dist/registerKnobs'
import type { StoryFile, StoriesWithPartialProps } from '@storybook/testing-react/dist/types'

export function resetKnobs() {
    knobsManager.knobStore.reset()
}

export function storiesCompositionToList<TModule extends StoryFile>(
    composed: Omit<StoriesWithPartialProps<TModule>, keyof StoryFile>
) {
    type Keys = keyof typeof composed
    type Stories = typeof composed[Keys]

    return Object.entries<Stories>(composed).map(
        ([key, Component]) =>
            ({
                Component,
                key: key as Keys,
            } as const)
    )
}
