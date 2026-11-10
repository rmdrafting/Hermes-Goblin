# 3.1.5

- Right-aligned user bubbles with an independent user-text color picker.
- Left-aligned assistant replies with character portraits/initials matched to preceding Goblin context.
- Compact Context disclosure link and click propagation protection.
- Collapsible settings and a composer shortcut to reopen the panel.
- Scoped/default layout choices and DOM regression tests.

# 3.1.4

- Add Hide Goblin context in chat (on by default), with a per-message Show/Hide button.
- Preserve original message text, model context, attachments and token usage.
- Restore display on toggle-off/unload and handle newly rendered or edited messages.
- Add DOM regression tests for display and cleanup.

# 3.1.3

- Fix chat colors: mount the color controller in the actual case-sensitive `titleBar.right` SDK slot.
- Add a registration regression check so this mount failure is caught.

# 3.1.2

- Per-character Reserved/Balanced/Adventurous initiative and three freedom switches.
- Conversation boundaries for user agency, memory honesty and real-world actions.
- Turning off preference development also blocks automatic character-fact capture.
- Includes the 3.1.1 recall changes below; no automatic actions on disabling chat.

# 3.1.1

- Bounded relevant recall from the selected character’s saved ancestor chapters.
- Current-only, relevant-recall and ask-first controls.
- New chapters link to their parent; alternate storylines remain isolated.
- Preserve old stories as independent timelines during migration.

# 3.1.0

- Separate shared user facts, per-card personality facts, and named story memories.
- Save new model-proposed character/story facts automatically, with review for conflicts.
- Optional review-all and learning-off modes; manual remember, edit and forget.
- Continue or start fresh story memory; optional shared Goblin host style.
- Action/dialogue color pickers with all-chat, enabled-chat and default scopes.
- Retain portraits, amendments, lorebooks and the confirmed durable-session enable fix.
- Add regression tests and installation/development documentation.

# 0.2.1

Use durable chat IDs when available to keep Enable stable during new-chat initialization.
