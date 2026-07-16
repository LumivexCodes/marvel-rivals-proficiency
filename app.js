let data = {};

const dom = {
    heroSelect: document.getElementById("heroSelect"),
    levelInput: document.getElementById("levelInput"),
    pointsInput: document.getElementById("pointsInput"),
    goalInput: document.getElementById("goalInput"),

    objective1Name: document.getElementById("objective1Name"),
    objective2Name: document.getElementById("objective2Name"),

    objective1Value: document.getElementById("objective1Value"),
    objective2Value: document.getElementById("objective2Value"),

    modeSelect: document.getElementById("modeSelect"),
    calculateBtn: document.getElementById("calculateBtn"),

    result: document.getElementById("result")
};


async function loadData() {

    const response = await fetch("heroes.json");

    data = await response.json();

    populateHeroes();

    setupListeners();

}



function setupListeners() {

    dom.heroSelect.addEventListener(
        "change",
        updateObjectives
    );


    dom.calculateBtn.addEventListener(
        "click",
        calculate
    );

}




function populateHeroes() {

    Object.entries(data.heroes)
        .forEach(([id, hero]) => {

            hero.id = id;

            const option =
                document.createElement("option");


            option.value = id;

            option.textContent =
                hero.name;


            dom.heroSelect.appendChild(option);

        });

}





function updateObjectives() {

    const heroId =
        dom.heroSelect.value;


    if (!heroId) {

        dom.objective1Name.textContent =
            "Auto";

        dom.objective2Name.textContent =
            "Auto";

        return;

    }


    const role =
        data.roles[heroId];


    const objectives =
        data.roleObjectives[role];


    dom.objective1Name.textContent =
        formatObjective(
            objectives.objective1
        );


    dom.objective2Name.textContent =
        formatObjective(
            objectives.objective2
        );

}





function formatObjective(text) {

    return text
        .replaceAll("_", " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );

}






function getRank(level) {

    for (const [rank, info] of Object.entries(data.progression.ranks)) {

        if (
            level >= info.levels[0] &&
            level <= info.levels[1]
        ) {

            return rank;

        }

    }


    return "lord";

}





function getLevelRequirement(level) {

    const rank =
        getRank(level);


    return data.progression.ranks[rank]
        .pointsPerLevel;

}






function pointsToReachLevel(level) {

    let total = 0;


    for (let i = 1; i < level; i++) {

        total += getLevelRequirement(i);

    }


    return total;

}






function getCurrentProgress(level, points) {

    const required =
        getLevelRequirement(level);


    const percentage =
        (points / required) * 100;


    return {
        current: Math.min(points, required),
        required,
        percentage: Math.min(
            percentage,
            100
        )
    };

}






function calculateChallengeRewards(hero, rank, stats) {

    const role =
        data.roles[hero.id];


    const objectives =
        data.roleObjectives[role];


    return Object.values(objectives)
        .reduce((total, objective) => {

            const challenge =
                Object.values(hero.challenges)
                    .find(challenge =>
                        challenge.type === objective
                    );


            if (!challenge) {
                return total;
            }


            const value =
                stats[objective] || 0;


            return total +
                Math.floor(
                    value /
                    challenge[rank]
                );


        }, 0);

}






function getPointsPerGame(rank, rewards) {

    const rankInfo =
        data.ranks[rank];


    const mode =
        dom.modeSelect.value;


    let usagePoints =
        rankInfo.usagePoints;


    let objectivePoints =
        rankInfo.objectivePoints;



    if (rankInfo[mode]) {

        usagePoints =
            rankInfo[mode].usagePoints;


        objectivePoints =
            rankInfo[mode].objectivePoints;

    }



    return (
        usagePoints +
        rewards * objectivePoints
    );

}

function formatTime(minutes) {

    const hours =
        Math.floor(minutes / 60);


    const mins =
        minutes % 60;


    if (hours === 0) {

        return `${mins}m`;

    }


    return `${hours}h ${mins}m`;

}





function createTimeline(
    currentLevel,
    goalLevel,
    pointsPerGame
) {

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

    <div class="timeline-track">

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


    let previousLevel = currentLevel;



    milestones.forEach(level => {

        if (
            level > currentLevel &&
            level <= goalLevel
        ) {

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


            previousLevel = level;

        }

    });



    html += `

    </div>

    `;


    return html;

}





function createSummary(
    role,
    rank,
    pointsPerGame,
    progress
) {

    return `

        <div class="summary">

            <div class="summary-row">

                <span>
                    Role
                </span>

                <b>
                    ${formatObjective(role)}
                </b>

            </div>


            <div class="summary-row">

                <span>
                    Rank
                </span>

                <b>
                    ${rank.toUpperCase()}
                </b>

            </div>


            <div class="summary-row">

                <span>
                    Points/Game
                </span>

                <b>
                    ${pointsPerGame}
                </b>

            </div>


           <div class="progress-container">

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="
                            width:${progress.percentage}%
                        "
                    ></div>

                </div>


                <div class="progress-text">

                    ${progress.current}
                    /
                    ${progress.required}
                    Points

                    <span>
                        ${progress.percentage.toFixed(1)}%
                    </span>

                </div>

            </div>


            `;

}






function calculate() {

    const level =
        Number(dom.levelInput.value);


    const goal =
        Number(dom.goalInput.value);


    const heroId =
        dom.heroSelect.value;



    const hero =
        data.heroes[heroId];



    if (
        !hero ||
        !level ||
        !goal
    ) {

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
            dom.objective1Value.value
        );


    stats[objectives.objective2] =
        Number(
            dom.objective2Value.value
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



    const progress =
        getCurrentProgress(
            level,
            Number(dom.pointsInput.value)
        );



    dom.result.innerHTML = `


        ${createSummary(
            role,
            rank,
            pointsPerGame,
            progress
        )}


        ${createTimeline(
            level,
            goal,
            pointsPerGame
        )}


    `;


    requestAnimationFrame(() => {

        const fill =
            document.querySelector(
                ".progress-fill"
            );


        if (fill) {

            fill.style.width =
                `${progress.percentage}%`;

        }

    });

}






loadData();