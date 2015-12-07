var clientID = '247812372074-s6v0cjlf12q04cm7gbajipmfv1ee9iu8';
var apiKey = 'AIzaSyCCaQb_poHUrGjOjX34w7uZKhpuY_NZOqc';
var friends;

var allGames = new Array();

handleAuthResult = function(auth)
{
    //Successfull login
    if(auth && !auth.error)
    {
        console.log("LoginSuccess");
        gapi.client.load('games', 'v1', function(response)
        {

        });
        
        gapi.client.load('plus', 'v1', function(response)
        {
            var request = gapi.client.plus.people.list(
            {
                "userId" : "me",
                "collection" : "visible"
            });
            
            request.execute(function(resp)
            {
                bIsLogged = true;
                console.log(resp);
                friends = resp.items;
                view.createRectsFriends(resp.totalItems);
                
                getLocalPlayer();
           });
        });
    }
    //Bad login
    else
    {
        console.log("LoginFailed");
        bIsLogged = false;
    }
}

getLocalPlayer = function()
{    
    var request = gapi.client.games.players.get(
    {
            "playerId" : "me"
    });
    
    request.execute(function(resp)
    {
        localPlayer = resp;
    });
    
    return "Loading...";
}

createJoinGame = function()
{
    var request = gapi.client.games.turnBasedMatches.create(
    {
        "kind" : "games#turnBasedMatchCreateRequest",
        "variant" : 0,
        "invitedPlayerIds": [
            gameController.playerToInvite],
        "autoMatchingCriteria" :
        {
            "kind" : "games#turnBasedAutoMatchingCriteria",
            "minAutoMatchingPlayers" : 1,
            "maxAutoMatchingPlayers" : 2,
            //"exclusiveBitmask" : 0
        },
        "requestId" : Math.floor(Math.random() * 1000000000)
    });
     
    request.execute(function(resp)
    {
        gameController.activeMatch = resp;
        gameController.populateMatch();
        console.log(resp);
    });
}

listActiveGames = function()
{
    var request = gapi.client.games.turnBasedMatches.list(
    {
        "maxCompletedMatches" : 0
    });
    
    request.execute(function(resp)
    {
        allGames = resp.items;
        view.createRectsGames(resp.items.length);
    });
}

cancelGame = function(index)
{

    var newRequest = gapi.client.games.turnBasedMatches.cancel(
    {
        "matchId" : allGames[index].matchId
    });
        
    newRequest.execute(function(respp)
    {
        console.log("game deleted");                          
    });
}

//Questionable if necessary
initiateData = function()
{
    var request = gapi.client.games.turnBasedMatches.list();
    
    request.execute(function(resp)
    {
        var newRequest = gapi.client.games.turnBasedMatches.takeTurn(
            {"matchId" : resp.items[0].matchId},
            {
                "kind": "games#turnBasedMatchTurn",
                "data": 
                {
                        "kind": "games#turnBasedMatchDataRequest",
                        "data": btoa("111")
                },
                "pendingParticipantId": "p_1",
                "matchVersion": 1,
            });
        
        newRequest.execute(function(resp)
                          {
            console.log(resp);
        });
    });
}

takeTurn = function(data, creatorWon, creatorLost)
{
    var nextPlayer = null;
    var dataToSend = "error"
    
//    if(gameController.activeMatch.matchVersion == 1)
//    {
//        creatorLost = 0;
//        creatorWon = 0;
//    }
    
    if(gameController.activeMatch.pendingParticipantId == "p_2")
    {
        nextPlayer = "p_1";
        var tempData = atob(gameController.activeMatch.data.data);
        var splitTempData = tempData.split("_");
        
        
        dataToSend = splitTempData[0] + "_" + data + "_" + creatorWon.toString() + creatorLost.toString();  
    }
    else
    {
        nextPlayer = "p_2"
        if(gameController.activeMatch.matchVersion == 1)
        {
            dataToSend = data + "_" + "xxx" + "_" + "00";
        }
        else
        {
            dataToSend = data + "_" + "xxx" + "_" + creatorWon.toString() + creatorLost.toString();
        }
    }
    console.log(dataToSend);
            
    var request = gapi.client.games.turnBasedMatches.takeTurn(
    {"matchId" : gameController.activeMatch.matchId},
    {
        "kind": "games#turnBasedMatchTurn",
        "data": 
        {
                "kind": "games#turnBasedMatchDataRequest",
                "data": btoa(dataToSend)
        },
        "pendingParticipantId": nextPlayer,
        "matchVersion": gameController.activeMatch.matchVersion
    });
        
    request.execute(function(respp)
                          {
        console.log(respp);
    });
}

joinGame = function(_matchId)
{
    var request = gapi.client.games.turnBasedMatches.join(
    {
        "matchId" : _matchId
    });
    
    request.execute(function(respp)
    {
        getGame(_matchId);
    });
}

declineGame = function(index)
{
    var request = gapi.client.games.turnBasedMatches.decline(
    {
        "matchId" : allGames[indexd].matchId
    });
    
    request.execute(function(respp)
    {
        console.log(respp);
    });
}

getGame = function(_matchId)
{   
    var request = gapi.client.games.turnBasedMatches.get
    (
        {"matchId" : _matchId,
        "includeMatchData" : true}
    );
    
    request.execute(function(respp)
    {
        gameController.activeMatch = respp;
        gameController.populateMatch();
    });
}

dismissGame = function(index)
{
    var request = gapi.client.games.turnBasedMatches.dismiss({"matchId" : allGames[index].matchId});
    
    request.execute(function(respp)
    {
       console.log("GameDismissed"); 
    });
}

finishGame = function(_matchId, bWon, data, creatorWon, creatorLost)
{
    var sResult1 = "MATCH_RESULT_LOSS";
    var sResult2 = "MATCH_RESULT_WIN";
    var iPlacing1 = 2;
    var iPlacing2 = 1;
    if(bWon)
    {
        sResult1 = "MATCH_RESULT_WIN";
        sResult2 = "MATCH_RESULT_LOSS";
        iPlacing1 = 1;
        iPlacing2 = 2
    }
    
    var dataToSend = "error"
    
    if(gameController.activeMatch.pendingParticipantId == "p_2")
    {
        var tempData = atob(gameController.activeMatch.data.data);
        var splitTempData = tempData.split("_");
        
        
        dataToSend = splitTempData[0] + "_" + data + "_" + creatorWon.toString() + creatorLost.toString();  
    }
    else
    {
        if(gameController.activeMatch.matchVersion == 1)
        {
            dataToSend = data + "_" + "xxx" + "_" + "00";
        }
        else
        {
            dataToSend = data + "_" + "xxx" + "_" + creatorWon.toString() + creatorLost.toString();
        }
    }
    
    
    var request = gapi.client.games.turnBasedMatches.finish(
    {"matchId": _matchId},
    {
        "kind": "games#turnBasedMatchResults",
        "results": [
        {
          "kind": "games#participantResult",
          "participantId": gameController.activeMatch.pendingParticipantId,
          "result": sResult1,
          "placing": iPlacing1
        },
        {
          "kind": "games#participantResult",
          "participantId": gameController.activeMatch.withParticipantId,
          "result": sResult2,
          "placing": iPlacing2
        }],
        "data": {
        "kind": "games#turnBasedMatchDataRequest",
        "data": btoa(dataToSend)
        },
        "matchVersion": gameController.activeMatch.matchVersion
    });
    
    request.execute(function(respp)
    {
       console.log(respp); 
    });
}

finishCreatorsGame = function(_matchId)
{
    var request = gapi.client.games.turnBasedMatches.finish(
    {"matchId": _matchId
    });
    
    request.execute(function(respp)
    {
       console.log(respp); 
    });
}

submitScore = function(scr)
{
	var request = gapi.client.games.scores.submit(
	{
		"leaderboardId" : "CgkI6uySlpsHEAIQAw",
		"timeSpan" : "ALL_TIME",
		"score" : score
	});
	
	request.execute(function(resp)
	{
		console.log(resp);
	});
}

fetchLeaderBoard = function(id)
{
	var request = gapi.client.games.scores.listWindow({
		"leaderboardId" : "CgkI6uySlpsHEAIQAw",
		"collection" : "PUBLIC",
		"timeSpan" : "ALL_TIME"
	});
	
	request.execute(function(resp)
	{
		console.log(resp);
	});
}
