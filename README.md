# Hermes Goblin 3.1

> Bringing Hermes to life.... good thing? i dont know...

A native Hermes Desktop companion plugin with character cards, lorebooks, switchable amendments, portraits, persistent character/story memory, and optional action/dialogue colors.

## Install or update (Windows)

1. Close Hermes Desktop.
2. Extract the entire ZIP. Run `INSTALL_WINDOWS.bat` from the extracted folder.
3. Reopen Hermes. The panel title is **Goblin Roleplay 3.1.0**.
4. Open a chat and wait for its first reply. Select a character and click **Enable for this chat**.

The plugin keeps the `goblin-roleplay` ID and `settings` storage key, preserving existing cards, faces and amendments. The installer backs up the previous JavaScript file. It uses `HERMES_HOME` if set, otherwise `%USERPROFILE%\.hermes`. A custom Hermes data directory requires copying `goblin-roleplay/plugin.js` into that instance's `desktop-plugins/goblin-roleplay` folder.

## Three small memory shelves

- **Shared facts about you:** Explicitly add facts you want every character to know. The model cannot automatically write this shelf.
- **Character personality:** A separate set of preferences and facts for every imported card. Same-name cards remain separate because each has its own ID.
- **Story:** Events and relationships belong to a named story. New chats start with a fresh story; choose an existing story to continue it.

Ask Jasmine her favorite color. She can invent a fitting answer. If she follows the memory format, the plugin saves the new preference and supplies it in future enabled turns. This is prompt-based simulated personality, not model training or consciousness.

**Fresh story:** use a new Hermes chat as well. Clearing Goblin story memory cannot erase the old chat transcript or Hermes's own memories. Switching characters in the same transcript also leaves previous messages visible to the model: use separate chats for reliable separation.

### Automatic learning

Each character has three modes:

- **Save new facts; review changes:** default. New character/story facts save automatically. Changing an existing fact requires your approval in Review suggestions.
- **Review every suggestion:** all model-proposed facts wait for acceptance.
- **Off:** no new automatic memory capture. Existing saved facts still guide replies.

Learning uses Hermes's `message.complete` event and a small **visible** `goblin-memory` JSON block requested at the end of relevant responses. It makes no extra LLM/API call. Some models may ignore the format; then use **Remember this** manually. Only completed replies from a matching outgoing turn are eligible. An interrupted/error response is ignored. Pending suggestions retain the originating character and story even if you switch views.

A preference may change naturally, but a changed value with the same label goes to review. Labels are text, not semantic identities: the model can occasionally propose duplicates under different labels. Edit/forget them in the memory page.

Click **Forget** to stop a fact appearing in future injected prompts. This does not delete earlier transcript text, provider logs or Hermes's independent memory. Memories persist in local plugin storage. They are sent to the currently selected model as prompt context while enabled. Exported settings backups contain memories, imported cards and portrait data; keep them private. No user backups, personal cards or chat transcripts ship in this source package.

Memory limits: 60 facts per shelf, 800 characters per fact, 40 pending suggestions per character. Overall injected guidance is capped at 24,000 characters. If exceeded, shorten memories/cards/amendments; sending is cancelled with an explanation rather than silently dropping memories.

## Chat colors

Choose **Default colors**, **Enabled Goblin chat only**, or **All chats**, then pick action and dialogue colors.

Write actions in `*italics*` and dialogue in normal text. Example:

*Jasmine sits on a bench and feeds the pigeons.* “They’re getting to know me.”

The plugin colors assistant prose and italic spans. It cannot infer whether unmarked text is an action. It leaves user messages alone. Coloring depends on Hermes's DOM hooks (`data-chat-surface`, `aui_assistant-message-content`, `.aui-md`) and may need adjustments after Hermes updates. On older Desktop builds with different markup, colors may not apply. Disable/default removes the styling. UI construction and CSS scoping were tested locally, not inside a live Windows Hermes installation.

## Existing features

- Character Card V2 or plain JSON import; embedded lorebook support.
- Lorebooks with keyword and constant entries. Keywords scan the outgoing message, not full history.
- Thirty optional amendments in `Randy_Amendments.json`; see `AMENDMENTS_README.txt`.
- Per-character still portrait above the composer (not an animated face or assistant bubble avatar replacement).
- Durable chat IDs preserve the confirmed new-chat enable fix.
- Only one chat is enabled at a time. Restart/reload or selecting a different character turns it off.
- Guidance is prepended to the user message; it is not an actual privileged system message. Extra context consumes tokens and remains in chat history.

## Optional Goblin host style

A short, user-edited conversational style can apply across characters. It stays secondary to each character's own identity. Leave it disabled if you want completely different personalities.

## Development

One ESM file, no dependencies or build step. Allowed runtime imports: `@hermes/plugin-sdk` and `react`.

Run from this directory:

```sh
node --check goblin-roleplay/plugin.js
node tests/regression.cjs
```

Tests cover durable IDs, persistence, migrations, separate character/story memories, mid-turn character switching, automatic capture, conflict review, limits, and malformed payloads. Mock tests do not replace real Hermes testing.

## GitHub

Repository: https://github.com/rmdrafting/Hermes-Goblin

Version: **3.1.0**. Download through **Code → Download ZIP**, extract, and follow the installation steps above.

Upload only the files in this package. Never upload exported settings, private cards, API keys or Hermes data directories. `.gitignore` excludes common private outputs.

## Upstream references

- https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/desktop-plugin-sdk.md
- https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/src/contrib/events.ts
- https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/src/app/session/hooks/use-message-stream/gateway-event/message-stream.ts
- https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/src/components/assistant-ui/thread/assistant-message.tsx

Hermes Goblin is a separate community project, not an official Nous Research plugin.
