import React from 'react'
type Props = { className?: string; size?: number }
const SearchIcon = ({ className = '' }: Props) => (
    <svg viewBox="0 0 30 30" version="1.1" className={className}>
        <defs>
            <path
                d="M11.5482521,20.4090671 L4.24727698,28.2009189 C3.68084207,28.8054377 2.73159653,28.8363108 2.12707771,28.2698759 C1.5225589,27.703441 1.4916858,26.7541954 2.0581207,26.1496766 L9.40599838,18.3077689 C7.95982241,16.4371424 7.0978836,14.0789715 7.0978836,11.5181818 C7.0978836,5.44914339 11.9392549,0.518181818 17.9252787,0.518181818 C23.9113026,0.518181818 28.7526738,5.44914339 28.7526738,11.5181818 C28.7526738,17.5872202 23.9113026,22.5181818 17.9252787,22.5181818 C15.539851,22.5181818 13.3361963,21.7351359 11.5482521,20.4090671 Z M17.9252787,19.5181818 C22.242011,19.5181818 25.7526738,15.9425536 25.7526738,11.5181818 C25.7526738,7.09381 22.242011,3.51818182 17.9252787,3.51818182 C13.6085464,3.51818182 10.0978836,7.09381 10.0978836,11.5181818 C10.0978836,15.9425536 13.6085464,19.5181818 17.9252787,19.5181818 Z"
                id="giphy-search-icon-path-1"
            ></path>
        </defs>
        <g id="search" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="icons/search">
                <mask id="giphy-search-icon-mask-2" fill="white">
                    <use xlinkHref="#giphy-search-icon-path-1"></use>
                </mask>
                <use id="Mask" fill="#FFFFFF" fillRule="nonzero" xlinkHref="#giphy-search-icon-path-1"></use>
                <g mask="url(#giphy-search-icon-mask-2)">
                    <g transform="translate(0.250000, 0.250000)">
                        <g></g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
)

export default SearchIcon
