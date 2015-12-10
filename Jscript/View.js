/**@fileoverview Class that handles all drawing to the canvas.
*@name View.js
*@author Gustavo Sanches
*/

var canvas = document.getElementById("Placeholder");//Reference to the canvas
var canvasContext = canvas.getContext("2d");//Reference to the context of the canvas

/** View is responsible for the visual aspects of the game and the interactivity within it.
*@constructor
*@property {Object} _rectsMenu Position and size of the buttons for the menu screen
*@property {Object} _rectsMinionsLocal Position, size and type of the minions selected for the game screen
*@property {Object} _rectsMinionsSelection Position, size and type of the minions for selection for the game screen
*@property {Object} _rectsLobby Position and size of the buttons for the lobby screen
*@property {Object} _rectsGame Position and size of the buttons for the game screen
*@property {Object} _rectsLeaderboards Position and size of the buttons for the leaderboards screen
*@property {Object} _rectsFriendsList Position, size and information of the friend of the friends list for the lobby screen
*@property {Object} _rectsGamesList Position, size and information of the game of the games list for the lobby screen
*@property {Object} _rectsLeaderboardsList Position, size and information of the stats of the players for the leaderboards screen
*@property {bool} _bHasGames If the player has any games active 
*/
function View()
{
    this._rectsMenu = [{x: canvas.width/2 - 200, y: canvas.height/2 + 100, w: 150, h: 50, t: "play", s: "Lobby"},
                      {x: canvas.width/2 - 75, y: canvas.height/2 + 200, w: 150, h: 50, t: "google", s: "Sign In"},
                      {x: canvas.width/2 + 50, y: canvas.height/2 + 100, w: 150, h: 50, t: "leaderboards", s: "Leaderboards"}];
    this._rectsMinionsLocal = [{x: canvas.width/2 - 75, y: canvas.height - 125, w: 50, h: 50, t: "firstLS", m: null},
                              {x: canvas.width/2 - 25, y: canvas.height - 125, w: 50, h: 50, t: "secondLS", m: null},
                              {x: canvas.width/2 + 25, y: canvas.height - 125, w: 50, h: 50, t: "thirdLS", m: null}];
    this._rectsMinionSelection = [{x: canvas.width/2 - 60, y: canvas.height - 165, w: 35, h: 35, t: "firstM", m: 0},
                                 {x: canvas.width/2 - 10, y: canvas.height - 165, w: 35, h: 35, t: "secondM", m: 1},
                                 {x: canvas.width/2 + 40, y: canvas.height - 165, w: 35, h: 35, t: "thirdM", m: 2}];
    this._rectsLobby = [{x: canvas.width/2 - 200, y: canvas.height/2 + 100, w: 150, h: 50, t: "create", s: "Create game"},
                       {x: 10, y: canvas.height - 60, w: 150, h: 50, t: "menu", s: "Menu"}];
    this._rectsGame = [{x: canvas.width - 150, y: 0, w: 150, h: 50, t: "lobby", c: "white"},
                      {x: canvas.width/2 - 75, y: canvas.height - 70, w: 150, h: 50, t: "send", c: "white"}];
    this._rectsLeaderboards = [{x: 10, y: canvas.height - 60, w: 150, h: 50, t: "menu", s: "Menu"}];    
    this._rectsFriendsList;
    this._rectsGamesList;
    this._rectsLeaderboardsList;
    
    this._bHasGames = false;
    
    /** Populates the rects of the friends
    *@param {lenght} Quantity of friends
    */
    this.createRectsFriends = function(lenght)
    {
        view._rectsFriendsList = new Array(lenght);
        for(var i = 0; i < lenght; i++)
        {
            this._rectsFriendsList[i] = {x: canvas.width - 200, y: 50 + i * 50, w: 150, h:50, t: "friend", f: friends[i], c: "black"};
        }
    }
    
    /** Resets of the color of the friends list name
    *@function
    */
    this.resetRectsFriendsColor = function()
    {
        for(var i = 0; i < view._rectsFriendsList.length; i++)
        {
            view._rectsFriendsList[i].c = "black";
        }
    }
    
    /** Populates the rects of the games
    *@param {int} lenght Quantity of games
    */
    this.createRectsGames = function(lenght)
    {
        this._bHasGames = false;
        if(allGames != null)
        {
            this._rectsGamesList = new Array(lenght);
            for(var i = 0; i < lenght; i++)
            {
                this._rectsGamesList[i] = {x: canvas.width - 420, y: 50 + i * 70, w: 170, h: 70, t: "games", g: allGames[i]};
                this._bHasGames = true;
            }
        }
    }
    
    /**
    *@param {int} lenght
    */
    this.createRectsLeaderboards = function(lenght)
    {
        view._rectsLeaderboardsList = new Array(lenght);
        for(var i = 0; i < lenght; i++)
        {
            var places = gameController.leaderboard[i];
            this._rectsLeaderboardsList[i] = {x: canvas.width/2 - 250, y: 50 + i * 55, w: 500, h: 50, s: places.scoreValue, f: places.formattedScoreRank, p: places.player.displayName};
        }
    }
    
    /** Draws the background
    *@function
    */
    this._drawBackground = function()
    {
        gameController.loadBackground();
        minion.loadMinions();
        if(bBackDraw)
        {
            canvasContext.drawImage(backgorundImage, 0, 0); 
        }
    }

    /** Draws the UI of the game
    *@function
    */
    this._drawUI = function()
    {
        //Player names
        canvasContext.font = "20px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "blue";
        canvasContext.fillText(playerController._left.getName(), 100, 180);
        if(playerController._left.getWins() > 0)
        {
            canvasContext.fillText("Won", 120, 200);
        }
        canvasContext.fillStyle = "red";
        canvasContext.fillText(playerController._right.getName(), canvas.width - 100, 180);
        if(playerController._right.getWins() > 0)
        {
            canvasContext.fillText("Winning", canvas.width - 120, 200);
        }
        
        //Timer
        canvasContext.fillStyle = "black";
        canvasContext.fillText(10 - gameController._iTurnNum, canvas.width/2, 400);
        
        //Minion selection
        if(gameController.iMinionSelection != -1)
        {
            for (var i = 0, len = this._rectsMinionSelection.length; i < len; i++) 
            {
                var rect = this._rectsMinionSelection[i];
                canvasContext.drawImage(minionViews[rect.m], rect.x, rect.y);
            }
        }
        
        //Win chart
        
        canvasContext.drawImage(winChartImage, 200, canvas.height - 150);
        
        //Local selection boxes
        for (var i = 0, len = this._rectsMinionsLocal.length; i < len; i++) 
        {
            var local = this._rectsMinionsLocal[i];
            canvasContext.strokeRect(local.x, local.y, local.w, local.h);
            
            if(local.m != null)
            {
                canvasContext.drawImage(minionViews[local.m], local.x + 13, local.y + 7);
            }
            else
            {
                canvasContext.drawImage(plusView, local.x + 7, local.y + 7);
            }
        }
        
        //UI
        for (var i = 0; i < view._rectsGame.length; i++)
        {
            var rect = view._rectsGame[i];
            
            canvasContext.fillStyle = "black";
            canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "center";
            canvasContext.fillStyle = rect.c;
            if(rect.t == "send" && !gameController.checkUnits() && gameController.bCanMakeTurn)
                canvasContext.fillStyle = "gray";
            canvasContext.fillText(rect.t, rect.x + 75, rect.y + 30);
        }
    }
    
    /** Draws the minions
    *@function
    */
    this._newDrawMinions = function()
    {
        for(var i = 0; i < 3; ++i)
        {
            if(leftPlatoon[i] != null)
            {
                leftPlatoon[i].loadMinions();
                canvasContext.drawImage(minionViews[leftPlatoon[i].getViewIndex()], leftPlatoon[i].getPosX(), leftPlatoon[i].getPosY()); 
            }
            
            if(rightPlatoon[i] != null)
            {
                rightPlatoon[i].loadMinions();
                canvasContext.drawImage(minionViews[rightPlatoon[i].getViewIndex()], rightPlatoon[i].getPosX(), rightPlatoon[i].getPosY());
            }
        }
    }
    
    /** Draws the menu buttons and the title of the game
    *@function
    */
    this._drawMenuScreen = function()
    {
        //Buttons
        for (var i = 0, len = this._rectsMenu.length; i < len; i++) 
        {
            var rect = this._rectsMenu[i];
            canvasContext.fillStyle = "black";
            canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "center";
            canvasContext.fillStyle = "white";
            if(!bIsLogged && rect.t == "play")
                canvasContext.fillStyle = "gray";
            canvasContext.fillText(rect.s, rect.x + 75, rect.y + 30, rect.w);
        }
        
        
        //Title
        canvasContext.font = "50px Arial";
        canvasContext.fillStyle = "blue";
        canvasContext.fillText("Minion", canvas.width/2 - 80, canvas.height/2 - 130, 150);
        canvasContext.fillStyle = "red";
        canvasContext.fillText("Wars", canvas.width/2 + 80, canvas.height/2 - 130, 150);
    }
    
    /** Draws the games list
    *@function
    */
    this._drawFriendsList = function()
    {
        canvasContext.fillStyle = "black";
        canvasContext.fillText("Friends", this._rectsFriendsList[0].x + 75, this._rectsFriendsList[0].y - 10, 150);
        for(var i = 0; i < friends.length; i++)
        {
            var rect = this._rectsFriendsList[i];
            
            canvasContext.fillStyle = "white";
            canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
            canvasContext.fillStyle = "black";
            canvasContext.strokeRect(rect.x, rect.y, rect.w, rect.h);
            
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "center";
            canvasContext.fillStyle = rect.c;
            canvasContext.fillText(friends[i].displayName, rect.x + 75, rect.y + 30, 150);
        }
    }
    
    /**
    *@function
    */
    this._drawGamesList = function()
    {
        canvasContext.fillText("Games", this._rectsGamesList[0].x + 75, this._rectsGamesList[0].y - 10, 150);
        for(var i = 0; i < allGames.length; i++)
        {
            var rect = this._rectsGamesList[i];
            if(rect.g.userMatchStatus != "USER_MATCH_COMPLETED")
            {
                canvasContext.fillStyle = "white";
                canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
                canvasContext.fillStyle = "black";
                canvasContext.strokeRect(rect.x, rect.y, rect.w, rect.h);

                canvasContext.font = "20px Arial";
                canvasContext.textAlign = "center";
                canvasContext.fillStyle = "black";
                if(localPlayer.playerId == allGames[i].participants[0].player.playerId)
                {
                    canvasContext.fillText(allGames[i].participants[1].player.displayName, rect.x + 85, rect.y + 25, 150);
                }
                else
                {
                    canvasContext.fillText(allGames[i].participants[0].player.displayName, rect.x + 85, rect.y + 25, 150);
                }
                canvasContext.fillText(allGames[i].userMatchStatus, rect.x + 85, rect.y + 55, 150);
            }
        }
    }
    
    /** Draws the lobby buttons
    *@function
    */
    this._drawLobby = function()
    {
        for(var i = 0; i < this._rectsLobby.length; i++)
        {
            var rect = this._rectsLobby[i];
            canvasContext.fillStyle = "black";
            canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "center";
            canvasContext.fillStyle = "white";
            if(gameController.playerToInvite == null && rect.t == "create")
                canvasContext.fillStyle = "gray";
            canvasContext.fillText(rect.s, rect.x + 75, rect.y + 30, rect.w);
        }
    }
    
    /** Draws the leaderboards buttons
    *@function
    */
    this._drawLeaderboards = function()
    {
        for(var i = 0; i < this._rectsLeaderboards.length; i++)
        {
            var rect = this._rectsLeaderboards[i];            
            canvasContext.fillStyle = "black";
            canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "center";
            canvasContext.fillStyle = "white";
            canvasContext.fillText(rect.s, rect.x + 75, rect.y + 30, rect.w);
        }
    }
    
    /** Draws the leaderboards items
    *@function
    */
    this._drawLeaderboardsList = function()
    {
        canvasContext.font = "20px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "black";
        canvasContext.fillText("Leaderboards", this._rectsLeaderboardsList[0].x + this._rectsLeaderboardsList[0].w/2, this._rectsLeaderboardsList[0].y - 10, 150);
        
        for(var i = 0; i < this._rectsLeaderboardsList.length; i++)
        {
            var rect = this._rectsLeaderboardsList[i];
            
            canvasContext.fillStyle = "white";
            canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
            canvasContext.fillStyle = "black";
            canvasContext.strokeRect(rect.x, rect.y, rect.w, rect.h);
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "left";
            canvasContext.fillStyle = "black";
            canvasContext.fillText(rect.f, rect.x + 10, rect.y + 30, 50);
            canvasContext.fillText("Player:  " + rect.p, rect.x + 120, rect.y + 30, 300);
            canvasContext.textAlign = "right";
            canvasContext.fillText("Score:  " + rect.s, rect.x + rect.w - 10, rect.y + 30, 50);
        }
    }
    
    /** Draws the winning message
    *@function
    */
    this._drawPlayerWin = function()
    {
        canvasContext.font = "20px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "black";
        if(gameController._checkWinner())
            canvasContext.fillText("You defeated!", canvas.width/2, canvas.height/2, 150);
        else
            canvasContext.fillText("The opponent won!", canvas.width/2, canvas.height/2, 150);
    }
    
    /** Checks for collision when the player clicks
    *@param {Object} rects Rects to check for the collision
    *@param {int} x X position of the click
    *@param {int} y Y position of the click
    */
    this._collides = function(rects, x, y)
    {
        var isCollision = false;
        for (var i = 0, len = rects.length; i < len; i++) 
        {
            var left = rects[i].x, right = rects[i].x+rects[i].w;
            var top = rects[i].y, bottom = rects[i].y+rects[i].h;
            
            if (right >= x && left <= x && bottom >= y && top <= y) 
            {
                isCollision = rects[i];
            }
        }
        return isCollision;
    }
    /** Checks for collision when the player clicks with 2 rects
    *@param {Object} rects1 Rects to check for the collision
    *@param {Object} rects2 Rects to check for the collision
    *@param {int} x X position of the click
    *@param {int} y Y position of the click
    */
    this._collides2 = function(rects1, rects2, x, y)
    {
        var isCollision = false;
        for (var i = 0, len = rects1.length; i < len; i++) 
        {
            var left = rects1[i].x, right = rects1[i].x+rects1[i].w;
            var top = rects1[i].y, bottom = rects1[i].y+rects1[i].h;
            
            if (right >= x && left <= x && bottom >= y && top <= y) 
            {
                isCollision = rects1[i];
            }
        }
        
        for (var i = 0, len = rects2.length; i < len; i++) 
        {
            var left = rects2[i].x, right = rects2[i].x+rects2[i].w;
            var top = rects2[i].y, bottom = rects2[i].y+rects2[i].h;
            
            if (right >= x && left <= x && bottom >= y && top <= y) 
            {
                isCollision = rects2[i];
            }
        }
        return isCollision;
    }
    /** Checks for collision when the player clicks with 3 rects
    *@param {Object} rects1 Rects to check for the collision
    *@param {Object} rects2 Rects to check for the collision
    *@param {Object} rects3 Rects to check for the collision
    *@param {int} x X position of the click
    *@param {int} y Y position of the click
    */
    this._collides3 = function(rects1, rects2, rects3, x, y)
    {
        var isCollision = false;
        for (var i = 0, len = rects1.length; i < len; i++) 
        {
            var left = rects1[i].x, right = rects1[i].x+rects1[i].w;
            var top = rects1[i].y, bottom = rects1[i].y+rects1[i].h;
            
            if (right >= x && left <= x && bottom >= y && top <= y) 
            {
                isCollision = rects1[i];
            }
        }
        
        for (var i = 0, len = rects2.length; i < len; i++) 
        {
            var left = rects2[i].x, right = rects2[i].x+rects2[i].w;
            var top = rects2[i].y, bottom = rects2[i].y+rects2[i].h;
            
            if (right >= x && left <= x && bottom >= y && top <= y) 
            {
                isCollision = rects2[i];
            }
        }
        
        for (var i = 0, len = rects3.length; i < len; i++) 
        {
            var left = rects3[i].x, right = rects3[i].x+rects3[i].w;
            var top = rects3[i].y, bottom = rects3[i].y+rects3[i].h;
            
            if (right >= x && left <= x && bottom >= y && top <= y) 
            {
                isCollision = rects3[i];
            }
        }
        return isCollision;
    }
    
    /** Update fuction called every frame to draw on screen
    *@function
    */
    this.update = function()
    {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        
        if(gameController.gameState == "menu")
        {
            view._drawBackground();
            view._drawMenuScreen();
        }
        else if(gameController.gameState == "lobby")
        {
            view._drawBackground();
            view._drawFriendsList();
            if(view._bHasGames)
                view._drawGamesList();
            view._drawLobby();
        }
        else if(gameController.gameState == "game")
        {
            view._drawBackground();
            if(gameController.bShowTurn)
                view._newDrawMinions();
            if(gameController._checkWinner() != null)
                view._drawPlayerWin();
            view._drawUI();
        }
        else if(gameController.gameState == "leaderboards")
        {
            view._drawBackground();
            view._drawLeaderboards();
            if(gameController.leaderboard != null)
            {
                view.createRectsLeaderboards(gameController.leaderboard.length);
                view._drawLeaderboardsList();
            }
        }
        
        requestAnimationFrame(view.update);
    }
}


