import { css, cx, injectGlobal } from 'emotion'

export const addFonts = () => injectGlobal`
@font-face {
    font-family: 'interface';
    font-style: normal;
    font-weight: normal;
    src: url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_Rg.woff2') format('woff2'),
        url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_Rg.woff') format('woff');
}

@font-face {
    font-family: 'interface';
    font-style: normal;
    font-weight: bold;
    src: url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_Bd.woff2') format('woff2'),
        url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_Bd.woff') format('woff');
}
@font-face {
    font-family: 'interface';
    font-style: normal;
    font-weight: 900;
    src: url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_XBd.woff') format('woff');
}
@font-face {
    font-family: 'nexablack'; 
    font-style: normal;
    font-weight: normal;
    src: url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/nexa_black-webfont.woff2') format('woff2'),
        url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/nexa_black-webfont.woff') format('woff');
}
@font-face {
    font-family: 'SSStandard'; 
    font-style: normal;
    font-weight: normal;
    src:  url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/ss-standard.woff') format('woff');
}
@font-face {
    font-family: 'SSSocial'; 
    font-style: normal;
    font-weight: normal;
    src:  url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/ss-social.woff') format('woff');
}
`
try {
    // in an env where process.env exists,
    // this will not error allowing the configuration
    // to work
    if (!process.env.GIPHY_SDK_NO_FONTS) {
        addFonts()
    }
} catch (error) {
    // if there is no env then fallback to the default behavior
    addFonts()
}

export const fontFamily = {
    title: "'nexablack', sans-serif",
    body: 'interface, Helvetica Neue, helvetica, sans-serif;',
}

export const fontSize = {
    titleSmall: '20px',
    title: '26px',
    titleLarge: '36px',
    subheader: '16px',
    subheaderSmall: '12px',
}

const sharedTitle = css`
    font-family: ${fontFamily.title};
    -webkit-font-smoothing: antialiased;
`

const title = cx(
    css`
        font-size: ${fontSize.title};
    `,
    sharedTitle
)
const titleLarge = cx(
    css`
        font-size: ${fontSize.titleLarge};
    `,
    sharedTitle
)
const titleSmall = cx(
    css`
        font-size: ${fontSize.titleSmall};
    `,
    sharedTitle
)

const sharedSubheader = css`
    font-family: ${fontFamily.body};
    font-weight: bold;
    -webkit-font-smoothing: antialiased;
`
const subheader = cx(
    css`
        font-size: ${fontSize.subheader};
    `,
    sharedSubheader
)
const subheaderSmall = cx(
    css`
        font-size: ${fontSize.subheaderSmall};
    `,
    sharedSubheader
)

const sectionHeader = css`
    font-family: ${fontFamily.body};
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    -webkit-font-smoothing: antialiased;
`

const classNames = {
    sectionHeader,
    subheaderSmall,
    subheader,
    titleLarge,
    titleSmall,
    title,
}

export { classNames as css }
