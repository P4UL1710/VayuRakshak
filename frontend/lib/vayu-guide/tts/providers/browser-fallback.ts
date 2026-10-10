export function browserNarration(text:string,onEnd:()=>void,onError:()=>void,rate=1){
 if(!("speechSynthesis" in window)){onError();return null;}
 const utterance=new SpeechSynthesisUtterance(text);utterance.lang="en-IN";utterance.rate=rate;utterance.onend=onEnd;utterance.onerror=onError;
 window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);return utterance;
}
