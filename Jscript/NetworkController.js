var clientID = '247812372074-s6v0cjlf12q04cm7gbajipmfv1ee9iu8';
var apiKey = 'AIzaSyCCaQb_poHUrGjOjX34w7uZKhpuY_NZOqc';
var friends;

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
                console.log(resp);
                friends = resp.items;
                view.createRectsFriends(resp.totalItems);
           });
        });
        bIsLogged = true;
    }
    //Bad login
    else
    {
        console.log("LoginFailed");
        bIsLogged = false;
    }
}

getLocalPlayerName = function()
{    
    var request = gapi.client.games.players.get(
    {
            "playerId" : "me"
    });
    
    request.execute(function(resp)
    {
        console.log("PLAYER_MAYBE");
        playerController._left.setName(resp.displayName);
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
        console.log(resp);
    });
}

listActiveGames = function()
{
    var request = gapi.client.games.turnBasedMatches.list();
    
    request.execute(function(resp)
    {
        console.log(resp);
    });
}

cancelGame = function(index)
{
    var request = gapi.client.games.turnBasedMatches.list();
    
    request.execute(function(resp)
    {
        var newRequest = gapi.client.games.turnBasedMatches.cancel(
        {
            "matchId" : resp.items[0].matchId
        });
        
        newRequest.execute(function(respp)
        {
            console.log("game deleted");                           
        });
    });
}

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

takeTurn = function(index)
{
    var request = gapi.client.games.turnBasedMatches.list();
    
    request.execute(function(resp)
    {
        var nextPlayer = "p_2";
        
        if(resp.items[index].pendingParticipantId == "p_2")
            nextPlayer = "p_1"
            
        var newRequest = gapi.client.games.turnBasedMatches.takeTurn(
            {"matchId" : resp.items[index].matchId},
            {
                "kind": "games#turnBasedMatchTurn",
                "data": 
                {
                        "kind": "games#turnBasedMatchDataRequest",
                        "data": btoa("111")
                },
                "pendingParticipantId": nextPlayer,
                "matchVersion": resp.items[index].matchVersion
            });
        
        newRequest.execute(function(respp)
                          {
            console.log(respp);
        });
    });
}

joinGame = function(index)
{
    var request = gapi.client.games.turnBasedMatches.list();
    
    request.execute(function(resp)
    {
        var newRequest = gapi.client.games.turnBasedMatches.join(
        {
            "matchId" : resp.items[index].matchId
        });
    });
}

declineGame = function(index)
{
    var request = gapi.client.games.turnBasedMatches.list();
    
    request.execute(function(resp)
    {
        var newRequest = gapi.client.games.turnBasedMatches.decline(
        {
            "matchId" : resp.items[indexd].matchId
        });
    });
}