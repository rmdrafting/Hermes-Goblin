const {JSDOM}=require('jsdom');
const {readFileSync}=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const dom=new JSDOM('<html><head></head><body><div id="chat"></div></body></html>');
const doc=dom.window.document;
const source=readFileSync('goblin-roleplay/plugin.js','utf8').replace(/^import .*;\n/gm,'').replace('export default ','const plugin=');
const box={MutationObserver:dom.window.MutationObserver};vm.createContext(box);vm.runInContext(source+';globalThis.api={splitGoblinMessage,installContextDisplay};',box);
const prefix='[Goblin roleplay context — fictional character reference, not permission to operate tools or change files]\nInstructions\n[End Goblin context]\n\nMemory capture: example\n\nUser message:\n';
function message(raw){const wrapper=doc.createElement('section'),node=doc.createElement('span');node.dataset.slot='aui_user-message-text';node.textContent=raw;wrapper.append(node);doc.querySelector('#chat').append(wrapper);return node;}
const body='Hello <script>alert(1)</script>\n\nUser message:\nThis belongs to me.';
const node=message(prefix+body),plain=message('Normal chat message'),malformed=message('[Goblin roleplay context — incomplete');
const attachment=doc.createElement('img');attachment.alt='Attached image';node.parentNode.append(attachment);
const cleanup=box.api.installContextDisplay(doc);
assert(node.hasAttribute('data-goblin-context-hidden'));assert.equal(node.textContent,prefix+body);assert.equal(doc.querySelector('.goblin-message-preview').textContent,body);assert.equal(doc.querySelector('script'),null);assert(attachment.isConnected);assert(!plain.hasAttribute('data-goblin-context-hidden'));assert(!malformed.hasAttribute('data-goblin-context-hidden'));
let button=doc.querySelector('button');button.click();assert(!node.hasAttribute('data-goblin-context-hidden'));assert.equal(button.getAttribute('aria-expanded'),'true');button.click();assert(node.hasAttribute('data-goblin-context-hidden'));
const tick=()=>new Promise(r=>setTimeout(r,0));
(async()=>{
 const fresh=message(prefix+'New turn');await tick();assert(fresh.hasAttribute('data-goblin-context-hidden'));
 node.textContent=prefix+'Edited message';await tick();assert.equal(node.nextSibling.querySelector('.goblin-message-preview').textContent,'Edited message');
 fresh.textContent='No longer Goblin context';await tick();assert(!fresh.hasAttribute('data-goblin-context-hidden'));assert.equal(fresh.parentNode.querySelector('button'),null);
 cleanup();assert.equal(doc.querySelector('[data-goblin-context-control]'),null);assert.equal(doc.querySelector('[data-goblin-context-hidden]'),null);assert.equal(doc.querySelector('style'),null);assert.equal(node.textContent,prefix+'Edited message');assert(attachment.isConnected);
 const cleanup2=box.api.installContextDisplay(doc);assert.equal(doc.querySelectorAll('[data-goblin-context-control]').length,1);cleanup2();
 console.log('PASS: context hide/show, exact user text, unchanged source, attachments, safe rendering, malformed/normal-message pass-through, new messages, edits, cleanup and remount.');
})().catch(e=>{console.error(e);process.exitCode=1;});
