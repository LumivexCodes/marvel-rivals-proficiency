let data = {};

async function loadData(){
    const response = await fetch("heroes.json");
    data = await response.json();
    populateHeroes();
}


function populateHeroes(){

    const select = document.getElementById("heroSelect");

    Object.entries(data.heroes).forEach(([key, hero])=>{

        const option = document.createElement("option");
        option.value = key;
        option.textContent = hero.name;

        select.appendChild(option);

    });

}


function getRank(level){

    for(const [rank, info] of Object.entries(data.progression.ranks)){

        if(level >= info.levels[0] && level <= info.levels[1]){
            return rank;
        }

    }

    if(level >= 20){
        return "lord";
    }

}



function pointsToReachLevel(level){

    let total = 0;

    for(let i = 1; i < level; i++){

        const rank = getRank(i);

        total += data.progression.ranks[rank].pointsPerLevel;

    }

    return total;

}




// Calculates how many times objectives are completed
function calculateChallengePoints(hero, rank, stats){

    let rewards = 0;

    Object.values(hero.challenges).forEach(challenge=>{

        const playerStat = stats[challenge.type] || 0;
        const requirement = challenge[rank];

        if(requirement > 0){

            rewards += Math.floor(
                playerStat / requirement
            );

        }

    });

    return rewards;

}





function calculate(){

    const level = Number(
        document.getElementById("levelInput").value
    );

    const currentPoints = Number(
        document.getElementById("pointsInput").value
    );

    const goal = Number(
        document.getElementById("goalInput").value
    );


    const hero = data.heroes[
        document.getElementById("heroSelect").value
    ];


    if(!level || !goal || !hero){
        return;
    }



    const rank = getRank(level);

    const progressionData = data.progression.ranks[rank];

    const rewardData = data.ranks[rank];




    const stats = {};

    stats[
        document.getElementById("objective1Stat").value
    ] = Number(
        document.getElementById("objective1Value").value
    );


    stats[
        document.getElementById("objective2Stat").value
    ] = Number(
        document.getElementById("objective2Value").value
    );





    const objectiveRewards = calculateChallengePoints(
        hero,
        rank,
        stats
    );





    let usagePoints = 0;
    let objectivePoints = 0;



    // Agent - Centurion
    if(rank !== "lord"){

        usagePoints = rewardData.usagePoints;
        objectivePoints = rewardData.objectivePoints;

    }


    // Lord
    else{

        if(
            document.getElementById("modeSelect").value === "arcade"
        ){

            usagePoints = rewardData.arcade.usagePoints;
            objectivePoints = rewardData.arcade.objectivePoints;

        }

        else{

            usagePoints = rewardData.qmComp.usagePoints;
            objectivePoints = rewardData.qmComp.objectivePoints;

        }

    }





    const currentTotal =
        pointsToReachLevel(level) + currentPoints;



    const remaining =
        Math.max(
            0,
            pointsToReachLevel(goal) - currentTotal
        );



    const pointsPerGame =
        usagePoints +
        (objectiveRewards * objectivePoints);



    const games =
        pointsPerGame > 0
        ? Math.ceil(remaining / pointsPerGame)
        : 0;



    document.getElementById("result").innerHTML = `

        <h2>${rank.toUpperCase()}</h2>

        <p>Points needed: ${remaining}</p>

        <p>Objective rewards earned: ${objectiveRewards}</p>

        <p>Estimated points per game: ${pointsPerGame}</p>

        <p>Games needed: ${games}</p>

        <p>Estimated time: ${(games * 10 / 60).toFixed(1)} hours</p>

    `;

}




document
    .getElementById("calculateBtn")
    .addEventListener("click", calculate);



loadData();