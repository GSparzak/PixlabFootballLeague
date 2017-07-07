var wyniki = [];
var fixtures = [];
var players = ["Płotek", "Michał", "Grz3gorz", "Boguś", "Dyga", "Gregor", "Dawid"];

//update players ranking after submiting match result
var updateRanking = function () {
    var resetRanking = function () {
        var $rankingRows = $('#ranking tr');
        for (var i = 1; i < $rankingRows.length; i++) {
            for (var j = 1; j < $rankingRows[i].childNodes.length; j++) {
                $rankingRows[i].childNodes[j].innerHTML = 0;
            }
        }
    };
    //sort ranking by wins; if number of wins is the same, the player with higher goals difference is higher; if that is also equal, the player with more goals scores (gf) is better
    var sortRanking = function () {
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
            var result1 = parseInt(meczyk.team1Score);
            var result2 = parseInt(meczyk.team2Score);
            var winner, loser;
            var winnerTeam = [];
            var loserTeam = [];
            var defineWinner = function () {
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
            }();
            var spliter = " & ";
            winnerTeam.push(winner.split(spliter)[0]);
            winnerTeam.push(winner.split(spliter)[1]);
            loserTeam.push(loser.split(spliter)[0]);
            loserTeam.push(loser.split(spliter)[1]);
            // update winners numbers
            for (var i = 1; i < winnerTeam.length; i++){
                //find the row in the ranking with current player data
                var row = $('#ranking td').filter(function () {
                    return $(this).text() === winnerTeam[i];
                }).closest('tr')[0];
                //get current numbers
                var currentPlayed = row.childNodes[1];
                var currentWins = row.childNodes[2];
                var currentGF = row.childNodes[4];
                var currentGA = row.childNodes[5];
                var currentGD = row.childNodes[6];
                var NumOfCurrentPlayed = parseInt(currentPlayed.innerHTML);
                var NumOfCurrentWins = parseInt(currentWins.innerHTML);
                var NumOfCurrentGF = parseInt(currentGF.innerHTML);
                var NumOfCurrentGA = parseInt(currentGA.innerHTML);
                var NumOfCurrentGD = parseInt(currentGD.innerHTML);
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
                var row = $('#ranking td').filter(function () {
                    return $(this).text() === loserTeam[i];
                }).closest('tr')[0];
                //get current numbers
                var currentPlayed = row.childNodes[1];
                var currentLoses = row.childNodes[3];
                var currentGF = row.childNodes[4];
                var currentGA = row.childNodes[5];
                var currentGD = row.childNodes[6];
                var NumOfCurrentPlayed = parseInt(currentPlayed.innerHTML);
                var NumOfCurrentLoses = parseInt(currentLoses.innerHTML);
                var NumOfCurrentGF = parseInt(currentGF.innerHTML);
                var NumOfCurrentGA = parseInt(currentGA.innerHTML);
                var NumOfCurrentGD = parseInt(currentGD.innerHTML);
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

var createSeason = function () {
    var teams = [];
    var games = [];

    //take the array with players names and make all possible teams
    var createTeams = function() {
        var tempTeams = [];
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

    var createAllTeamCombinations = function (){
        var count = 0;
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

    var removeDuplicates = function () {
        games.forEach(function (game) {
            for (var i = 0; i < games.length; i++) {
                    if ((games[i][0] === game[2] || games[i][0] === game[3]) && (games[i][1] === game[2] || games[i][1] === game[3]) && (games[i][2] === game[0] || games[i][2] === game[1]) && (games[i][3] === game[0] || games[i][3] === game[1])){
                        games.splice(i, 1);
                    }
            }
        });
    }

    var saveFixtures = function () {
        games.forEach(function (match) {
            var game = {};
            for (var i = 0; i < match.length; i++){
                game['player' + i] = match[i];
            }
            fixtures.push(game);
        })
        localStorage.setItem('fixtures', JSON.stringify(fixtures));
    }

    var createFixtures = function() {
        createAllTeamCombinations();
        removeDuplicates();
        saveFixtures();
    }

    createTeams();
    createFixtures();
}

var launchApp = function() {
    if (!JSON.parse(localStorage.getItem('fixtures'))){
        if(confirm('There are no fixtures. Do you want to start new season?')){
            createSeason();
        }
    }
    //create players ranking
    var showRanking = function (names) {
        var $ranking = $('#ranking table');
        var $tbody = $('<tbody>');

        names.forEach(function (name) {
            var $tr = $('<tr>');
            var $td = $('<td>');
            $td.text(name).addClass('rankNames');
            $tr.append($td);
            var $td1 = $('<td>');
            $td1.text(0).addClass('rankNames gamesPlayed');
            $tr.append($td1);
            var $td2 = $('<td>');
            $td2.text(0).addClass('rankNames wins');
            $tr.append($td2);
            var $td3 = $('<td>');
            $td3.text(0).addClass('rankNames');
            $tr.append($td3);
            var $td4 = $('<td>');
            $td4.text(0).addClass('rankNames gf');
            $tr.append($td4);
            var $td5 = $('<td>');
            $td5.text(0).addClass('rankNames');
            $tr.append($td5);
            var $td6 = $('<td>');
            $td6.text(0).addClass('rankNames gd');
            $tr.append($td6);
            $tbody.append($tr);
        })
        $ranking.append($tbody);
    }



    var displayFixtures = function () {
        var $fixtures = $('#fixtures');
        fixtures = localStorage.getItem('fixtures') ? JSON.parse(localStorage.getItem('fixtures')) : [];
        var i = 0;
        fixtures.forEach(function (game) {
            var $tr = $('<tr>');
            $tr.attr('id', 'game' + i);
            var $td1 = $('<td>');
            $td1.text(game.player0 + ' & ' + game.player1).addClass('team1');
            $tr.append($td1);
            var $td2 = $('<td>');
            $td2.text('vs').addClass('versus');
            $tr.append($td2);
            var $td3 = $('<td>');
            $td3.text(game.player2 + ' & ' + game.player3).addClass('team2');
            $tr.append($td3);
            var $td4 = $('<td>');
            var $form = $('<form>');
            var $input1 = $('<input>');
            var $input2 = $('<input>');
            var $input3 = $('<input>');
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

    displayFixtures();
    showRanking(players);
    updateResults();
    updateRanking();
};

var updateResults = function () {
    if (localStorage.getItem('wyniki')) {
        wyniki = JSON.parse(localStorage.getItem('wyniki'))
    }
    var $resultsTable = $('#results');
    $resultsTable.empty();
    if (wyniki.length){
        wyniki.forEach(function (meczyk) {
            var $tr = $('<tr>');
            var $td1 = $('<td>');
            $td1.text(meczyk.team1 + " vs " + meczyk.team2);
            $tr.append($td1);
            var $td2 = $('<td>');
            $td2.text(meczyk.team1Score + " : " + meczyk.team2Score);
            $td2.addClass('score');
            $tr.append($td2);
            $tr.addClass('results');
            $resultsTable.append($tr);
        })
    }
}

launchApp();
// createSeason();

var $nextMatch;

var $drawBtn = $('.drawRandomGame');
var drawNextGame = function () {
    var $fixtures = $('#fixtures tr');
    var numOfGamesLeft = $fixtures.length;
    var nextGame = Math.round(Math.random()*numOfGamesLeft);
    var chosenGame = $fixtures[nextGame].innerText;
    var chosenGameID = $fixtures[nextGame].getAttribute('id');
    var $nextGameDiv = $('.nextGame');
    var $span = $('<span>');
    $span.append(chosenGame);
    $span.attr('data-info', chosenGameID);
    $nextGameDiv.html($span);
}

$nextMatch = $('.nextGame');

var $fixtures = $('#fixtures tr');

var submitMatchScore = function (e) {
    var saveFixturesInStorage = function () {
        fixtures = [];
        var $gamesLeft = $('#fixtures tr');
        var $gamesLeftArray = Array.prototype.slice.call($gamesLeft);
        $gamesLeftArray.forEach(function (game) {
            var fixture = {};
            players = [];
            var team1 = game.children[0].innerText;
            var team2 = game.children[2].innerText;
            var spliter = " & ";
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
    var $row = e.delegateTarget;
    var team1 = e.delegateTarget.cells[0].innerText;
    var team2 = e.delegateTarget.cells[2].innerText;
    var team1Score = e.target[0].value;
    var team2Score = e.target[1].value;
    var meczyk = {};
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
    $('html, body').animate({
        scrollTop: 0
    }, 500);
};

var scrollToDrawnGame = function (e) {
    e.preventDefault();
    var targetID = $('.nextGame > span').attr('data-info');
    var target = $('#' + targetID);
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
    var target = $('#listOfGames');
    var btn = $('#to2ndPage');
    // target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    event.preventDefault();
    $('html, body').animate({
        scrollTop: target.offset().top
    }, 500, function() {
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
    btn.fadeOut();
})

$('#backToTop').on('click', function () {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: 0
    }, 500);
})

$(document).on('scroll', function () {
    var btn = $('#to2ndPage');
    var top = $('#backToTop');
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
