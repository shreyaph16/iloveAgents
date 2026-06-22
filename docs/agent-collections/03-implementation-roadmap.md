# Agent Collections: Implementation Roadmap

## Phase 1: types, constants, localStorage helpers

- Add localStorage constants and limits.
- Define the persisted collection shape with clear JSDoc or inline documentation.
- Implement safe load/save helpers with JSON parse protection.
- Normalize corrupted state, dedupe agent IDs, and cap stored values at product limits.

## Phase 2: collection state/store/hook

- Add a localStorage-backed collection hook modeled after the existing favorites sync pattern.
- Expose collection state plus create, delete, rename, add-agent, remove-agent, lookup, and membership helpers.
- Return consistent mutation results: `{ ok: true, ... }` for success and `{ ok: false, error }` for failures.

## Phase 3: create/delete/rename collection UI

- Add the `/collections` overview page.
- Provide empty, max-limit, create, rename, and delete states.
- Keep validation messages close to the action that produced them.

## Phase 4: add/remove agents from collections

- Add `src/components/collections/CollectionAgentPicker.jsx`.
- Add or update `src/pages/CollectionDetailPage.jsx`.
- Show a searchable checklist of all agents.
- Treat checked rows as collection members and unchecked rows as non-members.
- Toggling a checked agent removes it; toggling an unchecked agent adds it.
- Enforce duplicate prevention and the 15-agent collection limit.
- Disable unchecked rows while the collection is full while keeping selected rows removable.

## Phase 5: routes and page metadata

- Add `/collections` and `/collections/:id` under the main layout in `src/App.jsx`.
- Set document titles for the collections overview and detail pages.
- Preserve battle routes as full-screen routes outside the main layout.

## Phase 6: collection detail edge cases

- Resolve collections with `getCollectionById(id)`.
- Resolve collection `agentIds` against agents loaded through `useAgents()`.
- Handle missing collections with a not-found state.
- Filter stale or missing agent IDs so deleted or renamed agents do not crash the page.

## Phase 7: sidebar integration

- Add a Collections section below Suites and above agent categories.
- Show the all-collections link, collection links, and live agent-count badges.
- Keep category search and active-agent category expansion unchanged.
- Close the mobile sidebar when collection links are selected.

## Phase 8: validation and manual QA

- Run `npm run build`.
- Run `npm run dev`.
- Verify creating, renaming, deleting, opening, adding to, removing from, and refreshing collections.
- Verify Favorites, Suites, Workflows, Battle routes, and the agent registry still render.

## Debugging Note: Blank Page After Merge

The blank page was caused by unresolved Agent Collections merge fallout. The active runtime issue was `CollectionAgentPicker.jsx` importing `MAX_COLLECTION_AGENTS`, which was not exported by `src/lib/useCollections.js`; Vite failed module evaluation for the collection detail route. The roadmap doc also still contained unresolved conflict markers.

Fixed by aligning the picker with the exported `MAX_AGENTS_PER_COLLECTION` constant, making picker mutation feedback tolerate both boolean and `{ ok, error }` return values, keeping collection detail stale-agent handling non-crashing, and cleaning the roadmap conflict markers.

Validation commands run:

- `npm run build`
- `git diff --check`

## Agent Loading Convention Note

Agent Collections pages now use `useAgents()` instead of importing directly from `src/agents/registry.js`. Collection detail builds `agentById` from the hook-provided `agents` array and renders safe loading/error states while the provider is resolving agent definitions. The collections overview also uses the hook for preview names and keeps saved collection data visible if agent previews are loading or unavailable.

Validation commands run:

- `npm run build`
- `git diff --check`
- direct registry import search for Agent Collections files

Remaining direct registry imports are existing non-collection code paths, including `useAgents`, `HomePage`, `AgentPage`, workflow pages, `Sidebar`, and `SuggestedChainPills`; these were intentionally left unchanged.
