import styled from '@emotion/styled'
import { Meta, StoryObj } from '@storybook/react'
import fetchMock from 'fetch-mock'
import React, { useContext, useLayoutEffect } from 'react'
import Grid_ from '../src/components/grid'
import SearchBarComponent_ from '../src/components/search-bar'
import SearchContextManager, { SearchContext } from '../src/components/search-bar/context'
import SuggestionBar from '../src/components/search-bar/suggestion-bar'
import inTestsRunner from './in-tests-runner'
import { mockSearchBar } from './mock-requests'
import useWindowSize from './use-window-size'

const Grid = styled(Grid_)`
    margin-top: 20px;
`

const SearchBarComponent = styled(SearchBarComponent_)`
    margin-bottom: 10px;
`

const Components = () => {
    const { fetchGifs, searchKey } = useContext(SearchContext)
    const { innerWidth } = useWindowSize()
    const columns = innerWidth < 400 ? 2 : 4
    const width = innerWidth - 16 * 2
    useLayoutEffect(() => {
        if (inTestsRunner()) {
            mockSearchBar()
        }
        return () => {
            fetchMock.restore()
        }
    }, [])
    return (
        <>
            <SearchBarComponent />
            <SuggestionBar />
            <Grid
                key={searchKey}
                columns={inTestsRunner() ? 2 : columns}
                width={inTestsRunner() ? 500 : width}
                fetchGifs={fetchGifs}
            />
        </>
    )
}

type SearchBarProps = React.ComponentProps<typeof SearchContextManager>

export const Demo = (props: SearchBarProps) => {
    return (
        <SearchContextManager {...props}>
            <Components />
        </SearchContextManager>
    )
}

const meta: Meta<typeof Demo> = {
    component: Demo,
    title: 'React Components/Search Experience',
    argTypes: {
        apiKey: {
            control: { type: 'text' },
        },
        initialTerm: {
            control: { type: 'text' },
        },
        theme: {
            control: { type: 'object' },
        },
        options: {
            control: { type: 'object' },
        },
        shouldDefaultToTrending: {
            control: { type: 'boolean' },
        },
    },
    args: {
        apiKey: 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh',
    },
}

export default meta

type Story = StoryObj<typeof meta>

export const SearchExperience: Story = {}

export const SearchExperienceInitialChannelSearch: Story = {
    args: {
        initialTerm: `@nba`,
    },
}

export const SearchExperienceInitialTerm: Story = {
    args: {
        initialTerm: `skateboard`,
    },
}

export const SearchExperienceHideCancelButton: Story = {
    args: {
        theme: {
            hideCancelButton: true,
        },
    },
}

export const SearchExperienceDarkmode: Story = {
    args: {
        theme: {
            darkMode: true,
        },
    },
}

export const SearchExperienceMobile: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
}

export const SearchExperienceMobileSmall: Story = {
    args: {
        theme: {
            mobileSearchbarHeight: 30,
        },
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
}

export const SearchExperienceStickersDefault: Story = {
    args: {
        options: {
            type: 'stickers',
        },
    },
}

export const SearchExperienceNoDefault: Story = {
    args: {
        shouldDefaultToTrending: false,
    },
}
