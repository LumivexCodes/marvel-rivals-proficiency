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


    Object.values(hero.challenges).forEach(challenge=>{


        const value =
            stats[challenge.type] || 0;


        const requirement =
            challenge[rank];



        if(requirement > 0){

            rewards +=
                Math.floor(
                    value / requirement
                );

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



    const hero =
        data.heroes[
            document.getElementById("heroSelect").value
        ];



    if(!hero || !level || !goal){

        return;

    }




    const rank =
        getRank(level);





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





loadData();