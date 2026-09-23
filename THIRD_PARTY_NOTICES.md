# Third-party notices

This project is distributed under the Mozilla Public License 2.0. The
following third-party packages are used by the project and remain subject
to their own licenses. The project license does not replace or modify
those licenses.

## Runtime dependencies

| Package | Version in `package-lock.json` | License | Project use |
| --- | ---: | --- | --- |
| `@hpcc-js/wasm` | 2.35.0 | Apache-2.0 | Graphviz WebAssembly rendering |
| `dompurify` | 3.4.14 | MPL-2.0 or Apache-2.0 | SVG sanitization |
| `react` | 19.2.8 | MIT | UI framework |
| `react-dom` | 19.2.8 | MIT | React DOM renderer |
| `svg-pan-zoom` | 3.6.2 | BSD-2-Clause | SVG pan and zoom controls |

## Development dependencies

The build and development toolchain includes packages under MIT,
Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, and other permissive
licenses. Notable direct packages include:

| Package | License |
| --- | --- |
| `@types/dompurify` | MIT |
| `@types/react` | MIT |
| `@types/react-dom` | MIT |
| `@vitejs/plugin-react` | MIT |
| `autoprefixer` | MIT |
| `gh-pages` | MIT |
| `postcss` | MIT |
| `tailwindcss` | MIT |
| `typescript` | Apache-2.0 |
| `vite` | MIT |

## Transitive package notices

The locked dependency tree also includes:

- `caniuse-lite`, licensed under CC-BY-4.0. Its attribution terms apply
  when that package or its data is redistributed.
- Packages under Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, and MIT.
  Their copyright, license, and notice terms must be retained when the
  corresponding packages are redistributed.

The authoritative versions and integrity records are in
`package-lock.json`. For the complete text of each dependency license,
refer to the license files shipped with the relevant npm package or its
upstream repository.

## License compatibility

These dependency licenses permit this project to be distributed under
the Mozilla Public License 2.0, provided that the applicable third-party
copyright, license, attribution, and notice requirements are preserved.
