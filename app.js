const players = [
  {id:"JS001", name:"John Smith", detail:"Motueka Premier", initials:"JS"},
  {id:"JS002", name:"John Smith", detail:"Riwaka Premier", initials:"JS"},
  {id:"AB001", name:"Alex Brown", detail:"Motueka Premier", initials:"AB"},
  {id:"LM001", name:"Liam McKenzie", detail:"Motueka Reserve", initials:"LM"}
];

const records = {
  JS001:{formats:["T20","One Day"],grades:["Premier"],teams:["Motueka"],seasons:["2025/26","2024/25"],batting:{matches:30,innings:28,no:5,hs:"112*",runs:1353,ave:"58.83",sr:"114.2",hundreds:5,fifties:6,fours:109,sixes:28},bowling:{innings:24,overs:"103.2",maidens:11,runs:1010,wickets:56,ave:"18.04",sr:"11.07",bbi:"5/24",bbm:"7/52",fiveWi:3,tenWm:0,rpo:"9.77"},fielding:{catches:27,wk:4,stumpings:1}},
  JS002:{formats:["T20"],grades:["Premier"],teams:["Riwaka"],seasons:["2025/26"],batting:{matches:16,innings:15,no:1,hs:"96",runs:731,ave:"52.21",sr:"110.4",hundreds:2,fifties:5,fours:68,sixes:21},bowling:{innings:12,overs:"90.0",maidens:5,runs:510,wickets:27,ave:"18.89",sr:"20.00",bbi:"5/19",bbm:"7/44",fiveWi:2,tenWm:0,rpo:"5.67"},fielding:{catches:13,wk:0,stumpings:0}},
  AB001:{formats:["T20","One Day"],grades:["Premier"],teams:["Motueka"],seasons:["2025/26","2024/25"],batting:{matches:26,innings:24,no:5,hs:"121",runs:1371,ave:"72.16",sr:"121.8",hundreds:5,fifties:8,fours:136,sixes:31},bowling:{innings:17,overs:"55.0",maidens:5,runs:740,wickets:39,ave:"18.97",sr:"8.46",bbi:"4/22",bbm:"5/48",fiveWi:1,tenWm:0,rpo:"13.45"},fielding:{catches:20,wk:0,stumpings:2}},
  LM001:{formats:["T20"],grades:["Reserve"],teams:["Motueka"],seasons:["2025/26"],batting:{matches:14,innings:13,no:2,hs:"74",runs:388,ave:"35.27",sr:"104.2",hundreds:0,fifties:3,fours:39,sixes:8},bowling:{innings:13,overs:"78.2",maidens:6,runs:480,wickets:29,ave:"16.55",sr:"16.21",bbi:"4/28",bbm:"6/55",fiveWi:0,tenWm:0,rpo:"6.13"},fielding:{catches:11,wk:0,stumpings:0}}
};

let state={page:"home",playerId:null,tab:"batting",format:"All",grade:"All",team:"All",season:"All"};
const app=document.getElementById("app");
function playerById(id){return players.find(p=>p.id===id)}
function currentRecord(){return records[state.playerId]}
function optionValues(key){const r=currentRecord();return r?["All",...r[key+"s"]]:["All"]}

function render(){state.page==="home"?renderHome():renderStats()}

function renderHome(){
 app.innerHTML=`<main class="home">
  <div class="hero"><div class="hero-overlay">
   <div class="logo-row"><div class="logo-mark">🏏</div><div class="logo-type">MOTUEKA CRICKET<span>PLAYER STATISTICS</span></div></div>
   <div class="hero-kicker">EST. 1857 · NELSON TASMAN</div>
   <h1>Find Your<br><span>Player</span></h1>
   <p class="hero-sub">Explore batting, bowling and fielding statistics.</p>
  </div></div>
  <section class="search-panel">
   <h2 class="search-title">Find a player</h2>
   <p class="search-caption">Start typing a name and choose the correct player.</p>
   <div class="search-wrap"><span>⌕</span><input id="playerSearch" autocomplete="off" placeholder="Search player name..." /></div>
   <div id="results" class="results"></div>
  </section>
  <p class="hint">Your selected player and filters are remembered while you browse.</p>
 </main>`;
 const input=document.getElementById("playerSearch"),results=document.getElementById("results");
 function showResults(){
  const q=input.value.trim().toLowerCase();
  const matches=players.filter(p=>!q||(p.name+" "+p.detail).toLowerCase().includes(q));
  results.innerHTML=matches.map(p=>`<button class="player-result" data-id="${p.id}"><span class="avatar">${p.initials}</span><span class="player-copy"><strong>${p.name}</strong><small>${p.detail}</small></span><span class="arrow">›</span></button>`).join("");
  results.querySelectorAll(".player-result").forEach(b=>b.onclick=()=>{state.playerId=b.dataset.id;state.page="stats";state.tab="batting";render()});
 }
 input.oninput=showResults;showResults();
}

function filter(key,label){
 const vals=optionValues(key);if(!vals.includes(state[key]))state[key]="All";
 return `<label class="filter"><span>${label}</span><select class="filter-select" data-key="${key}">${vals.map(v=>`<option ${v===state[key]?"selected":""}>${v}</option>`).join("")}</select></label>`
}
function tab(key,label){return `<button class="tab ${state.tab===key?"active":""}" data-tab="${key}">${label}</button>`}
function stat(label,value){return `<div class="stat-row"><span>${label}</span><strong>${value}</strong></div>`}
function batting(s){return `<div class="section-title">BATTING</div><div class="stat-list">${stat("MATCHES",s.matches)}${stat("INNINGS",s.innings)}${stat("NO",s.no)}${stat("HS",s.hs)}${stat("RUNS",s.runs.toLocaleString())}${stat("AVE",s.ave)}${stat("S/R",s.sr)}${stat("100",s.hundreds)}${stat("50",s.fifties)}${stat("4s",s.fours)}${stat("6s",s.sixes)}</div>`}
function bowling(s){return `<div class="section-title">BOWLING</div><div class="stat-list">${stat("BOWLING INNINGS",s.innings)}${stat("OVERS",s.overs)}${stat("MAIDENS",s.maidens)}${stat("RUNS",s.runs.toLocaleString())}${stat("WICKETS",s.wickets)}${stat("AVE",s.ave)}${stat("S/R",s.sr)}${stat("BBI",s.bbi)}${stat("BBM",s.bbm)}${stat("5WI",s.fiveWi)}${stat("10WM",s.tenWm)}${stat("RPO",s.rpo)}</div>`}
function fielding(s){return `<div class="section-title">FIELDING</div><div class="stat-list">${stat("OUTFIELD CATCHES",s.catches)}${stat("WICKET KEEPER CATCHES",s.wk)}${stat("STUMPINGS",s.stumpings)}</div>`}

function renderStats(){
 const p=playerById(state.playerId),r=currentRecord();
 app.innerHTML=`<main class="stats-page">
  <header class="topbar"><button class="back" id="changePlayer">←</button><div class="brand">MOTUEKA <span>CRICKET</span></div><button class="home-icon" id="homeBtn">⌂</button></header>
  <section class="profile-head"><div class="profile-avatar">${p.initials}</div><div><div class="eyebrow">PLAYER PROFILE</div><h1>${p.name}</h1><p>${p.detail}</p></div></section>
  <section class="filters">${filter("format","FORMAT")}${filter("grade","GRADE")}${filter("team","TEAM")}${filter("season","SEASON")}</section>
  <nav class="tabs">${tab("batting","BAT 🏏")}${tab("bowling","BOWL 🎯")}${tab("fielding","FIELD 🧤")}</nav>
  <section class="stats-content">${state.tab==="batting"?batting(r.batting):state.tab==="bowling"?bowling(r.bowling):fielding(r.fielding)}</section>
 </main>`;
 document.getElementById("changePlayer").onclick=()=>{state.page="home";render()};
 document.getElementById("homeBtn").onclick=()=>{state.page="home";render()};
 document.querySelectorAll(".tab").forEach(el=>el.onclick=()=>{state.tab=el.dataset.tab;render()});
 document.querySelectorAll(".filter-select").forEach(el=>el.onchange=()=>{state[el.dataset.key]=el.value;render()});
}
render();
