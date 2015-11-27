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
        });

        console.log(gapi.client.games.turnBasedMatches);
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
    var _toReturn;
    
    //Load Google.Plus
    gapi.client.load('plus', 'v1', function(response)
    {
        //Compile a JSON request to the Google+ api
        var request = gapi.client.plus.people.get(
        {
            'userId' : 'me'                
        });
        
        //Execute the request
        request.execute(function(resp)
        {
            playerController._left.setName(resp.displayName);
        })
    });
    return "Loading...";
}

createJoinGame = function()
{
    gapi.client.load('games', 'v1', function(response)
    {
        var request = gapi.client.games.turnBasedMatches;
    });
}




