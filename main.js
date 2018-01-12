let wyniki = [];
let fixtures = [];
let players = ["@plotek", "@michal", "@grz3gorz", "@dyga", "@gsparzak", "@dawid", "@tomasz"];


function createSeason() {
    console.log('start createSeason');
    let teams = [];
    var games = [];

    //take the array with players names and make all possible teams
    function createTeams() {
        let tempTeams = [];
        for (var i = 0; i < players.length; i++) {
            eval("tempTeams.push([])");
            for (var j = 0; j < players.length; j++) {
                if (j <= i) {
                    continue;
                } else {
                    eval("tempTeams[i].push([])");
                    tempTeams[i][j - (i + 1)].push(players[i]);
                    tempTeams[i][j - (i + 1)].push(players[j]);
                }
            }
        }
        for (var i = 0; i < tempTeams.length; i++) {
            if (tempTeams[i].length === 0) {
                tempTeams.splice(i, 1);
                i--;
            } else {
                teams = tempTeams.reduce(function(prev, curr) {
                    return prev.concat(curr);
                })
            }
        }
    };

    var createAllTeamCombinations = function() {
        let count = 0;
        teams.forEach(function(currTeam){
            for (var i = 0; i < teams.length; i++) {
                if (!teams[i].includes(currTeam[0]) && !teams[i].includes(currTeam[1])) {
                    eval("games.push([])");
                    games[count].push(currTeam[0]);
                    games[count].push(currTeam[1]);
                    games[count].push(teams[i][0]);
                    games[count].push(teams[i][1]);
                    count++;
                }
            }
        });
    }

    function removeDuplicates() {
        games.forEach(function (game) {
            for (var i = 0; i < games.length; i++) {
                    if ((games[i][0] === game[2] || games[i][0] === game[3]) && (games[i][1] === game[2] || games[i][1] === game[3]) && (games[i][2] === game[0] || games[i][2] === game[1]) && (games[i][3] === game[0] || games[i][3] === game[1])){
                        games.splice(i, 1);
                    }
            }
        });
    }

    function saveFixtures() {
        games.forEach(function (match) {
            var game = {};
            for (var i = 0; i < match.length; i++){
                game['player' + i] = match[i];
            }
            fixtures.push(game);
        })
        localStorage.setItem('fixtures', JSON.stringify(fixtures));
    }

    function createFixtures() {
        createAllTeamCombinations();
        removeDuplicates();
        saveFixtures();
    }

    createTeams();
    createFixtures();
}

function launchApp() {
    if (!JSON.parse(localStorage.getItem('fixtures'))){
        if(confirm('There are no fixtures. Do you want to start new season?')){
            createSeason();
        }
    }

    displayFixtures();
    showRanking(players);
    updateResults();
    updateRanking();
    countGamesLeft();
};

//create players ranking
function showRanking(names) {
    const $ranking = $('#ranking table');
    const $tbody = $('<tbody>');

    names.forEach(function (name) {
        const $tr = $('<tr>');
        const $td = $('<td>');
        $td.text(name).addClass('rankNames');
        $tr.append($td);
        const $td1 = $('<td>');
        $td1.text(0).addClass('rankNames gamesPlayed');
        $tr.append($td1);
        const $td2 = $('<td>');
        $td2.text(0).addClass('rankNames wins');
        $tr.append($td2);
        const $td3 = $('<td>');
        $td3.text(0).addClass('rankNames');
        $tr.append($td3);
        const $td4 = $('<td>');
        $td4.text(0).addClass('rankNames gf');
        $tr.append($td4);
        const $td5 = $('<td>');
        $td5.text(0).addClass('rankNames');
        $tr.append($td5);
        const $td6 = $('<td>');
        $td6.text(0).addClass('rankNames gd');
        $tr.append($td6);
        $tbody.append($tr);
    })
    $ranking.append($tbody);
}



function displayFixtures() {
    const $fixtures = $('#fixtures');
    fixtures = localStorage.getItem('fixtures') ? JSON.parse(localStorage.getItem('fixtures')) : [];
    let i = 0;
    fixtures.forEach(function (game) {
        const $tr = $('<tr>');
        $tr.attr('id', 'game' + i);
        const $td1 = $('<td>');
        $td1.text(game.player0 + ' & ' + game.player1).addClass('team1');
        $tr.append($td1);
        const $td2 = $('<td>');
        $td2.text('vs').addClass('versus');
        $tr.append($td2);
        const $td3 = $('<td>');
        $td3.text(game.player2 + ' & ' + game.player3).addClass('team2');
        $tr.append($td3);
        const $td4 = $('<td>');
        const $form = $('<form>');
        const $input1 = $('<input>');
        const $input2 = $('<input>');
        const $input3 = $('<input>');
        $form.addClass('result');
        $input1.attr({type: 'number', min: 0, name: 'team1Score', required: true});
        $input2.attr({type: 'number', min: 0, name: 'team2Score', required: true});
        $input3.attr('type', 'submit').val('ZAPISZ WYNIK');
        $form.append($input1);
        $form.append($input2);
        $form.append($input3);
        $td4.append($form);
        $tr.append($td4);
        $fixtures.append($tr);
        i++;
    })
}

function updateResults() {
    if (localStorage.getItem('wyniki')) {
        wyniki = JSON.parse(localStorage.getItem('wyniki'))
    }
    const $resultsTable = $('#results');
    $resultsTable.empty();
    if (wyniki.length){
        wyniki.forEach(function(meczyk) {
            const $tr = $('<tr>');
            const $td1 = $('<td>');
            $td1.text(meczyk.team1 + " vs " + meczyk.team2);
            $tr.append($td1);
            const $td2 = $('<td>');
            $td2.text(meczyk.team1Score + " : " + meczyk.team2Score);
            $td2.addClass('score');
            $tr.append($td2);
            $tr.addClass('results');
            $resultsTable.append($tr);
        })
    }
}

//update players ranking after submiting match result
function updateRanking() {
    function resetRanking() {
        const $rankingRows = $('#ranking tr');
        for (var i = 1; i < $rankingRows.length; i++) {
            for (var j = 1; j < $rankingRows[i].childNodes.length; j++) {
                $rankingRows[i].childNodes[j].innerHTML = 0;
            }
        }
    };

    //sort ranking by wins; if number of wins is the same, the player with higher goals difference is higher; if that is also equal, the player with more goals scored (gf) is better
    function sortRanking() {
        $(' #ranking tbody > tr').sort(function (a, b) {
            if (+$('td.wins', b).text() === +$('td.wins', a).text()) {
                if (+$('td.gd', b).text() === +$('td.gd', a).text()) {
                    return +$('td.gf', b).text() > +$('td.gf', a).text();
                }
                return +$('td.gd', b).text() > +$('td.gd', a).text();
            }
            return +$('td.wins', b).text() > +$('td.wins', a).text();
        }).appendTo('tbody')
    }

    resetRanking ();

    // find who won the game, who lost it and was the score and put it into separate arrays
    if (wyniki.length){
        wyniki.forEach(function (meczyk) {
            const result1 = parseInt(meczyk.team1Score);
            const result2 = parseInt(meczyk.team2Score);
            let winner, loser;
            const winnerTeam = [];
            const loserTeam = [];
            function defineWinner() {
                if (result1 > result2) {
                    winner = meczyk.team1;
                    loser = meczyk.team2;
                    winnerTeam.push(result1);
                    loserTeam.push(result2);
                }
                else {
                    winner = meczyk.team2;
                    loser = meczyk.team1;
                    winnerTeam.push(result2);
                    loserTeam.push(result1);
                }
            }
            defineWinner();
            const spliter = " & ";
            winnerTeam.push(winner.split(spliter)[0]);
            winnerTeam.push(winner.split(spliter)[1]);
            loserTeam.push(loser.split(spliter)[0]);
            loserTeam.push(loser.split(spliter)[1]);
            // update winners numbers
            for (var i = 1; i < winnerTeam.length; i++){
                //find the row in the ranking with current player data
                let row = $('#ranking td').filter(function () {
                    return $(this).text() === winnerTeam[i];
                }).closest('tr')[0];
                //get current numbers
                const currentPlayed = row.childNodes[1];
                const currentWins = row.childNodes[2];
                const currentGF = row.childNodes[4];
                const currentGA = row.childNodes[5];
                const currentGD = row.childNodes[6];
                const NumOfCurrentPlayed = parseInt(currentPlayed.innerHTML);
                const NumOfCurrentWins = parseInt(currentWins.innerHTML);
                const NumOfCurrentGF = parseInt(currentGF.innerHTML);
                const NumOfCurrentGA = parseInt(currentGA.innerHTML);
                const NumOfCurrentGD = parseInt(currentGD.innerHTML);
                //update the numbers
                currentPlayed.innerHTML = (NumOfCurrentPlayed + 1).toString();
                currentWins.innerHTML = (NumOfCurrentWins + 1).toString();
                currentGF.innerHTML = (NumOfCurrentGF + winnerTeam[0]).toString();
                currentGA.innerHTML = (NumOfCurrentGA + loserTeam[0]).toString();
                currentGD.innerHTML = (NumOfCurrentGD + (winnerTeam[0] - loserTeam[0])).toString();
            }
            //update losers numbers
            for (var i = 1; i < loserTeam.length; i++){
                //find the row in the ranking with current player data
                let row = $('#ranking td').filter(function () {
                    return $(this).text() === loserTeam[i];
                }).closest('tr')[0];
                //get current numbers
                const currentPlayed = row.childNodes[1];
                const currentLoses = row.childNodes[3];
                const currentGF = row.childNodes[4];
                const currentGA = row.childNodes[5];
                const currentGD = row.childNodes[6];
                const NumOfCurrentPlayed = parseInt(currentPlayed.innerHTML);
                const NumOfCurrentLoses = parseInt(currentLoses.innerHTML);
                const NumOfCurrentGF = parseInt(currentGF.innerHTML);
                const NumOfCurrentGA = parseInt(currentGA.innerHTML);
                const NumOfCurrentGD = parseInt(currentGD.innerHTML);
                //update the numbers
                currentPlayed.innerHTML = (NumOfCurrentPlayed + 1).toString();
                currentLoses.innerHTML = (NumOfCurrentLoses + 1).toString();
                currentGF.innerHTML = (NumOfCurrentGF + loserTeam[0]).toString();
                currentGA.innerHTML = (NumOfCurrentGA + winnerTeam[0]).toString();
                currentGD.innerHTML = (NumOfCurrentGD - (winnerTeam[0] - loserTeam[0])).toString();
            }
            //sort the ranking by wins/GD/GF
            sortRanking();
        })
    }
};

function countGamesLeft () {
    const gamesLeft = fixtures.length;
    const $paragraph = $('#gamesLeft');
    $paragraph.text('Pozostało meczyków: ' + gamesLeft);
}

launchApp();

let $nextMatch;
const $drawBtn = $('.drawRandomGame');
const $fixtures = $('#fixtures tr');
function drawNextGame () {
    const $fixtures = $('#fixtures tr');
    const numOfGamesLeft = $fixtures.length;
    const nextGame = Math.round(Math.random()*numOfGamesLeft);
    const chosenGame = $fixtures[nextGame].innerText;
    const chosenGameID = $fixtures[nextGame].getAttribute('id');
    const $nextGameDiv = $('.nextGame');
    const $span = $('<span>');
    $span.append(chosenGame);
    $span.attr('data-info', chosenGameID);
    $nextGameDiv.html($span);
}

$nextMatch = $('.nextGame');

function submitMatchScore (e) {
    function saveFixturesInStorage () {
        fixtures = [];
        const $gamesLeft = $('#fixtures tr');
        let $gamesLeftArray = Array.prototype.slice.call($gamesLeft);
        $gamesLeftArray.forEach(function (game) {
            const fixture = {};
            players = [];
            const team1 = game.children[0].innerText;
            const team2 = game.children[2].innerText;
            const spliter = " & ";
            players.push(team1.split(spliter)[0]);
            players.push(team1.split(spliter)[1]);
            players.push(team2.split(spliter)[0]);
            players.push(team2.split(spliter)[1]);
            for (var i = 0; i < players.length; i++) {
                fixture['player' + i] = players[i];
            }
            fixtures.push(fixture);
            localStorage.setItem("fixtures", JSON.stringify(fixtures));
        })
    }
    const $row = e.delegateTarget;
    const team1 = e.delegateTarget.cells[0].innerText;
    const team2 = e.delegateTarget.cells[2].innerText;
    const team1Score = e.target[0].value;
    const team2Score = e.target[1].value;
    const meczyk = {};
    wyniki = localStorage.getItem('wyniki') ? JSON.parse(localStorage.getItem('wyniki')) : [];
    meczyk.team1 = team1;
    meczyk.team2 = team2;
    meczyk.team1Score = team1Score;
    meczyk.team2Score = team2Score;
    wyniki.push(meczyk);
    localStorage.setItem("wyniki", JSON.stringify(wyniki));
    updateResults();
    updateRanking();
    $row.remove();
    saveFixturesInStorage();
    countGamesLeft();
    $('html, body').animate({
        scrollTop: 0
    }, 500);
};

var scrollToDrawnGame = function (e) {
    e.preventDefault();
    const targetID = $('.nextGame > span').attr('data-info');
    const target = $('#' + targetID);
    $('html, body').animate({
        scrollTop: target.offset().top
    }, 800, function() {
      // Callback after animation
      // Must change focus!
        var $target = $(target);
        $target.focus();
        if ($target.is(":focus")) { // Checking if the target was focused
            return false;
        } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
        };
    });
}



$fixtures.on('submit', 'form', function (e) {
    e.preventDefault();
    submitMatchScore(e);
});

$drawBtn.on('click', drawNextGame);

$nextMatch.on('click', scrollToDrawnGame);

/*


########     ###     ######   ########     ######  ##     ##    ###    ##    ##  ######   ########
##     ##   ## ##   ##    ##  ##          ##    ## ##     ##   ## ##   ###   ## ##    ##  ##
##     ##  ##   ##  ##        ##          ##       ##     ##  ##   ##  ####  ## ##        ##
########  ##     ## ##   #### ######      ##       ######### ##     ## ## ## ## ##   #### ######
##        ######### ##    ##  ##          ##       ##     ## ######### ##  #### ##    ##  ##
##        ##     ## ##    ##  ##          ##    ## ##     ## ##     ## ##   ### ##    ##  ##
##        ##     ##  ######   ########     ######  ##     ## ##     ## ##    ##  ######   ########


*/

$('#to2ndPage').on("click", function(){
    const target = $('#listOfGames');
    const btn = $('#to2ndPage');
    // target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    event.preventDefault();
    $('html, body').animate({
        scrollTop: target.offset().top
    }, 500, function() {
      // Callback after animation
      // Must change focus!
        const $target = $(target);
        $target.focus();
        if ($target.is(":focus")) { // Checking if the target was focused
            return false;
        } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
        };
    });
    btn.fadeOut();
})

$('#backToTop').on('click', function () {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: 0
    }, 500);
})

$(document).on('scroll', function () {
    const btn = $('#to2ndPage');
    const top = $('#backToTop');
    // var link = $('#to2ndPage a');
    if ($(document).scrollTop() === 0) {
        btn.fadeIn();
        top.fadeOut();
    }
    if ($(document).scrollTop() >= 100) {
        btn.fadeOut();
    }
    if ($(document).scrollTop() >= 1000) {
        top.fadeIn();
    }
})
