interface IPublicUser {
    // Username - writable by staff and non-partner/artist users
    username: string
    // READ ONLY FIELDS BELOW
    // Unique ID
    id: number
    // URL to the user's avatar
    avatar_url: string
    is_verified: boolean
}

export default interface IUser extends IPublicUser {
    // user about bio
    about_bio: string
    // user's display name
    display_name: string
    user_type: 'partner' | 'artist' | 'user' | 'anonymous'
    is_public: boolean
    // personal website URL
    primary_site: string
    // twitter handle or url
    twitter: string
    // facebook url or handle
    facebook: string
    // instagram handle or url
    instagram: string
    // tumblr url
    tumblr_site: string
    // READ ONLY FIELDS BELOW
    // twitter value as url
    twitter_url?: string
    // facebook value as url (no  change)
    facebook_url?: string
    // instagram value as url
    instagram_url?: string
    // tumblr site value as URL (no change)
    tumblr_url?: string
    // website URL -- primary_site value if there is one
    website_url?: string
}
