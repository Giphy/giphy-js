import { css, injectGlobal } from 'emotion'
export const titleFont = "'nexablack', sans-serif"
export const smallTitleSize = '20px'
export const titleSize = '26px'
export const largeTitleSize = '36px'
export const subheaderSize = '16px'
export const smallSubheaderSize = '12px'

injectGlobal`
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

export const Title = css`
    font-family: ${titleFont};
    -webkit-font-smoothing: antialiased;
    font-size: ${titleSize};
`
export const TitleLarge = css`
    font-size: ${largeTitleSize};
`
export const TitleSmall = css`
    font-size: ${smallTitleSize};
`
export const Subheader = css`
    font-size: ${subheaderSize};
    font-weight: bold;
    -webkit-font-smoothing: antialiased;
`
export const SubheaderSmall = css`
    font-size: ${smallSubheaderSize};
`
export const SectionHeader = css`
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    -webkit-font-smoothing: antialiased;
`
