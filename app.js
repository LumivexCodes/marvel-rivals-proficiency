let data = {};

async function loadData() {
    try {
        const response = await fetch("heroes.json");
        data = await response.json();
        populateHeroes();
    } catch(error) {
        console.error("JSON ERROR:", error);
    }
}

function populateHeroes() {
    const select = document.getElementById("heroSelect");
    Object.entries(data.heroes).forEach(([key, hero]) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = hero.name;
        select.appendChild(option);
    });
}

function getRank(level) {
    for (const [rank, info] of Object.entries(data.progression.ranks)) {
        if(level >= info.levels[0] && level <= info.levels[1]) return rank;
    }
    return null;
}

function pointsToReachLevel(level) {
    let total = 0;
    for(let i = 1; i < level; i++) {
        const rank = getRank(i);
        total += data.progression.ranks[rank].pointsPerLevel;
    }
    return total;
}

function calculateChallengePoints(hero, rank, stats) {
    let points = 0;
    let completed = 0;

    Object.values(hero.challenges).forEach(challenge => {
        const requirement = challenge[rank];
        const value = stats[challenge.type] || 0;

        if(value >= requirement) {
            completed++;
        }
    });

    const rankData = data.progression.ranks[rank];
    points += completed * rankData.objectivePoints;

    return {points, completed};
}

function calculate() {
    const currentLevel = Number(document.getElementById("levelInput").value);
    const currentPoints = Number(document.getElementById("pointsInput").value);
    const goalLevel = Number(document.getElementById("goalInput").value);

    const hero = data.heroes[document.getElementById("heroSelect").value];

    if(!currentLevel || !goalLevel || !hero) {
        document.getElementById("result").innerHTML = "Fill in all fields.";
        return;
    }

    const rank = getRank(currentLevel);
    const rankData = data.progression.ranks[rank];

    const currentTotal = pointsToReachLevel(currentLevel) + currentPoints;
    const goalTotal = pointsToReachLevel(goalLevel);
    const remaining = Math.max(0, goalTotal - currentTotal);

    const stats = {
        damage: Number(document.getElementById("damageInput").value),
        healing: Number(document.getElementById("healingInput").value),
        damage_blocked: Number(document.getElementById("blockedInput").value),
        kos: Number(document.getElementById("kosInput").value),
        final_hits: Number(document.getElementById("finalHitsInput").value),
        ko_assists: Number(document.getElementById("assistsInput").value)
    };

    const challengeResult = calculateChallengePoints(hero, rank, stats);

    // QM and Comp are identical before Lord. Arcade only differs at Lord+
    let usagePoints = rankData.usagePoints;
    let objectivePoints = rankData.objectivePoints;

    if(rank === "lord" && document.getElementById("modeSelect").value === "arcade") {
        usagePoints = rankData.arcade.usagePoints;
        objectivePoints = rankData.arcade.objectivePoints;
    }

    const pointsPerGame = usagePoints + challengeResult.completed * objectivePoints;
    const games = pointsPerGame ? Math.ceil(remaining / pointsPerGame) : 0;
    const minutes = games * 10;

    document.getElementById("result").innerHTML = `
    <h2>${rankData.name}</h2>
    <p>Current: Level ${currentLevel} (${currentPoints}/${rankData.pointsPerLevel})</p>
    <p>Points needed: ${remaining}</p>
    <hr>
    <h3>Prediction</h3>
    <p>Challenges completed per game: ${challengeResult.completed}/2</p>
    <p>Estimated points per game: ${pointsPerGame}</p>
    <p>Games needed: ${games}</p>
    <p>Estimated time: ${(minutes / 60).toFixed(1)} hours</p>
    `;
}

document.getElementById("calculateBtn").addEventListener("click", calculate);
loadData();