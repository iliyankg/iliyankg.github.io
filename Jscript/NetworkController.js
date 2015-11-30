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
                friends = resp;
                console.log(friends);
                view.createRectsFriends(resp.length);
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