// Get Data
var towerListPath = './data/TowerList.txt';
var towerList;

$.ajax({
    url: towerListPath,
    type: 'get',
    async: false,
    success: function(text) {  
        towerList = text.split("\n");
    }
});

// Initialize Variables and Constants
var currentSearchQuery = "";
var cardsAreFlipped = false;

var towerCards = [];

const towerTypeExpander = {
    s: "Steeple of",
    t: "Tower of",
    c: "Citadel of",
}

const coarseDifficultyExpander = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
    4: "Difficult",
    5: "Challenging",
    6: "Intense",
    7: "Remorseless",
    8: "Insane",
    9: "Extreme",
    10: "Terrifying",
    11: "Catastrophic",
}

const difficultyToColour = {
    Easy: "#75F347",
    Medium: "#FFFE00",
    Hard: "#FD7C00",
    Difficult: "#FF0C02",
    Challenging: "#C10000",
    Intense: "#19232D",
    Remorseless: "#C800C8",
    Insane: "#0000FF",
    Extreme: "#0389FF",
    Terrifying: "#00FFFF",
    Catastrophic: "#FFFFFF",
}

const areaExpander = {
    r1: "Ring 1",
    r2: "Ring 2",
    r3: "Ring 3",
    r4: "Ring 4",
    r5: "Ring 5",
    r6: "Ring 6",
    r7: "Ring 7",
    r8: "Ring 8",
    r9: "Ring 9",
    z1: "Zone 1",
    z2: "Zone 2",
    z3: "Zone 3",
    z4: "Zone 4",
    z5: "Zone 5",
    z6: "Zone 6",
    z7: "Zone 7",
    z8: "Zone 8",
    z9: "Zone 9",
    fr: "Forgotten Ridge",
    goe: "Garden of Eeshöl",
    sa: "Silent Abyss",
    lr: "Lost River",
    aa: "Arcane Area",
    pa: "Paradise Atoll",
    pom: "Pit of Misery",
    
}

// Functions
function getAcronym(str, towerType) {
    var words = str.split(" ");
    var out = ""

    for (i = 0; i < words.length; i ++)
    {
        out += words[i].substring(0, 1);
    }

    return out;
}

function expandFineDifficulty(fineDifficulty) {
    if (fineDifficulty <= 0.1) { return "Baseline" } 
    if (fineDifficulty <= 0.21) { return "Bottom-Low" }
    if (fineDifficulty <= 0.32) { return "Low" }
    if (fineDifficulty <= 0.44) { return "Low-Mid" }
    if (fineDifficulty <= 0.55) { return "Mid" }
    if (fineDifficulty <= 0.66) { return "Mid-High" }
    if (fineDifficulty <= 0.77) { return "High" }
    if (fineDifficulty <= 0.88) { return "High-Peak" }
    if (fineDifficulty <= 0.99) { return "Peak" }
}

function expandDifficulty(rawDifficulty) {
    let fineDifficulty = rawDifficulty % 1
    let coarseDifficulty = rawDifficulty - fineDifficulty;

    let coarseDifficultyExpanded = coarseDifficultyExpander[coarseDifficulty];
    let fineDifficultyExpanded = expandFineDifficulty(fineDifficulty.toFixed(2));

    let expandedDifficulty = "(" + rawDifficulty + ") " + fineDifficultyExpanded + " " + coarseDifficultyExpanded;
    return [expandedDifficulty, difficultyToColour[coarseDifficultyExpanded]];
}

function newCard(Data) {
    var newCard = document.createElement("div");
    newCard.classList.add('towerCard');
    document.getElementById("towerList").appendChild(newCard);

    
    var newCard_Inner = document.createElement("div");
    newCard_Inner.classList.add('towerCard__inner');
    
    newCard.addEventListener("mouseenter", function(ev) {
        newCard_Inner.classList.toggle("is-flipped")
    })

    newCard.addEventListener("mouseleave", function(ev) {
        newCard_Inner.classList.toggle("is-flipped")
    })


    var newCard_Front = document.createElement("div");
    newCard_Front.classList.add('towerCard__face');
    newCard_Front.classList.add('towerCard__face--front');
    


    var towerType = document.createElement("p");
    towerType.textContent = towerTypeExpander[Data[0]];
    towerType.classList.add('towerType');
    
    var towerTitle = document.createElement("p");
    towerTitle.textContent = Data[1];
    towerTitle.classList.add('towerTitle');


    if (Data[1].length > 30)
    {
        towerTitle.style.marginTop = "0%";
        towerTitle.style.fontSize = "2em";
    } else if (Data[1].length > 25) {
        towerTitle.style.marginTop = "7%";
        towerTitle.style.fontSize = "2em";
    }


    var newCard_Back = document.createElement("div");
    newCard_Back.classList.add('towerCard__face');
    newCard_Back.classList.add('towerCard__face--back');

    var towerLocation = document.createElement("p");
    towerLocation.textContent = areaExpander[Data[3]];
    towerLocation.classList.add('towerLocation');


    difficultyData = expandDifficulty(parseFloat(Data[2]));
    var towerDifficulty = document.createElement("p");
    towerDifficulty.textContent = difficultyData[0];
    towerDifficulty.style.color = difficultyData[1];
    towerDifficulty.classList.add('towerDifficulty');

    if (difficultyData[1] == "#19232D") { 
        towerDifficulty.style.textShadow = "0 0 0 #ffffff, 0px 0.8px 2px #ffffff";
    }

    newCard.appendChild(newCard_Inner);
        newCard_Inner.appendChild(newCard_Front);
            newCard_Front.appendChild(towerType);
            newCard_Front.appendChild(towerTitle);
        newCard_Inner.appendChild(newCard_Back);
            newCard_Back.appendChild(towerLocation);
            newCard_Back.appendChild(towerDifficulty);

    return newCard;
}

function clearTowerList() {
    for (i = 0; i < towerCards.length; i++)
    {
        let towerCard = towerCards[i];
        document.getElementById("blankList").appendChild(towerCard);
        towerCard.style.visibility = "collapse";
        towerCard.style.position = "absolute";
    }
}

function refreshTowerList()
{
    clearTowerList();

    // Filtering
    for (var i = 0; i < towerList.length; i++)
    {
        let towerData = towerList[i].split("/");

        let towerTitle = towerTypeExpander[towerData[0]].toLowerCase() + " " + towerData[1].toLowerCase();
        let matchesTowerTitle = towerTitle.includes(currentSearchQuery)

        let towerAcronym = towerData[0] + "o" + getAcronym(towerData[1].toLowerCase());
        let matchesTowerAcronym = towerAcronym.includes(currentSearchQuery);

        let towerDifficulty = expandDifficulty(towerData[2])[0].toLowerCase();
        let matchesTowerDifficulty = towerDifficulty.includes(currentSearchQuery);

        let towerLocation = areaExpander[towerData[3]].toLowerCase();
        let matchesTowerLocation = towerLocation.includes(currentSearchQuery);

        let Pass = matchesTowerTitle + matchesTowerAcronym + matchesTowerDifficulty + matchesTowerLocation;

        if (Pass > 0)
        {
            let towerCard = towerCards[i];

            document.getElementById("towerList").appendChild(towerCard);
            towerCard.style.visibility = "visible";
            towerCard.style.position = "relative";
        }
    }
}

function constructTowerList()
{
    for (var i = 0; i < towerList.length; i++)
    {
        let towerData = towerList[i].split("/");

        towerCards[i] = newCard(towerData);
    }
}

// execution
constructTowerList();

var Search = document.getElementById("Search");
Search.addEventListener("input", function(ev) {
    if (ev.data == "(" || ev.data == ")") 
    {
        Search.value = Search.value.substring(0, Search.value.length - 1)
        return;
    }

    newSearchQuery = Search.value;
    document.documentElement.scrollTop = 0;

    if (newSearchQuery === "") 
    {
        currentSearchQuery = "";
    } else 
    {
        currentSearchQuery = newSearchQuery.toLowerCase();
    }

    refreshTowerList();
})


// BUGS:

// #1: Visual, Low Importance
// Card stays flipped even after mouse leaves bounds
// Steps to reproduce: hover over card while typing in search bar