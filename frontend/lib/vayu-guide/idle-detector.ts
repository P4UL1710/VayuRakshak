export function watchIdle(callback:()=>void,delay=30_000){
 let timer:ReturnType<typeof setTimeout>;let lastReset=0;
 const fire=()=>{const active=document.activeElement;if(document.visibilityState!=="visible"||innerWidth<768||active?.matches("input,textarea,[contenteditable=true]")||document.querySelector("dialog[open]")){reset();return;}callback();};
 const reset=()=>{const now=Date.now();if(now-lastReset<250)return;lastReset=now;clearTimeout(timer);timer=setTimeout(fire,delay);};
 const events=["pointermove","pointerdown","scroll","keydown","touchstart","focusin","visibilitychange"];
 events.forEach(event=>document.addEventListener(event,reset,{passive:true}));reset();
 return()=>{clearTimeout(timer);events.forEach(event=>document.removeEventListener(event,reset));};
}
