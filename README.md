# Binance DEX Toolkit

A repository for maintaining the toolkit used in Binance DEX website. With this toolkit, developers
can easily build a trading page with public Binance DEX APIs. Developers can also choose specific
components and apply them on the page.

## Table of Contents

<!-- MarkdownTOC autolink=true bracket=round depth=2 -->

- [Core concept](#core-concept)
- [Folder structure](#folder-structure)
- [Quick start](#quick-start)
- [TODO](#todo)

<!-- /MarkdownTOC -->

## Core concept

- A monorepo for the toolkit.
- An app can be composed by several components with flexibilities.
- Use RWD and heavily used `@binance-chain-npm/honeycomb` for every components
- (TODO) UI testing

## Folder structure

The folder is structured with the following diagram:

```
.
|-- packages
|   |-- apps
|   |   |-- {app-1}
|   |       |-- src
|   |       |-- craco.config.js
|   |       |-- tsconfig.json
|   |       `-- package.json
|   |-- common
|   |   |-- {common-1}
|   |       |-- {folders}
|   |       |-- tsconfig.json
|   |       `-- package.json
|   `-- widgets
|       |-- {widget-1}
|           |-- {folders}
|           |-- index.tsx
|           `-- package.json
|-- package.json
|-- README.md
|-- tsconfig.json
`-- yarn.lock
```

## Quick start

One time only: install `yarn`.

```bash
# On Mac with Homebrew (https://brew.sh/).
brew install yarn
# With npm package manager.
npm install --global yarn
```

Next: install and run dex-toolkit.

```bash
git clone https://github.com/binance-chain/dex-toolkit.git
cd dex-toolkit
yarn install
yarn start:trade:m
```

If you would like to enable moonpay, please create `.env` in your project root (under apps/your-app)
and add the following:

```bash
REACT_APP_MOON_PAY_MODE=YOUR_MODE
REACT_APP_MOON_PAY_API_KEY=YOUR_PUBLISHABLE_API_KEY
```

By default, the trade app will be running on `http://localhost:3000/en/trade`.

## Customize your trade app

By now, you can either create a copy pf `apps/trade` under `apps` or create a new react app under
`apps`. The app uses [CRACO](https://github.com/gsoft-inc/craco) and it requires a `craco.config.js`
under the root of `apps/[YOUR-APP]`, so be sure there is an one:

```
// craco.config.js
module.exports = {
  ...
}
```

For customizing you styles, we use our lovely
[honeycomb](https://github.com/binance-chain-npm/honeycomb) so you can customize the theme by
yourself. For example:

```
import { HoneycombThemeProvider, GlobalStyles } from '@binance-chain/honeycomb';
import { myStore } from '@/main/store';
import { myCustomizedTheme } from '@/main/themes';

import { Main } from './components';

export const MyComponent = () => {
  return (
    <Provider store={store}>
      <HoneycombThemeProvider localTheme={myCustomizedTheme}>
        <Main />
        <GlobalStyles />
      </HoneycombThemeProvider>
    </Provider>
  );
};
```

For overriding values, please check our honeycomb
[themes](https://github.com/binance-chain-npm/honeycomb/tree/alpha/src/modules/themes/themes).

## License

Copyright by Binance. All `dex-toolkit` packages are released under the MIT license.

## TODO

We need:

- Testing
- Upgrade to react-scripts v5, for better experience of creating a new app.
