import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { Meta, StoryObj } from '@storybook/react'
import fetchMock from 'fetch-mock'
import React, { ComponentProps, useEffect, useState } from 'react'
import { Attribution, Gif } from '../src'
import inTestsRunner from './in-tests-runner'
import mockGifResult from './mock-data/gif.json'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const updateGif = (gif: IGif, display_name: string, is_verified: boolean = true, defaultAvatar: boolean = false) => {
    gif.user = {
        ...gif.user,
        display_name,
        is_verified,
    }
    if (defaultAvatar) {
        gif.user.avatar_url = ''
    }
    return gif
}

type AttrProps = ComponentProps<typeof Attribution> & {
    id: string
    displayName: string
    isVerified: boolean
    defaultAvatar: boolean
}

function useGif(id: string) {
    const [gif, setGif] = useState<IGif | undefined>()
    useEffect(() => {
        const f = async () => {
            if (inTestsRunner()) {
                fetchMock.restore().getOnce(`begin:https://api.giphy.com/v1/gifs/${id}`, { body: mockGifResult })
            }
            const { data } = await gf.gif(id)
            setGif(data)
        }
        f()
    }, [])
    return gif
}
const Demo = (props: AttrProps) => {
    const gif = useGif(props.id)
    return gif ? (
        <Gif gif={updateGif({ ...gif }, props.displayName, props.isVerified)} width={248} />
    ) : (
        <div>Loading...</div>
    )
}

const meta: Meta<typeof Demo> = {
    component: Demo,
    title: 'React Components/Attribution',
    argTypes: {
        id: {
            control: { type: 'text' },
        },
        displayName: {
            control: { type: 'text' },
        },
        isVerified: {
            control: { type: 'boolean' },
        },
        defaultAvatar: {
            control: { type: 'boolean' },
        },
    },
    args: {
        id: 'ZEU9ryYGZzttn0Cva7',
        displayName: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
        isVerified: true,
    },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = (props: AttrProps | {} = {}) => {
    const gif = useGif('l0HlyLQsbvhciAuKA')
    return gif ? (
        <div style={{ backgroundColor: 'grey' }}>
            <Attribution {...props} gif={updateGif({ ...gif }, 'Display Name')} />
        </div>
    ) : null
}

export const NotVerfied: Story = {
    args: {
        isVerified: false,
    },
}

export const NoAvatar: Story = {
    args: {
        defaultAvatar: true,
    },
}
