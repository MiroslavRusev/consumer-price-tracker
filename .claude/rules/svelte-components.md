---
paths:
    - 'src/**/*.svelte'
    - 'src/**/*.svelte.ts'
    - 'src/styles/**'
---

# Svelte components and styling

- New components use Svelte 5 runes: `let { a, b }: Props = $props()`, `$state`, `$derived`, `$effect`, `{@render children()}`. Two-way props use `$bindable()`.
- Existing components still use `export let` / `$:` / `$store` syntax. When you change one substantially, migrate the whole component to runes in the same change; don't mix both styles in one file. Don't migrate files you aren't otherwise touching.
- Use `$app/state` (`page`, `navigating`, `updated`), never `$app/stores` (removed in Kit 3, crashes at runtime).
- Before binding a prop (`bind:foo`), check the child actually declares `foo`; `yarn run check` reports unknown props.
- All visible text is Bulgarian; identifiers, comments and `console` messages are English. Keep `<title>` and meta descriptions in Bulgarian.
- Tailwind 4 class names: use `shadow-xs`/`shadow-sm` (old `shadow-sm`/`shadow`), `rounded-sm` (old `rounded`), `outline-hidden` (old `outline-none`), `shrink-0`/`grow`, and opacity modifiers like `ring-slate-600/20` (no `*-opacity-*` utilities). A bare `ring` is 1px now — write `ring-3` if you mean the old default.
- Shared custom classes (`glass-card`, `hero-slate`, `selected-slate`, ...) live in `src/styles/input.css`; reuse them before adding new ones.
- Charts use `svelte5-chartjs` (`Line`, `Bar`). Chart colours for products come from `constants.ts`.
