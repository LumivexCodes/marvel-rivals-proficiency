let data = {};



// LOAD JSON

async function loadData() {

    try {

        const response =
            await fetch("heroes.json");


        data =
            await response.json();


        console.log(
            "JSON Loaded:",
            data
        );


        populateHeroes();


    }

    catch(error) {

        console.error(
            "JSON ERROR:",
            error
        );

    }

}




// HERO DROPDOWN

function populateHeroes() {


    const select =
        document.getElementById("heroSelect");



    Object.entries(data.heroes)
    .forEach(([key, hero]) => {


        const option =
            document.createElement("option");


        option.value =
            key;


        option.textContent =
            hero.name;


        select.appendChild(option);


    });



    console.log(
        "Heroes loaded:",
        Object.keys(data.heroes).length
    );

}





// GET RANK FROM LEVEL

function getRank(level) {


    for(
        const [rank, info]
        of Object.entries(data.progression.ranks)
    ) {


        if(
            level >= info.levels[0] &&
            level <= info.levels[1]
        ) {

            return rank;

        }

    }


    return null;

}






// TOTAL POINTS NEEDED TO REACH LEVEL

function pointsToReachLevel(level) {


    let total = 0;


    for(
        let i = 1;
        i < level;
        i++
    ) {


        const rank =
            getRank(i);


        total +=
            data.progression.ranks[rank].pointsPerLevel;


    }


    return total;

}







// CALCULATE

function calculate() {


    const currentLevel =
        Number(
            document.getElementById("levelInput").value
        );


    const currentPoints =
        Number(
            document.getElementById("pointsInput").value
        );


    const goalLevel =
        Number(
            document.getElementById("goalInput").value
        );



    if(
        !currentLevel ||
        !goalLevel
    ) {

        document.getElementById("result").innerHTML =
            "Fill in all fields.";

        return;

    }





    const currentRank =
        getRank(currentLevel);



    const rankData =
        data.progression.ranks[currentRank];





    // TOTAL CURRENT POINTS

    const currentTotal =
        pointsToReachLevel(currentLevel)
        + currentPoints;





    const goalTotal =
        pointsToReachLevel(goalLevel);




    const remaining =
        goalTotal - currentTotal;







    let milestones = "";



    const milestoneLevels =
        [
            5,
            10,
            15,
            20
        ];




    milestoneLevels.forEach(level => {


        if(
            level > currentLevel &&
            level <= goalLevel
        ) {


            const milestoneTotal =
                pointsToReachLevel(level);



            const needed =
                milestoneTotal - currentTotal;



            milestones += `

            <p>
            Level ${level}:
            ${needed} points needed
            </p>

            `;

        }


    });







    document.getElementById("result").innerHTML = `


    <h2>
    ${rankData.name}
    </h2>


    <p>
    Current:
    Level ${currentLevel}
    (${currentPoints}/${rankData.pointsPerLevel})
    </p>


    <h3>
    Milestones
    </h3>


    ${milestones}



    <h3>
    Goal Level ${goalLevel}
    </h3>


    <p>
    Total points required:
    ${remaining}
    </p>


    `;


}







document
    .getElementById("calculateBtn")
    .addEventListener(
        "click",
        calculate
    );






loadData();