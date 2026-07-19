# Third-party notices

Maybe Tomorrow. includes and is built with the components listed below. The
root [MIT License](LICENSE) applies to the project's original code and
documentation only. It does not relicense third-party material; each component
remains subject to its own license.

| Component | Use in this project | License | Versioned source | Included license |
| --- | --- | --- | --- | --- |
| fflate 0.8.3 | Browser-side ZIP reading | MIT | [fflate v0.8.3](https://github.com/101arrowz/fflate/tree/v0.8.3) | [fflate.txt](licenses/fflate.txt) |
| ical.js 2.2.1 | Browser-side iCalendar parsing | Mozilla Public License 2.0 | [ical.js v2.2.1](https://github.com/kewisch/ical.js/tree/v2.2.1) | [ical.js.txt](licenses/ical.js.txt) |
| React 19.2.7, React DOM 19.2.7, and Scheduler 0.27.0 | Browser user interface | MIT | [React v19.2.7](https://github.com/facebook/react/tree/v19.2.7) | [react-family.txt](licenses/react-family.txt) |
| Vite 8.1.5 | Production build tooling and module-preload integration | MIT | [Vite v8.1.5](https://github.com/vitejs/vite/tree/v8.1.5) | [vite.txt](licenses/vite.txt) |
| Rolldown 1.1.5 | Production bundling and emitted module-preload bootstrap | MIT | [Rolldown v1.1.5](https://github.com/rolldown/rolldown/tree/v1.1.5) | [rolldown.txt](licenses/rolldown.txt) |
| Vite/Rolldown module-preload polyfill, based on es-module-shims by Guy Bedford | Browser compatibility code emitted into the production bundle | MIT | [Emitted source in Rolldown v1.1.5](https://github.com/rolldown/rolldown/blob/v1.1.5/crates/rolldown_plugin_vite_module_preload_polyfill/src/module-preload-polyfill.js) and [upstream es-module-shims](https://github.com/guybedford/es-module-shims) | [modulepreload.txt](licenses/modulepreload.txt) |

## ical.js source availability

The production JavaScript bundle includes ical.js 2.2.1 in Executable Form.
The corresponding unmodified Source Code Form is available from the exact
[ical.js v2.2.1 source tag](https://github.com/kewisch/ical.js/tree/v2.2.1),
and the complete unmodified Mozilla Public License 2.0 text is included in
[licenses/ical.js.txt](licenses/ical.js.txt).

The package versions above match the installed dependency tree and lockfile
used for the release build.

## Demo-video narration tooling (not distributed with the app)

The final candidate narration for the public Build Week demo was rendered
locally with the [`Kokoro-82M`
model](https://huggingface.co/hexgrad/Kokoro-82M), using its `af_heart` voice.
The model page identifies the model license as Apache-2.0. The local production
environment uses the `kokoro` 0.9.4 and `misaki` 0.9.4 packages. The downloaded
model snapshot is revision `f3ff3571791e39611d31c381e3a41a3af07b4987`.

These model files and packages are video-production tools only. They are not
included in the application source, dependency tree, production JavaScript
bundle, deployed site, or browser runtime. The public-facing credit retained
for the demo is:

```text
Narration: Kokoro-82M (af_heart) — Apache-2.0
```

An earlier candidate used the macOS Samantha System Voice. That candidate was
rejected before publication after the narration-license audit and will not be
distributed as the submission video. The Kokoro replacement passed renewed
technical QA and remains subject to Yoshie Yamada's complete-file listening
approval before upload.

— Codex
