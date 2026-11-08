const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('goblin-roleplay/plugin.js','utf8').replace(/^import .*;\n/gm,'').replace('export default ','const plugin = ');
let runtime='run-a',stored='chat-a',saved,events={},disposals=[];
const atom=get=>({get});
const box={structuredClone,crypto:require('crypto').webcrypto,host:{state:{focusedSessionId:atom(()=>runtime),focusedStoredSessionId:atom(()=>stored),activeSessionId:atom(()=>runtime)},notify:()=>{}},useValue:a=>a.get(),h:(type,props,...children)=>({type,props,children}),useState:()=>['',()=>{}],useEffect:()=>{}};
vm.createContext(box);vm.runInContext(source+`;globalThis.t={plugin,normalizeCard,middleware,companion,currentStory,newStory,chooseStory,completeTurn,processMemory,acceptMemory,memoryText,writeFact,Panel,ColorController,ColorsPanel,MemoryPanel,inFlight,getState:()=>state,arm:()=>armedSession=focused(),select:id=>{state.selected=id;armedSession=null;},setState:s=>state=s};`,box);
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
