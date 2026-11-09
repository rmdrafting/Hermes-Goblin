const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('goblin-roleplay/plugin.js','utf8').replace(/^import .*;\n/gm,'').replace('export default ','const plugin = ');
let runtime='run-a',stored='chat-a',saved,events={},disposals=[];
const atom=get=>({get});
const box={structuredClone,crypto:require('crypto').webcrypto,host:{state:{focusedSessionId:atom(()=>runtime),focusedStoredSessionId:atom(()=>stored),activeSessionId:atom(()=>runtime)},notify:()=>{}},useValue:a=>a.get(),h:(type,props,...children)=>({type,props,children}),useState:()=>['',()=>{}],useEffect:()=>{}};
vm.createContext(box);vm.runInContext(source+`;globalThis.t={plugin,pastRecall,freedomText,FreedomPanel,normalizeCard,middleware,companion,currentStory,newStory,chooseStory,completeTurn,processMemory,acceptMemory,memoryText,writeFact,Panel,ColorController,ColorsPanel,MemoryPanel,inFlight,getState:()=>state,arm:()=>armedSession=focused(),select:id=>{state.selected=id;armedSession=null;},setState:s=>state=s};`,box);
const t=box.t;
t.plugin.register({storage:{get:(k,d)=>d,set:(k,s)=>saved=structuredClone(s)},register:()=>{},onEvent:(k,f)=>events[k]=f,onDispose:f=>disposals.push(f)});
const a=t.normalizeCard({name:'Jasmine',description:'A gentle garden lover.'}),b=t.normalizeCard({name:'Copper',description:'An adventurous mechanic.'});
const state=t.getState();state.cards.push(a,b);state.selected=a.id;
const draft={text:'What is your favorite color?',attachments:[{id:'image'}]};
assert.equal(t.middleware(draft),draft);t.arm();
let response=t.middleware(draft);assert(response.text.includes('Memory capture:'));assert.equal(response.attachments,draft.attachments);assert(saved);
const snap=t.inFlight.get(runtime),storyA=t.currentStory().id;
function block(snap,facts){return 'I like sage green.\n```goblin-memory\n'+JSON.stringify({token:snap.token,facts})+'\n```';}
const favorite={scope:'character',key:'favorite color',value:'Sage green, because of quiet gardens.'};
events['message.complete']({session_id:'unrelated',payload:{text:block(snap,[favorite])}});assert.equal(t.companion().facts.length,0);
events['message.complete']({session_id:runtime,payload:{text:block(snap,[favorite,{scope:'story',key:'first meeting',value:'We fed pigeons in the park.'},{scope:'shared',key:'address',value:'Do not capture.'}])}});
assert.equal(t.companion().facts.length,1);assert.equal(t.currentStory().facts.length,1);assert.equal(state.sharedMemory.length,0);
assert.equal(t.inFlight.size,0);assert(t.memoryText().includes('Sage green'));
// Repeated event cannot duplicate memory; conflicting fact requires review.
events['message.complete']({session_id:runtime,payload:{text:block(snap,[favorite])}});assert.equal(t.companion().facts.length,1);
t.middleware(draft);let snap2=t.inFlight.get(runtime);t.completeTurn({session_id:runtime,payload:{text:block(snap2,[{...favorite,value:'Red'}])}});
assert.equal(t.companion().facts[0].value,favorite.value);assert.equal(t.companion().pending.length,1);
t.acceptMemory(t.companion().pending[0].id);assert.equal(t.companion().facts[0].value,'Red');
// Runtime changes do not disarm durable chat; other chats remain unaffected.
runtime='run-new';assert(t.middleware(draft)?.text.includes('Goblin'));stored=null;assert.equal(t.middleware(draft),draft);stored='chat-b';assert.equal(t.middleware(draft),draft);stored='chat-a';
// Capture is bound to original character/story even if selection changes mid-turn.
t.arm();t.middleware(draft);const original=t.inFlight.get(runtime);t.select(b.id);t.arm();t.newStory();
t.completeTurn({session_id:runtime,payload:{text:block(original,[{scope:'character',key:'favorite season',value:'Spring'}])}});
assert.equal(t.companion(b.id).facts.length,0);assert(t.companion(a.id).facts.some(f=>f.key==='favorite season'));
assert(!t.memoryText().includes('Red'));assert(!t.memoryText().includes('pigeons'));
// Fresh story preserves personality and removes prior events from injected memory.
t.select(a.id);t.arm();t.newStory();assert.notEqual(t.currentStory().id,storyA);assert(t.memoryText().includes('Red'));assert(!t.memoryText().includes('pigeons'));
t.chooseStory(storyA);assert(t.memoryText().includes('pigeons'));
// Off, invalid payloads, review mode and caps.
t.companion().learning='off';response=t.middleware(draft);assert(!response.text.includes('Memory capture:'));
t.companion().learning='review';t.middleware(draft);snap2=t.inFlight.get(runtime);
assert.equal(t.processMemory(block({...snap2,token:'wrong'},[favorite]),snap2),0);
assert.equal(t.processMemory('```goblin-memory\n{broken}\n```',snap2),0);
const newFact={scope:'character',key:'favorite flower',value:'Iris'};t.completeTurn({session_id:runtime,payload:{text:block(snap2,[newFact])}});assert(!t.companion().facts.some(f=>f.key===newFact.key));assert(t.companion().pending.some(f=>f.key===newFact.key));
assert.throws(()=>t.writeFact([],{key:'x',value:'a'.repeat(801)}));
// Save survives restart; migration does not reset prior values.
const before=structuredClone(state);t.plugin.register({storage:{get:()=>before,set:()=>{}},register:()=>{},onEvent:()=>{},onDispose:()=>{}});assert.equal(t.getState().companions[a.id].facts[0].value,'Red');
t.Panel();t.MemoryPanel();t.ColorsPanel();t.ColorController();
console.log('PASS: memory persistence, migration, response capture, nonce/session isolation, character isolation, mid-turn switches, story reset/continue, conflict review, learning off, shared-memory protection, bounds, UI construction, durable chat IDs.');
// Recall follows only explicit ancestors of the same character and storyline.
t.select(a.id);const root=t.newStory();root.name='Garden visit';t.writeFact(root.facts,{key:'pigeons',value:'We fed pigeons beside the fountain.'});
const child=t.newStory(true);assert.equal(child.parent,root.id);assert.equal(child.timeline,root.timeline);
assert(t.pastRecall('Tell me about the pigeons').includes('fountain'));
assert.equal(t.pastRecall('Let us discuss rocket engines'), '');
assert(t.pastRecall('recap our past').includes('fountain'));
t.companion().recallMode='current';assert.equal(t.pastRecall('pigeons'),'');
t.companion().recallMode='ask';assert(t.pastRecall('pigeons').includes('permission has not been granted'));assert(!t.pastRecall('pigeons').includes('fountain'));
child.recallAllowed=true;assert(t.pastRecall('pigeons').includes('fountain'));child.recallAllowed=false;
t.companion().recallMode='relevant';
const alternate=t.newStory();assert.notEqual(alternate.timeline,root.timeline);assert.equal(t.pastRecall('pigeons'),'');
t.chooseStory(root.id);const sibling=t.newStory(true);t.writeFact(sibling.facts,{key:'pigeons',value:'SIBLING_SECRET'});
t.chooseStory(child.id);assert(!t.pastRecall('pigeons').includes('SIBLING_SECRET'));
t.chooseStory(root.id);assert.equal(t.pastRecall('pigeons'),''); // No future events.
t.select(b.id);t.newStory();assert.equal(t.pastRecall('pigeons'),'');
t.select(a.id);t.chooseStory(child.id);
for(let i=0;i<10;i++)t.writeFact(root.facts,{key:'pigeons '+i,value:'pigeons '+('x'.repeat(700))});
const recalled=t.pastRecall('pigeons');const data=recalled.split('\n').slice(1);assert(data.length<=4);assert(data.join('').length<=2400);
// Migration preserves legacy memories without merging unrelated timelines.
const legacy={id:'legacy-story',name:'Old story',facts:[{id:'old',key:'pigeons',value:'LEGACY_SECRET'}]};t.companion().stories.push(legacy);t.companion();assert.equal(legacy.timeline,legacy.id);assert.equal(legacy.parent,null);assert(!t.pastRecall('pigeons').includes('LEGACY_SECRET'));
// Per-character freedom, no tool permission changes, preference-capture switch.
const personality=t.companion();assert.equal(personality.initiative,'adventurous');personality.initiative='reserved';personality.storyEvents=false;personality.suggestActivities=false;personality.developPreferences=false;
const rules=t.freedomText(personality);assert(rules.includes('Follow the user'));assert(rules.includes('Do not introduce new story events'));assert(rules.includes('Do not propose activities'));assert(rules.includes('Do not invent new lasting preferences'));assert(rules.includes('do not change actual tool permissions'));
personality.learning='auto';t.arm();t.middleware(draft);const capture=t.inFlight.get(runtime);const oldCount=personality.facts.length;
t.completeTurn({session_id:runtime,payload:{text:block(capture,[{scope:'character',key:'new favorite',value:'purple'},{scope:'story',key:'weather',value:'Rain began.'}])}});
assert.equal(personality.facts.length,oldCount);assert(t.currentStory().facts.some(f=>f.key==='weather'));
t.select(b.id);assert.equal(t.companion().initiative,'adventurous');assert.equal(t.companion().developPreferences,true);t.FreedomPanel();
console.log('PASS: recall relevance, caps, ancestor-only retrieval, alternate/sibling/future/character isolation, ask-first gating, legacy migration, freedom controls and preference-capture switch.');
