
var wyniki = [];
var createSeason = function() {

    var teams = [];
    var games = [];
    var players = ["Płotek", "Michał", "Grz3gorz", "Boguś", "Dyga", "Gregor"];

    var showRanking = function (names) {
        var $ranking = $('#ranking table');
        var $tbody = $('<tbody>');

        names.forEach(function (name) {
            var $tr = $('<tr>');
            var $td = $('<td>');
            $td.text(name).addClass('rankNames');
            $tr.append($td);
            var $td1 = $('<td>');
            $td1.text(0).addClass('rankNames wins');
            $tr.append($td1);
            var $td2 = $('<td>');
            $td2.text(0).addClass('rankNames');
            $tr.append($td2);
            var $td3 = $('<td>');
            $td3.text(0).addClass('rankNames gf');
            $tr.append($td3);
            var $td4 = $('<td>');
            $td4.text(0).addClass('rankNames');
            $tr.append($td4);
            var $td5 = $('<td>');
            $td5.text(0).addClass('rankNames gd');
            $tr.append($td5);
            $tbody.append($tr);
        })
        $ranking.append($tbody);
    }

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

    var createFixtures = function() {
        createAllTeamCombinations();
        removeDuplicates();
    }

    var displayFixtures = function () {
        var $fixtures = $('#fixtures');

        games.forEach(function (game) {
            var $tr = $('<tr>');
            var $td1 = $('<td>');
            $td1.text(game[0] + ' & ' + game[1]).addClass('team1');
            $tr.append($td1);
            var $td2 = $('<td>');
            $td2.text('vs').addClass('versus');
            $tr.append($td2);
            var $td3 = $('<td>');
            $td3.text(game[2] + ' & ' + game[3]).addClass('team2');
            $tr.append($td3);
            var $td4 = $('<td>');
            var $form = $('<form>');
            var $input1 = $('<input>');
            var $input2 = $('<input>');
            var $input3 = $('<input>');
            $form.addClass('result');
            $input1.attr({type: 'number', name: 'team1Score'});
            $input2.attr({type: 'number', name: 'team2Score'});
            $input3.attr('type', 'submit').val('SAVE');
            $form.append($input1);
            $form.append($input2);
            $form.append($input3);
            $td4.append($form);
            $tr.append($td4);
            $fixtures.append($tr);
        })
    }

    createTeams();
    createFixtures();
    displayFixtures();
    showRanking(players);

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

createSeason();
updateResults();

var $drawBtn = $('.drawRandomGame');
var drawNextGame = function () {
    var $fixtures = $('#fixtures tr');
    var numOfGamesLeft = $fixtures.length;
    var nextGame = Math.round(Math.random()*numOfGamesLeft);
    var chosenGame = $fixtures[nextGame].innerText;
    var $nextGameDiv = $('.nextGame');
    var $span = $('<span>');
    $span.append(chosenGame);
    $nextGameDiv.html($span);
}

var $fixtures = $('#fixtures tr');

var submitMatchScore = function (e) {
    var $row = e.delegateTarget;
    var team1 = e.delegateTarget.cells[0].innerText;
    var team2 = e.delegateTarget.cells[2].innerText;
    var team1Score = e.target[0].value;
    var team2Score = e.target[1].value;
    var meczyk = {};
    var wyniki = localStorage.getItem('wyniki') ? JSON.parse(localStorage.getItem('wyniki')) : [];
    meczyk.team1 = team1;
    meczyk.team2 = team2;
    meczyk.team1Score = team1Score;
    meczyk.team2Score = team2Score;
    wyniki.push(meczyk);
    localStorage.setItem("wyniki", JSON.stringify(wyniki));
    updateResults();
    // updateRanking();
    $row.remove();
};

var updateRanking = function (e) {
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

    // $resultsTable.empty();
    if (wyniki.length){
        wyniki.forEach(function (meczyk) {
    //
    // var result1 = e.delegateTarget.cells[3].childNodes[0][0].valueAsNumber;
    // var result2 = e.delegateTarget.cells[3].childNodes[0][1].valueAsNumber;
//
//     var result1 = e.delegateTarget.cells[3].childNodes[0][0].valueAsNumber;
//     var result2 = e.delegateTarget.cells[3].childNodes[0][1].valueAsNumber;
//     var winner, loser;
//     var winnerTeam = [];
//     var loserTeam = [];
//     var defineWinner = function () {
//         if (result1 > result2) {
//             winner = team1;
//             loser = team2;
//             winnerTeam.push(result1);
//             loserTeam.push(result2);
//         }
//         else {
//             winner = team2;
//             loser = team1;
//             winnerTeam.push(result2);
//             loserTeam.push(result1);
//         }
//     }();
//     var spliter = " & ";
//     winnerTeam.push(winner.split(spliter)[0]);
//     winnerTeam.push(winner.split(spliter)[1]);
//     loserTeam.push(loser.split(spliter)[0]);
//     loserTeam.push(loser.split(spliter)[1]);
//     for (var i = 1; i < winnerTeam.length; i++){
//         var row = $('#ranking td').filter(function () {
//             return $(this).text() === winnerTeam[i];
//         }).closest('tr')[0];
//         var currentWins = row.childNodes[1];
//         var currentGF = row.childNodes[3];
//         var currentGA = row.childNodes[4];
//         var currentGD = row.childNodes[5];
//         var NumOfCurrentWins = parseInt(currentWins.innerHTML);
//         var NumOfCurrentGF = parseInt(currentGF.innerHTML);
//         var NumOfCurrentGA = parseInt(currentGA.innerHTML);
//         var NumOfCurrentGD = parseInt(currentGD.innerHTML);
//         currentWins.innerHTML = (NumOfCurrentWins + 1).toString();
//         currentGF.innerHTML = (NumOfCurrentGA + winnerTeam[0]).toString();
//         currentGA.innerHTML = (NumOfCurrentGF + loserTeam[0]).toString();
//         currentGD.innerHTML = (NumOfCurrentGD + (winnerTeam[0] - loserTeam[0])).toString();
//     }
//     for (var i = 1; i < loserTeam.length; i++){
//         var row = $('#ranking td').filter(function () {
//             return $(this).text() === loserTeam[i];
//         }).closest('tr')[0];
//         var currentLoses = row.childNodes[2];
//         var currentGF = row.childNodes[3];
//         var currentGA = row.childNodes[4];
//         var currentGD = row.childNodes[5];
//         var NumOfCurrentLoses = parseInt(currentLoses.innerHTML);
//         var NumOfCurrentGF = parseInt(currentGF.innerHTML);
//         var NumOfCurrentGA = parseInt(currentGA.innerHTML);
//         var NumOfCurrentGD = parseInt(currentGD.innerHTML);
//         currentLoses.innerHTML = (NumOfCurrentLoses + 1).toString();
//         currentGF.innerHTML = (NumOfCurrentGF + loserTeam[0]).toString();
//         currentGA.innerHTML = (NumOfCurrentGA + winnerTeam[0]).toString();
//         currentGD.innerHTML = (NumOfCurrentGD - (winnerTeam[0] - loserTeam[0])).toString();
//     }
//     sortRanking();
};

$fixtures.on('submit', 'form', function (e) {
    e.preventDefault();
    submitMatchScore(e);
    // updateRanking(e);
});

$drawBtn.on('click', drawNextGame);
