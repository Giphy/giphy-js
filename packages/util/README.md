# @giphy/js-util

More coming soon:

_getAltText_ - get the alt text we display for gifs

_bestfit_ - finds image rendition that best fits a given width and height

_getBestRendition_ - get the best rendition object based on a width and height (uses bestfit)

_getBestVideo_ - get the best video rendition object based on a width and height (uses bestfit)

_getBestRenditionUrl_ - get the best rendition url based on a width and height, also factors in webp availability and if you're using video (uses getBestRendition)

_getGifHeight_ - quick way to get the height for a gif based on a provided width

_getGifWidth_ - quick way to get the width for a gif based on a provided height

_getSpecificRendition_ - get a specific rendition but factor in webp, sticker and video

_collections_ (lodash replacements)

-   mapValues (map for objects)
-   take
-   forEach (forEach for objects)
-   without
-   pick
