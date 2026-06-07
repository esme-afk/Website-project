# Brand fonts

Drop the licensed brand font files here and the `@font-face` rules in
`css/styles.css` will pick them up automatically. Expected filenames:

| Family            | Usage      | Files |
|-------------------|------------|-------|
| **Protofo Bold**  | Headlines  | `Protofo-Bold.woff2`, `Protofo-Bold.woff` |
| **PP Mori**       | Body text  | `PPMori-Regular.woff2/.woff`, `PPMori-SemiBold.woff2/.woff` |

Until the files are added, the site falls back to a close system stack
(condensed heavy sans for headlines, neutral sans for body) so the layout
stays correct.
