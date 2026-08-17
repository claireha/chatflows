
## Make nav items scroll under the promo banner

The NavPromoBanner will be pinned at the top of the sidebar, and the navigation items will scroll independently underneath it.

### Current behavior
The promo banner and all nav items are inside a single scrollable `div`. When scrolling, the banner scrolls away with the items.

### Proposed change
In `src/components/LeftNavigation.tsx`:

1. Move the `NavPromoBanner` out of the scrollable `div` so it stays fixed at the top of the sidebar.
2. Keep the nav items inside the scrollable area, which will scroll underneath the banner.

### Technical details

- Extract the `NavPromoBanner` render from inside the `overflow-y-auto` div and place it above it as a sibling, still within the `<nav>` container.
- The scrollable div keeps `flex-1 overflow-y-auto` so items scroll beneath the static banner.
- No other files need changes.
