//PUBLIC
var battlefield = new Array(20);//Array to be filled with minions; Can change the size;
var playerController = new PlayerController();//Instance of the PlayerController
var view = new View();
var gameController = new GameController();
var minion = new Minion();
var backgorundImage;
var bBackDraw = false;
var localPlayer = null;

var leftPlatoon = new Array(3);
var rightPlatoon = new Array(3);
var platoonLength = 3;
var bIsLogged = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("click", click, false);
view.update();



function GameController() 
//Public
{
    this.gameState = "menu";
    this.iMinionSelection = -1;
    this.playerToInvite = null;
    this.activeMatch = null;
    this.bCanMakeTurn = false;
    this.bShowTurn = false;
    
    //PRIVATE
    this._iSpawnNum;//Number of spawns so far
    this._iTurnNum = 1;//Number of turns so far
    this._iBlueFirst = 0;
    this._fLobbyTimer = 0;
    this._timerCounter = null;
    
    this.loadBackground = function()
    {
        backgorundImage = new Image();
        backgorundImage.onload = function() 
        {
                bBackDraw = true;
        };
        backgorundImage.src = "Assets/Background.png";
    }
    
    /** Facilitates the combat between the frontmost minions.
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
    
    /** Checks for winners and reset the win counter if necessary
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
    
    /** Runs through the battlefield array for minions and makes them advance or battle
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
    
    /**Spawns the minions according to the new combat system.
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
    this._timer_RefreshList = function()
    {        
        listActiveGames();
    }
    this._timer_Timeout = function(timer)
    {
        clearInterval(timer);
    }
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
    
    this.populateMatch = function()
    {
        playerController._left.createPlayer(10, 10, localPlayer.displayName, 0);
        for(var i = 0; i < 2; i++)
        {
            var player = gameController.activeMatch.participants[i].player;
            if(player.playerId != localPlayer.playerId)
            {
                playerController._right.createPlayer(10, 10, player.displayName, 1);
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
            //fill with information that the player can see but not interact
        }
    }
    
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
    
    this.executeTurn = function()
    {
        if(gameController.activeMatch.participants[1].player.playerId == localPlayer.playerId)//If it is the second player, put the minion choices in the leftPlatoon
        {
            for(var i = 0; i < platoonLength; i++)
            {
                leftPlatoon[i] = minion.createMinion(view._rectsMinionsLocal[2-i].m, true, 170 - i * 35, canvas.height/2 + 100);
            }
        }
        gameController._newBattle();
        gameController.bShowTurn = true;
        gameController._timerCounter = setInterval(this._timer_ChangeTime, 1000);
        if(gameController.activeMatch.participants[0].player.playerId == localPlayer.playerId)//If it is the first player, check for the win
        {
            var bWon = gameController._checkWinner();
            if(bWon != null)
            {
                finishCreatorsGame(gameController.activeMatch.matchId);
            }
        }
    }
    
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
}

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
        }
    }
}


        

        
        
            
        
    

 