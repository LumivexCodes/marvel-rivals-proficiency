let data = {};



async function loadData(){

    const response = await fetch("heroes.json");

    data = await response.json();

    populateHeroes();

    setupHeroListener();

}





function populateHeroes(){

    const select =
        document.getElementById("heroSelect");


    Object.entries(data.heroes).forEach(([id, hero])=>{


        hero.id = id;


        const option =
            document.createElement("option");


        option.value = id;

        option.textContent = hero.name;


        select.appendChild(option);


    });


}






function setupHeroListener(){

    document
    .getElementById("heroSelect")
    .addEventListener(
        "change",
        updateObjectives
    );

}





function updateObjectives(){

    const heroId =
        document.getElementById("heroSelect").value;



    if(!heroId){

        document.getElementById("objective1Name").textContent =
            "Auto";

        document.getElementById("objective2Name").textContent =
            "Auto";

        return;

    }



    const role =
        data.roles[heroId];



    const objectives =
        data.roleObjectives[role];



    document.getElementById("objective1Name").textContent =
        formatObjective(objectives.objective1);



    document.getElementById("objective2Name").textContent =
        formatObjective(objectives.objective2);


}





function formatObjective(text){

    return text
    .replaceAll("_"," ")
    .replace(/\b\w/g,
        char => char.toUpperCase()
    );

}







function getRank(level){


    for(const [rank, info] of Object.entries(data.progression.ranks)){


        if(
            level >= info.levels[0] &&
            level <= info.levels[1]
        ){

            return rank;

        }

    }


    return "lord";


}






function pointsToReachLevel(level){


    let total = 0;



    for(let i = 1; i < level; i++){


        const rank =
            getRank(i);



        total +=
            data.progression.ranks[rank]
            .pointsPerLevel;


    }



    return total;


}








function calculateChallengeRewards(
    hero,
    rank,
    stats
){


    let rewards = 0;



    const role =
        data.roles[hero.id];



    const objectives =
        data.roleObjectives[role];



    Object.values(objectives)
    .forEach(type=>{


        const challenge =
            Object.values(hero.challenges)
            .find(c =>
                c.type === type
            );



        if(!challenge)
            return;



        const value =
            stats[type] || 0;



        rewards +=
            Math.floor(
                value /
                challenge[rank]
            );


    });



    return rewards;


}








function getPointsPerGame(
    rank,
    rewards
){


    const rankInfo =
        data.ranks[rank];



    return (
        rankInfo.usagePoints +
        rewards *
        rankInfo.objectivePoints
    );


}








function formatTime(minutes){


    const hours =
        Math.floor(minutes / 60);



    const mins =
        minutes % 60;



    if(hours === 0)
        return `${mins}m`;



    return `${hours}h ${mins}m`;


}









function createTimeline(
    currentLevel,
    goalLevel,
    pointsPerGame
){


    const milestones = [
        5,
        10,
        15,
        20,
        25,
        30,
        40,
        50,
        60,
        70
    ];



    let html = `

    <div class="current-node">

        <div class="dot current"></div>

        <h3>
            CURRENT
        </h3>

        <p>
            LEVEL ${currentLevel}
        </p>

    </div>

    `;



    let previousLevel =
        currentLevel;




    milestones.forEach(level=>{


        if(
            level > currentLevel &&
            level <= goalLevel
        ){



            const pointsNeeded =
                pointsToReachLevel(level)
                -
                pointsToReachLevel(previousLevel);




            const games =
                Math.ceil(
                    pointsNeeded /
                    pointsPerGame
                );




            html += `


            <div class="milestone">


                <div class="dot"></div>


                <h3>
                    LEVEL ${level}
                </h3>



                <p>

                    <b>
                    ${pointsNeeded}
                    </b>
                    POINTS

                    <br>

                    ${games}
                    GAMES

                    <br>

                    ${formatTime(games * 10)}

                </p>


            </div>


            `;



            previousLevel =
                level;


        }


    });



    return html;


}









function calculate(){


    const level =
        Number(
            document.getElementById("levelInput").value
        );



    const goal =
        Number(
            document.getElementById("goalInput").value
        );



    const heroId =
        document.getElementById("heroSelect").value;



    const hero =
        data.heroes[heroId];



    if(!hero || !level || !goal)
        return;





    const rank =
        getRank(level);





    const role =
        data.roles[heroId];





    const objectives =
        data.roleObjectives[role];





    const stats = {};



    stats[objectives.objective1] =
        Number(
            document.getElementById("objective1Value").value
        );



    stats[objectives.objective2] =
        Number(
            document.getElementById("objective2Value").value
        );






    const rewards =
        calculateChallengeRewards(
            hero,
            rank,
            stats
        );





    const pointsPerGame =
        getPointsPerGame(
            rank,
            rewards
        );





    const timeline =
        createTimeline(
            level,
            goal,
            pointsPerGame
        );





    document.getElementById("result")
    .innerHTML = `


    <div class="summary">

        <p>
            Role:
            <b>${formatObjective(role)}</b>
        </p>


        <p>
            Rank:
            <b>${rank.toUpperCase()}</b>
        </p>


        <p>
            Points/Game:
            <b>${pointsPerGame}</b>
        </p>


    </div>



    <div id="result">

        ${timeline}

    </div>


    `;


}








document
.getElementById("calculateBtn")
.addEventListener(
    "click",
    calculate
);




loadData();