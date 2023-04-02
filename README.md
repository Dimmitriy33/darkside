# Darkside

Webpack version: 5+
React version 18

## About project

"Darkside Vapeshop" is an e-commerce website that specializes in selling vaping products such as e-cigarettes, e-liquids, and accessories. The website offers a wide selection of products from various well-known brands, and provides a user-friendly shopping experience. The website's design and layout have a dark and edgy aesthetic, catering to a specific niche audience. In addition to its online presence, "Darkside Vapeshop" may also have physical stores in specific locations.
Overall, "Darkside Vapeshop" provides a one-stop-shop for all vaping needs with a unique and appealing look and feel.

## How to run project

1. Open project in VSCode (for example)
2. Run command `npm i` in terminal (console) for installing all required packages (Node.js is required: <https://nodejs.org/en/>)
3. For builing project you can use the following commands:
   - `npm run build-prod` - building production version (minimized and optimized). The project will be builded into `build` folder. You can change destination in `webpack.common.js (line 19)`
   - `npm run build-dev` - building development version
   - `npm run serve` - building development hot-reloaded version with webpack-dev-server

## Recommended VSCode extensions

- CSS Modules: <https://marketplace.visualstudio.com/items?itemName=clinyong.vscode-css-modules>
- CSS Modules Syntax Highlighter: <https://marketplace.visualstudio.com/items?itemName=andrewleedham.vscode-css-modules>
- ESlint: <https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint>
- Stylelint: <https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint>
- SCSS intellisense: <https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss>
- Path autocomplete: <https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete>
- Prettier - Code formatter: <https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode>
- Import Cost: <https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost>
- Markdownlint: <https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint>
- EditConfig for VS Code: <https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig>

## Features

- **Lint**. Integrated the most popular linters: ESlint, Stylelint
- **BrowserList**. All required browsers are pointed in **.browserslistrc**, so project will be compiled according to required browsers (babel, postcss, stylint use this file)
- **BrowserList. Stylelint**. Integrated [no-unsupported-browser-features](https://www.npmjs.com/package/stylelint-no-unsupported-browser-features), so during the css,scss-coding stylelint will show on-css rule that unsupported (according to .browserslistrc)
- **MockServer**. For mocking api responses integrated [webpack-mock-server](https://www.npmjs.com/package/webpack-mock-server) that supports JS,TS and hot-replacement:
- **Styles**. Integrated [CSS-Modules](https://github.com/css-modules/css-modules) and [postcss-autoprefixer](https://www.npmjs.com/package/autoprefixer), [postcss-normalize](https://www.npmjs.com/package/postcss-normalize), [OptimizeCSSAssetsPlugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin) (uses [css-nano](https://cssnano.co/) for production build)
