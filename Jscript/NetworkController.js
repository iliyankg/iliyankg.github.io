var clientID = '247812372074-s6v0cjlf12q04cm7gbajipmfv1ee9iu8';
var apiKey = 'AIzaSyCCaQb_poHUrGjOjX34w7uZKhpuY_NZOqc';
var scope = 'https://www.googleapis.com/auth/games'; //Unused

/** Callback function; Handles what happens uppon login; Is called upon load and after pressing sign in.
*/
handleAuthResult = function(auth)
{
    //Successfull login
    if(auth && !auth.error)
    {
        console.log("LoginSuccess");
        console.log(auth);
        gapi.client.load('games', 'v1', function(response)
        {
            console.log("Games Loaded");
            console.log(gapi.client.games.turnBasedMatches);
        });
        
        gapi.client.load('plus', 'v1', function(response)
        {
            console.log("Plus loaded");
        });

        
    }
    //Bad login
    else
    {
        console.log("LoginError");
    }
}

//handleClientLoad = function()
//{
//    gapi.client.setApiKey(apiKey);
//    //window.setTimeout(checkAuth, 1);
//}

/**Gets the name of the logged in user and sets it. 
*/
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
    
    //listRooms(); - NOT WORK
    createJoinGame();
    getActiveGames();
    return "Loading...";
}

createJoinGame = function()
{
    var request = gapi.client.games.turnBasedMatches.create(
    {
        "kind" : "games#turnBasedMatchCreateRequest",
        "variant" : 1,
        "invitedPlayerIds": [
            "107373363902631863467"],
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

joinGame = function()
{
    var request = gapi.client.games.turnBasedMatches.join(
    {
        "matchId" : "ChoKCQjq7JKWmwcQAhACGAEg____________ARDCw4iF9_Xxv4gB"
    });
     
    request.execute(function(resp)
    {
        console.log(resp);
    });
}

getActiveGames = function()
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

listRooms = function()
{
    var request = gapi.client.games.rooms.list();
    
    request.execute(function(resp)
    {
        console.log(resp);
    });
}

takeTurn = function()
{
    var request = gapi.client.games.turnBasedMatches.list();
    
    request.execute(function(resp)
    {
        var newRequest = gapi.client.games.turnBasedMatches.takeTurn(
            {"matchId" : resp.items[0].matchId},
            {
                "kind": "games#turnBasedMatchTurn",
                "pendingParticipantId": "p_2",
                "matchVersion": 0,
            });
        
        newRequest.execute(function(resp)
                          {
            console.log(resp);
        });
    });
}

