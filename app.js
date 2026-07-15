let data = {};

async function loadData(){
 const response = await fetch("heroes.json");
 data = await response.json();
 populateHeroes();
}

function populateHeroes(){
 const select=document.getElementById("heroSelect");
 Object.entries(data.heroes).forEach(([key,hero])=>{
  const option=document.createElement("option");
  option.value=key;
  option.textContent=hero.name;
  select.appendChild(option);
 });
}

function getRank(level){
 for(const [rank,info] of Object.entries(data.progression.ranks)){
  if(level>=info.levels[0]&&level<=info.levels[1]) return rank;
 }
}

function pointsToReachLevel(level){
 let total=0;
 for(let i=1;i<level;i++){
  total+=data.progression.ranks[getRank(i)].pointsPerLevel;
 }
 return total;
}

function calculateChallengePoints(hero,rank,stats){
 let completed=0;
 Object.values(hero.challenges).forEach(challenge=>{
  if(stats[challenge.type]>=challenge[rank]) completed++;
 });
 return completed;
}

function calculate(){
 const level=Number(document.getElementById("levelInput").value);
 const currentPoints=Number(document.getElementById("pointsInput").value);
 const goal=Number(document.getElementById("goalInput").value);
 const hero=data.heroes[document.getElementById("heroSelect").value];

 if(!level||!goal||!hero) return;

 const rank=getRank(level);
 const rankData=data.progression.ranks[rank];

 const stats={};
 stats[document.getElementById("objective1Stat").value]=Number(document.getElementById("objective1Value").value);
 stats[document.getElementById("objective2Stat").value]=Number(document.getElementById("objective2Value").value);

 const completed=calculateChallengePoints(hero,rank,stats);

 let usagePoints=rankData.usagePoints;
 let objectivePoints=rankData.objectivePoints;

 if(rank==="lord"&&document.getElementById("modeSelect").value==="arcade"){
  usagePoints=rankData.arcade.usagePoints;
  objectivePoints=rankData.arcade.objectivePoints;
 }

 const currentTotal=pointsToReachLevel(level)+currentPoints;
 const remaining=Math.max(0,pointsToReachLevel(goal)-currentTotal);
 const perGame=usagePoints+(completed*objectivePoints);
 const games=perGame?Math.ceil(remaining/perGame):0;

 document.getElementById("result").innerHTML=`
 <h2>${rankData.name}</h2>
 <p>Points needed: ${remaining}</p>
 <p>Objectives completed: ${completed}/2</p>
 <p>Estimated points per game: ${perGame}</p>
 <p>Games needed: ${games}</p>
 <p>Estimated time: ${(games*10/60).toFixed(1)} hours</p>`;
}

document.getElementById("calculateBtn").addEventListener("click",calculate);
loadData();