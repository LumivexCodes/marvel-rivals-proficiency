let data = {};

async function loadData(){

    const response = await fetch("heroes.json");

    data = await response.json();

    populateHeroes();

}



function populateHeroes(){

    const select =
        document.getElementById("heroSelect");


    Object.entries(data.heroes).forEach(([key, hero])=>{

        hero.id = key;


        const option =
            document.createElement("option");


        option.value = key;

        option.textContent = hero.name;


        select.appendChild(option);

    });

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


    if(level >= 20){

        return "lord";

    }

}





function pointsToReachLevel(level){

    let total = 0;


    for(let i = 1; i < level; i++){

        const rank = getRank(i);


        total +=
            data.progression.ranks[rank]
            .pointsPerLevel;

    }


    return total;

}





function calculateChallengeRewards(hero, rank, stats){

    let rewards = 0;


    const role =
        data.roles[hero.id];


    const objectives =
        data.roleObjectives[role];



    Object.values(objectives).forEach(type=>{


        const value =
            stats[type] || 0;



        const challenge =
            Object.values(hero.challenges)
            .find(challenge =>
                challenge.type === type
            );



        if(challenge){


            const requirement =
                challenge[rank];



            if(requirement > 0){


                rewards +=
                    Math.floor(
                        value / requirement
                    );


            }

        }


    });


    return rewards;

}





function getPointsPerGame(rank, rewards){

    const rewardData =
        data.ranks[rank];


    return (

        rewardData.usagePoints +

        rewards *
        rewardData.objectivePoints

    );

}





function formatTime(minutes){

    const hours =
        Math.floor(minutes / 60);


    const mins =
        minutes % 60;



    if(hours === 0){

        return `${mins}m`;

    }


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



    let html = "";

    let previousLevel = currentLevel;




    milestones.forEach(level=>{


        if(
            level > currentLevel &&
            level <= goalLevel
        ){



            const pointsNeeded =

                pointsToReachLevel(level)
                -
                pointsToReachLevel(previousLevel);





            const games = Math.ceil(

                pointsNeeded /
                pointsPerGame

            );




            const hours =

                formatTime(
                    games * 10
                );






            html += `


            <div class="milestone">


                <div class="dot"></div>


                <h3>
                    LEVEL ${level}
                </h3>


                <p>

                    ${previousLevel} → ${level}

                    <br><br>

                    ${hours}

                </p>


            </div>


            `;



            previousLevel = level;


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



    if(!hero || !level || !goal){

        return;

    }





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


        <p>
            Role:
            <b>${role}</b>
        </p>


        <p>
            Rank:
            <b>${rank.toUpperCase()}</b>
        </p>


        <p>
            Points/Game:
            <b>${pointsPerGame}</b>
        </p>


        ${timeline}


    `;


}





document
    .getElementById("calculateBtn")
    .addEventListener(
        "click",
        calculate
    );


document
    .getElementById("heroSelect")
    .addEventListener("change", function(){

        const heroId = this.value;

        if(!heroId){
            document.getElementById("objective1Name").textContent = "Auto";
            document.getElementById("objective2Name").textContent = "Auto";
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

    });



function formatObjective(text){

    return text
        .replace("_", " ")
        .replace(/\b\w/g, char => char.toUpperCase());

}


loadData();