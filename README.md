<div align="center">

# sam-react-modal

Lightweight React modal stack with zero-dependency layout primitives for building polished overlays fast.

</div>

## Highlights

- Promise-based `openModal` API so every modal behaves like an async dialog.
- Modal stack management (`closeModal`, `closeAllModals`) with zero global state boilerplate.
- Fully overridable DOM attributes for the container, backdrop, and modal wrappers.
- Helper primitives (`FlexBox`, `GridBox`, `GridCell`, `Spacing`, `Border`) for composing modal content without pulling in CSS frameworks.
- Written in TypeScript and ships type definitions by default.

## Installation

```bash
npm install sam-react-modal
# or
yarn add sam-react-modal
# or
pnpm add sam-react-modal
```

## Quick Start

Wrap your app with `ModalProvider`, then call `openModal` anywhere via the `useModal` hook. The modal resolves like a promise when `closeModal` is called.

```tsx
import { ModalProvider, useModal, FlexBox } from 'sam-react-modal'

function App() {
  return (
    <ModalProvider>
      <Page />
    </ModalProvider>
  )
}

function Page() {
  const { openModal, closeModal } = useModal()

  const showConfirm = async () => {
    const choice = await openModal<string>(
      <FlexBox direction="column" style={{ padding: 24, backgroundColor: '#fff' }}>
        <h2>Delete file?</h2>
        <FlexBox gap={12}>
          <button onClick={() => closeModal('cancel')}>Cancel</button>
          <button onClick={() => closeModal('confirm')}>Delete</button>
        </FlexBox>
      </FlexBox>
    )

    if (choice === 'confirm') {
      // do the dangerous thing…
    }
  }

  return <button onClick={showConfirm}>Delete</button>
}
```

## API

### `<ModalProvider />`

| Prop                     | Type                                                       | Description                                                                                                                |
| ------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `containerAttributes`    | `React.HTMLAttributes<HTMLDivElement>`                     | Applied to the fixed container that hosts every modal (defaults place it full screen, centered, and stacked).              |
| `backdropAttributes`     | `React.HTMLAttributes<HTMLDivElement>`                     | Overrides the backdrop element. Clicks on the backdrop call `closeModal()` automatically.                                  |
| `modalWrapperAttributes` | `React.HTMLAttributes<HTMLDivElement>`                     | Shared attributes for each modal wrapper (defaults keep it fixed and stacked above the backdrop).                          |
| `beforeClose`            | `(ref?: React.RefObject<HTMLDivElement>) => Promise<void>` | Optional hook that runs before a modal is removed – perfect for exit animations. Resolve the promise when cleanup is done. |

> `ModalProvider` renders your app’s children plus the managed modal list. Use the attribute props to match your design system without rewriting the provider.

### `useModal()`

Returns an object with:

- `openModal<T>(content: React.ReactNode): Promise<T>` – renders `content` and resolves with the value passed to `closeModal`.
- `closeModal(value?: unknown): Promise<void>` – closes the top-most modal and resolves the promise returned by `openModal`.
- `closeAllModals(): void` – immediately clears every modal.
- `modals: Modal[]` – the current modal stack (helpful for debugging or analytics).

The hook throws if you call it outside of a `ModalProvider`.

### Layout Primitives

All primitives forward standard div props and accept inline style overrides.

- `FlexBox` – convenience wrapper that sets `display: flex` with direction/alignment props.
- `GridBox` – `display: grid` wrapper with column/row templates and gap helpers.
- `GridCell` – grid item shortcut supporting `gridColumn`, `gridRow`, and `gridArea`.
- `Spacing` – renders a spacer div with a customizable height.
- `Border` – colored rule/divider with configurable width/height.

Drop these inside your modals (or anywhere else) to keep layout code terse.

## Custom animations example

```tsx
<ModalProvider
  backdropAttributes={{ className: 'fadeIn' }}
  beforeClose={async (ref) => {
    if (!ref?.current) return
    ref.current.classList.replace('fadeIn', 'fadeOut')
    await new Promise((resolve) => setTimeout(resolve, 300))
  }}
>
  <App />
</ModalProvider>
```

The provider passes each modal wrapper ref into `beforeClose`, allowing you to add classes, play Web Animations, or wait for an async task before the modal unmounts.

## Local development

This repo ships with a Vite-powered playground under `example/`.

```bash
pnpm install
pnpm dev          # runs the demo at http://localhost:5173
pnpm build        # type-check + bundle library output
```

`pnpm build` runs ESLint and then produces the distributable files inside `dist/`.

## License

MIT © sam-react-modal contributors
