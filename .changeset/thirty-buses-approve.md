---
'@giphy/react-components': minor
---

- mute video overlay on document visibility change
- invoke onEnter with text value when clicking on the search bar button
- add display: block and width/height 100% to picture element inside gif component: picture set to display: block is a common css reset, but if that is set then width and height need to be set to 100% in order for object-fit to work
