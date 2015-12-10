//PUBLIC
var playerController = new PlayerController();//Instance of the PlayerController
var view = new View();//Instance of the View
var gameController = new GameController();//Instance of the GameController
var minion = new Minion();//Instance of the Minion
var backgorundImage;//Background image
var winChartImage;//Types chart image
var bBackDraw = false;//If the game can draw the background
var localPlayer = null;//Local players data

var leftPlatoon = new Array(3);//Local players's platoon
var rightPlatoon = new Array(3);//Remote players's platoon
var platoonLength = 3;//Size of the platoons
var bIsLogged = false;//If the player is logged on his Google account

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("click", click, false);
view.update();



function GameController() 
//Public
{
    this.gameState = "menu";//Current state of the game
    this.iMinionSelection = -1;//Which minion box is selected
    this.playerToInvite = null;//Player to invite to a game
    this.activeMatch = null;//Current match
    this.bCanMakeTurn = false;//If the player can send his choice
    this.bShowTurn = false;//If the game can show his minions choice
    this.leaderboard = null;//The leaderboard
    
    //PRIVATE
    this._iTurnNum = 1;//Number of turns so far
    this._fLobbyTimer = 0;
    this._timerCounter = null;
    
    /** Loads the background image and the types chart 
    *@function
    */
    this.loadBackground = function()
    {
        backgorundImage = new Image();
        backgorundImage.onload = function() 
        {
                bBackDraw = true;
        };
        backgorundImage.src = "Assets/Background.png";
        
        winChartImage = new Image();
        winChartImage.src = "Assets/Win_Loss.png";
        
    }
    
    /** Makes the minions deal each other damage, killing the opponent if his type has an advantage.
    *@function
    */
    this._newBattle = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            leftPlatoon[i].damage(rightPlatoon[i].getType());
            rightPlatoon[i].damage(leftPlatoon[i].getType());
        }
    }
    
    /** Checks the minions to see which player won the round
    *@function
    */
    this.countWinners = function()
    {
        //Check how many minions each side has left
        var leftMinions = 0;//Number of minions on the left side that survived
        var rightMinions = 0;//Number of minions on the right side that survived
        
        for(var i = 0; i < platoonLength; i++)
        {
            if(!leftPlatoon[i].isDead())
            {
                leftMinions++;
            }

            if(!rightPlatoon[i].isDead())
            {
                rightMinions++;
            } 
        }
        
        if(leftMinions > rightMinions)
        {
            playerController._left.won();
        }
        else if(rightMinions > leftMinions)
        {
            playerController._right.won();
        }
    }
    
    /** Checks for winners of the game and reset the win counter if necessary. Returns true if the local player won and false if the remote player won.
    *@function
    */
    this._checkWinner = function()
    {
        if(playerController._left.getWins() == 2)
        {
            //Local player wins
            console.log("Local player won");
            return true;
        }
        else if(playerController._right.getWins() == 2)
        {
            //Remote player wins
            console.log("Remote player won");
            return false;
        }
        
        if(playerController._left.getWins() == playerController._right.getWins())
        {
            playerController._left.resetWins();
            playerController._right.resetWins();
        }
        return null;
    }
    
    this._clearDeadMinions = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            if(leftPlatoon[i].isDead())
            {
                leftPlatoon[i] = null;
            }
            
            if(rightPlatoon[i].isDead())
            {
                rightPlatoon[i] = null;
            }
        }
    }
    
    /** Used in the new combat model system to send the minions to battle.
    *@function
    */
    this._newAdvance = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            leftPlatoon[i].setPosX(leftPlatoon[i].getPosX() + 60);
            rightPlatoon[i].setPosX(rightPlatoon[i].getPosX() - 60);
        }
    }
    
    /** Used in the new combat model system to return the minions once the battle has finished.
    *@function
    */
    this._newRetreat = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            if(leftPlatoon[i] != null)
            {
                leftPlatoon[i].setPosX(leftPlatoon[i].getPosX() - 60);
            }
            
            if(rightPlatoon[i] != null)
            {
                rightPlatoon[i].setPosX(rightPlatoon[i].getPosX() + 60);
            }
        }
    }
    
    /**Spawns the minions randomly according to the new combat system.
    *@function
    */
    this._newSpawn = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            if(view._rectsMinionsLocal[i].m == null)
            {
                leftPlatoon[i] = new Minion();
                var iMinionType = (Math.floor((Math.random() * (2 - 0 + 1)) + 0));
                leftPlatoon[i].createMinion(iMinionType, true,170 - i * 35, 240);
                view._rectsMinionsLocal[i].m = iMinionType;
            }
            else
            {
                leftPlatoon[i] = new Minion();
                leftPlatoon[i].createMinion(view._rectsMinionsLocal[i].m, true,170 - i * 35, 240);
            }
        }
        for(var i = 0; i < platoonLength; i++)
        {
            rightPlatoon[i] = new Minion();  
            var iMinionType = (Math.floor((Math.random() * (2 - 0 + 1)) + 0));
            rightPlatoon[i].createMinion(iMinionType, false, canvasContext.canvas.width - 205 + i * 35, 240);
            view._rectsMinionsRemote[i].m = iMinionType + 3;
        }
    }
    
    /** Timer function for the game animation.
    *@function
    */
    this._timer_ChangeTime = function()
    {        
        if(gameController._iTurnNum == 9)
        {
            gameController._timer_Timeout(gameController._timerCounter);
        }
        
        if(gameController._iTurnNum == 0)
        {
            
            //gameController._timer();
            //gameController._newSpawn();    
        }
        else if(gameController._iTurnNum == 5)
        {
            //gameController._newBattle();
            //remove dead units
            gameController._clearDeadMinions();
        }
        else if(gameController._iTurnNum > 5)
        {
            gameController._newRetreat();
        }
        else
        {
            gameController._newAdvance();
        }
        
        gameController._iTurnNum++;
    }
    /** Timer function for refreshing the games list.
    *@function
    */
    this._timer_RefreshList = function()
    {        
        listActiveGames();
    }
    /** Cancels a timer
    *@function
    */
    this._timer_Timeout = function(timer)
    {
        clearInterval(timer);
    }
    /** Starts a timer given a variable to be stored and an interval.
    *@function
    */
    this._timer = function(timer, interval)
    {
        timer = setInterval(this._timer_RefreshList, interval);
    }
    
    this._firstTurn = function()
    {
        if(gameController._iTurnNum == 10)
        {
            gameController._iTurnNum = 0;
            gameController._newSpawn();
            clearInterval(gameController._fFirstTimer);
            gameController._timer();
        }
        gameController._iTurnNum++;
    }
    
    this.startGame = function()
    {
        minion.loadMinions();
        gameController._timer_Timeout(gameController._fLobbyTimer);
        this.gameState = "game";
        for(i = 0; i < platoonLength; i++)
        {
            leftPlatoon[i] = null;
            rightPlatoon[i] = null; 
        }
        playerController._left = new Player();
        playerController._left.createPlayer(10,10,"Local_Player", 0);
        playerController._right = new Player();
        playerController._right.createPlayer(10,10,"Remote_Player", 1);
        
        //gameController._timer();
        //gameController._fFirstTimer = setInterval(this._firstTurn, 1000);
        
    }
    
    this._joinGame = function(game)
    {
        if(game.userMatchStatus == "USER_TURN")
        {
            this.startGame();
        }
        else
        {
            //get the player platoon choice and show on screen
        }
    }
    
    /** Populate all the match variables based on the data received from the other player.
    *@function
    */
    this.populateMatch = function()
    {
        playerController._left.createPlayer(10, 10, localPlayer.displayName, 0);//Print the local players's name
        for(var i = 0; i < 2; i++)
        {
            var player = gameController.activeMatch.participants[i].player;
            if(player.playerId != localPlayer.playerId)
            {
                playerController._right.createPlayer(10, 10, player.displayName, 1);//Print the remote players's name
            }
        }
        console.log(this.activeMatch.userMatchStatus);
        
        if(this.activeMatch.userMatchStatus != "USER_AWAITING_TURN")//player can make a turn
        {
            if(gameController.activeMatch.matchVersion != 1)//not first turn
            {
                var sData = atob(gameController.activeMatch.data.data).split("_");
                
                if(gameController.activeMatch.participants[0].player.playerId == localPlayer.playerId)//which player is making the turn (this is player 1)
                {
                    console.log("your move");
                    
                    for(var i = 0; i < platoonLength; i++)//populate the enemy minions
                    {
                        var char = sData[1].charAt(2-i);
                        rightPlatoon[i] = minion.createMinion(parseInt(char), false, canvasContext.canvas.width - 205 + i * 35, canvas.height/2 + 100);
                        
                        var char = sData[0].charAt(2-i);
                        leftPlatoon[i] = minion.createMinion(parseInt(char), true, 170 - i * 35, canvas.height/2 + 100);
                    }
                    
                    //populate the wins of each player
                    var char = sData[2].charAt(0);
                    playerController._left._iWins = parseInt(char);
                    
                    char = sData[2].charAt(1);
                    playerController._right._iWins = parseInt(char);
                    this.executeTurn();
                }
                else//this is player 2
                {
                    for(var i = 0; i < platoonLength; i++)//populate the enemy minions
                    {
                        var char = sData[0].charAt(2-i);
                        rightPlatoon[i] = minion.createMinion(parseInt(char), false, canvasContext.canvas.width - 205 + i * 35, canvas.height/2 + 100);
                    }
                    
                    //populate the wins of each player
                    var char = sData[2].charAt(0);
                    playerController._right._iWins = parseInt(char);
                    
                    char = sData[2].charAt(1);
                    playerController._left._iWins = parseInt(char);
                }
            }
        }
        else
        {
            gameController.showYourUnits();
        }
    }
    
    /** Resets the state of the game to be able to show other games.
    *@function
    */
    this.resetGameState = function()
    {
        gameController.iMinionSelection = -1;
        for(var i = 0; i < 3; i++)
        {
            view._rectsMinionsLocal[i].m = null;
        }
        playerController._left.setName(null);
        playerController._right.setName(null);
        this._iTurnNum = 1;
        this.bShowTurn = false;
        gameController._timer(gameController._fLobbyTimer, 10000);
    }
    
    /** Checks if the player made all the choices for the minions. Returns true if all units are selectes.
    *@function
    */
    this.checkUnits = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            if(view._rectsMinionsLocal[i].m == null)
            {
                return false;
            }
        }
        return true;
    }
    
    /** Populates the local players's platoon and makes the minions battle each other, storing if the unit died or not.
    *@function
    */
    this.executeTurn = function()
    {
        if(gameController.activeMatch.participants[1].player.playerId == localPlayer.playerId)//If it is the second player, put the minion choices in the leftPlatoon.
        {
            for(var i = 0; i < platoonLength; i++)
            {
                leftPlatoon[i] = minion.createMinion(view._rectsMinionsLocal[2-i].m, true, 170 - i * 35, canvas.height/2 + 100);
            }
        }
        gameController._newBattle();
        gameController.bShowTurn = true;
        //gameController._timerCounter = setInterval(this._timer_ChangeTime, 1000);
        gameController._timer(gameController._timerCounter, 1000);
        if(gameController.activeMatch.participants[0].player.playerId == localPlayer.playerId)//If it is the first player, check for the win
        {
            var bWon = gameController._checkWinner();
            if(bWon != null)
            {
                finishCreatorsGame(gameController.activeMatch.matchId);
            }
        }
    }
    
    /** Populates the platoon variables to show them on screen later.
    *@function
    */
    this.showYourUnits = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            leftPlatoon[2-i] = minion.createMinion(view._rectsMinionsLocal[2-i].m, true, 170 - i * 35, canvas.height/2 + 100);
            rightPlatoon[i] = null;
        }
        gameController._iTurnNum = 1;
        gameController._timer_Timeout(gameController._timerCounter);
        gameController.bShowTurn = true;
    }
    
    /** Changes the state of the game to lobby, resets all variables related to matchmaking, starts the timer to refresh the games list, loads the minions assets and makes the call to get the games list that a player has.
    *@function
    */
    this.goToLobby = function()
    {
        this.resetGameState();
        this.gameState = "lobby";
        this.activeMatch = null;
        this.playerToInvite = null;
        this._timer_Timeout(this._timerCounter);
        view.resetRectsFriendsColor();
        listActiveGames();
        minion.loadMinions();
    }
    
    /** Changes the state of the game to menu.
    *@function
    */
    this.goToMenu = function()
    {
        this.gameState = "menu";
    }
    
    /** Changes the state of the game to leaderboard and makes the call to update it.
    *@function
    */
    this.goToLeaderboards = function()
    {
        fetchLeaderBoard();
        this.gameState = "leaderboards";
    }
}

/** Key events for debugging purposes.
*@function
*/
function keyDownHandler(e)
{
    if(e.keyCode == 39)//right arrow
    {
        initiateData();
    }
    
    if(e.keyCode == 37)//left arrow
    {
        cancelGame(0);
    }
    
    if(e.keyCode == 38)//up arrow
    {
        //takeTurn(0);
        fetchLeaderBoard(0);
    }
    if(e.keyCode == 40) //down arrow
    {
        //joinGame(0);
        listActiveGames();
    }
    if(e.keyCode == 32) //spacebar
    {
        getGame(gameController.activeMatch.matchId);
    }
}


/** Checks all the clicks on screen and interactions.
*@fuction
*/
function click(e)
{
    if(gameController.gameState == "menu")
    {
        console.log('click: ' + e.offsetX + '/' + e.offsetY);
        var rect = view._collides(view._rectsMenu, e.offsetX, e.offsetY);
        if (rect) 
        {
            if(rect.t == "play" && bIsLogged)
            {
                gameController.goToLobby();
            }
            else if(rect.t == "google")
            {
               gapi.auth.signIn();
            }
            else if(rect.t == "leaderboards")
            {
                gameController.goToLeaderboards();
            }
            console.log('collision: ' + rect.x + '/' + rect.y);
        }
    }
    else if(gameController.gameState == "lobby")
    {
        console.log('click: ' + e.offsetX + '/' + e.offsetY);
        var rect = view._collides3(view._rectsFriendsList, view._rectsLobby, view._rectsGamesList, e.offsetX, e.offsetY);
        if (rect) 
        {
            if(rect.t == "create" && gameController.playerToInvite != null)
            {
                gameController.bCanMakeTurn = true;
                createJoinGame();
                console.log("Player ID: " + gameController.playerToInvite);
                gameController.gameState = "game";
                //gameController.startGame();
            }
            else if(rect.t == "menu")
            {
                gameController.goToMenu();
            }
            else if(rect.t == "friend")
            {
                console.log(rect.f.displayName);
                console.log(rect.f.id);
                view.resetRectsFriendsColor();
                rect.c = "green";
                gameController.playerToInvite = rect.f.id;
            }
            else if(rect.t == "games")
            {
                console.log(rect.g);
                if(rect.g.userMatchStatus == "USER_INVITED")
                {
                    gameController.bCanMakeTurn = true;
                    joinGame(rect.g.matchId);
                    gameController.gameState = "game";
                }
                else if(rect.g.userMatchStatus == "USER_AWAITING_TURN")
                {
                    gameController.bCanMakeTurn = false;
                    getGame(rect.g.matchId);
                    gameController.gameState = "game";
                }
                else if(rect.g.userMatchStatus == "USER_TURN")
                {
                    gameController.bCanMakeTurn = true;
                    getGame(rect.g.matchId);
                    gameController.gameState = "game";
                    view._rectsGame[1].c = "white";
                }
            }
            console.log('collision: ' + rect.x + '/' + rect.y + ' type: ' + rect.t);
        }
    }
    else if(gameController.gameState == "game")
    {
        console.log('click: ' + e.offsetX + '/' + e.offsetY);
        var rectM = view._collides(view._rectsMinionSelection, e.offsetX, e.offsetY);
        var rectL = view._collides(view._rectsMinionsLocal, e.offsetX, e.offsetY);
        var rect = view._collides(view._rectsGame, e.offsetX, e.offsetY);
        
        if(rectM && gameController.iMinionSelection != -1)
        {
            if(rectM.t == "firstM")
            {
                view._rectsMinionsLocal[gameController.iMinionSelection].m = 0;
            }
            else if(rectM.t == "secondM")
            {
                view._rectsMinionsLocal[gameController.iMinionSelection].m = 1;
            }
            else if(rectM.t == "thirdM")
            {
                view._rectsMinionsLocal[gameController.iMinionSelection].m = 2;
            }
            gameController.iMinionSelection = -1;
        }
        else if(rectL && gameController.bCanMakeTurn)
        {
            if(rectL.t == "firstLS")
            {
                gameController.iMinionSelection = 0;
                view._rectsMinionsLocal[gameController.iMinionSelection].m = null;
            }
            else if(rectL.t == "secondLS")
            {   
                gameController.iMinionSelection = 1;
                view._rectsMinionsLocal[gameController.iMinionSelection].m = null;
            }
            else if(rectL.t == "thirdLS")
            {
                gameController.iMinionSelection = 2;
                view._rectsMinionsLocal[gameController.iMinionSelection].m = null;
            }
        }
        else if(rect)
        {
            if(rect.t == "lobby")
            {
                gameController.goToLobby();
                //Do something to "cancel" the game
            }
            else if(rect.t == "send" && playerController._left.getName() != null && gameController.checkUnits() && gameController.bCanMakeTurn)
            {
                rect.c = "blue";
                var chosenTurn = view._rectsMinionsLocal[0].m.toString() + view._rectsMinionsLocal[1].m.toString() + view._rectsMinionsLocal[2].m.toString();
                if(gameController.activeMatch.participants[1].player.playerId == localPlayer.playerId)//If player 2
                {
                    gameController.executeTurn();
                    gameController.countWinners();
                    var bWon = gameController._checkWinner();
                    if(bWon != null)
                    {
                        finishGame(gameController.activeMatch.matchId, bWon, chosenTurn, playerController._right.getWins(), playerController._left.getWins());
                    }
                    else
                    {
                        takeTurn(chosenTurn, playerController._right.getWins(), playerController._left.getWins());
                    }
                }
                else
                {
                    gameController.showYourUnits();
                    takeTurn(chosenTurn, playerController._left.getWins(), playerController._right.getWins());
                }
            }
            else if(rect.t == "refresh")
            {
                gameController.bCanMakeTurn = false;
                getGame(rect.g.matchId);
            }
        }
    }
    else if(gameController.gameState == "leaderboards")
    {
        var rect = view._collides(view._rectsLeaderboards, e.offsetX, e.offsetY);
        if(rect)
        {
            if(rect.t == "menu")
            {
                gameController.goToMenu();
            }
        }
    }
}


        

        
        
            
        
    

 