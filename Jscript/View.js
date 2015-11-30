/** View is responsible for the visual aspects of the game and the interactivity within it.
*@constructor
*@property {Draw} _Minion
*@property {Draw} _UI
*@property {Draw} _Background
*/

var canvas = document.getElementById("Placeholder");
var canvasContext = canvas.getContext("2d");

function View()
{
    this._rectsMenu = [{x: canvas.width/2 - 200, y: canvas.height/2 + 100, w: 150, h: 50, t: "play"},//Play game
                   {x: canvas.width/2 + 50, y: canvas.height/2 + 100, w: 150, h: 50, t: "google"}];//Google play
    this._rectsMinionsLocal = [{x: 200, y: canvas.height - 200, w: 50, h: 50, t: "firstLS", m: null},
                              {x: 150, y: canvas.height - 200, w: 50, h: 50, t: "secondLS", m: null},
                              {x: 100, y: canvas.height - 200, w: 50, h: 50, t: "thirdLS", m: null}];
    this._rectsMinionsRemote = [{x: canvas.width - 200, y: canvas.height - 200, w: 50, h: 50, t: "firstRS", m: null},
                               {x: canvas.width - 150, y: canvas.height - 200, w: 50, h: 50, t: "secondRS", m: null},
                               {x: canvas.width - 100, y: canvas.height - 200, w: 50, h: 50, t: "thirdRS", m: null}];
    this._rectsMinionSelection = [{x: canvas.width/2 - 55, y: canvas.height - 100, w: 35, h: 35, t: "firstM", m: 0},
                                 {x: canvas.width/2 - 17, y: canvas.height - 100, w: 35, h: 35, t: "secondM", m: 1},
                                 {x: canvas.width/2 + 20, y: canvas.height - 100, w: 35, h: 35, t: "thirdM", m: 2}];
    this._rectsFriendsList;
    
    this.createRectsFriends = function(lenght)
    {
        this._rectsFriendsList = new Array(lenght);
        for(var i = 0; i < lenght; i++)
        {
            this._rectsFriendsList[i] = {x: canvas.width - 100, y: 50 + i * 50, w: 100, h:50, t: "friend" + i, f: friends[i]};
        }
    }
    
    this._Minion =  function()
    {
        //Sprites are drawn for the left and right side.
        this._drawMinion;
        this._leftMinionSprite1;
        this._leftMinionSprite2;
        this._leftMinionSprite3;
        this._rightMinionSprite1;
        this._rightMinionSprite2;
        this._rightMinionSprite3;
    }
    
    this._UI = function()
    {
        //UI is drawn
        this._drawUI;
        // a button is pressed which will send the data, retrun and record the choice made by the player.
        this._buttonPress; 
        {
            this._sendChoice;
            this._returnChoice;
            this._reccordPlayerChoice;
            this._resolvePlayers;
            this._getLeftChoice;
            this._getRightChoice;
        }
    }
    
    //Background of a match is drawn   
    this._drawBackground = function()
    {
        
    }

    this._drawUI = function()
    {
        //Player names
        canvasContext.font = "20px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "blue";
        canvasContext.fillText(playerController._left.getName(), 100, 180);
        canvasContext.fillStyle = "red";
        canvasContext.fillText(playerController._right.getName(), canvas.width - 100, 180);
        
        //Timer
        canvasContext.fillStyle = "black";
        canvasContext.fillText(10 - gameController._iTurnNum, canvas.width/2, 400);
        
        //Minion selection
        for (var i = 0, len = this._rectsMinionSelection.length; i < len; i++) 
        {
            canvasContext.drawImage(minionViews[this._rectsMinionSelection[i].m], this._rectsMinionSelection[i].x, this._rectsMinionSelection[i].y);
        }
        
        //Local selection boxes
        for (var i = 0, len = this._rectsMinionsLocal.length; i < len; i++) 
        {
            var local = this._rectsMinionsLocal[i];
            canvasContext.strokeRect(local.x, local.y, local.w, local.h);
            
            if(local.m != null)
            {
                canvasContext.drawImage(minionViews[local.m], local.x + 7, local.y + 7);
            }
        }
        
        //Remote selection boxes
        for (var i = 0, len = this._rectsMinionsRemote.length; i < len; i++) 
        {
            var remote = this._rectsMinionsRemote[i];
            canvasContext.strokeRect(this._rectsMinionsRemote[i].x, this._rectsMinionsRemote[i].y, this._rectsMinionsRemote[i].w, this._rectsMinionsRemote[i].h);
            
            if(remote.m != null)
            {
                canvasContext.drawImage(minionViews[remote.m], remote.x + 7, remote.y + 7);
            }
        }
        
    }

    this._drawMinions = function()
    {
        for(var i = 0; i < 20; ++i)
        {
            if(battlefield[i] == null)
            {
                
            }
            else
            {
                battlefield[i].loadMinions();
                if(bIsReadyToDraw)
                {
                    canvasContext.drawImage(minionViews[battlefield[i].getViewIndex()], battlefield[i].getPosX(), battlefield[i].getPosY());
                }
            }
        }
    }
    
    this._newDrawMinions = function()
    {
        for(var i = 0; i < 3; ++i)
        {
            if(leftPlatoon[i] != null)
            {
                leftPlatoon[i].loadMinions();
                if(bIsReadyToDraw)
                {
                    canvasContext.drawImage(minionViews[leftPlatoon[i].getViewIndex()], leftPlatoon[i].getPosX(), leftPlatoon[i].getPosY()); 
                }
            }
            
            if(rightPlatoon[i] != null)
            {
                rightPlatoon[i].loadMinions();
                if(bIsReadyToDraw)
                {
                    canvasContext.drawImage(minionViews[rightPlatoon[i].getViewIndex()], rightPlatoon[i].getPosX(), rightPlatoon[i].getPosY());
                }
            }
        }
    }
             
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
    
    this._drawMenuScrren = function()
    {
        canvasContext.fillStyle = "black";
        for (var i = 0, len = this._rectsMenu.length; i < len; i++) 
        {
            canvasContext.fillRect(this._rectsMenu[i].x, this._rectsMenu[i].y, this._rectsMenu[i].w, this._rectsMenu[i].h);
        }
        
        canvasContext.font = "20px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "white";
        canvasContext.fillText("Sign In", canvas.width/2 + 125, canvas.height/2 + 130, 150);
        if(!bIsLogged)
            canvasContext.fillStyle = "gray";
        canvasContext.fillText("Play game", canvas.width/2 - 125, canvas.height/2 + 130, 150);
        
        canvasContext.font = "50px Arial";
        canvasContext.fillStyle = "blue";
        canvasContext.fillText("Minion", canvas.width/2 - 80, canvas.height/2 - 130, 150);
        canvasContext.fillStyle = "red";
        canvasContext.fillText("Wars", canvas.width/2 + 80, canvas.height/2 - 130, 150);
    }
    
    this._drawFriendsList = function()
    {
        if(friends != null)
        {
            for(var i = 0; i < friends.length; i++)
            {
                var rect = this._rectsFriendsList[i];
                canvasContext.strokeRect(rect.x, rect.y, rect.w, rect.h);

                canvasContext.font = "20px Arial";
                canvasContext.textAlign = "center";
                canvasContext.fillStyle = "black";
                canvasContext.fillText(friends[i].displayName, rect.x + 50, rect.y + 25, 100);
            }
        }
    }
    
    this.update = function()
    {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        
        if(gameController.gameState == "menu")
        {
            view._drawMenuScrren();
            if(bIsLogged)
            {
                view._drawFriendsList();
            }
        }
        else if(gameController.gameState == "game")
        {
            view._newDrawMinions();
            view._drawUI();
        }
        else if(gameController.gameState == "over")
        {
            
        }
        
        requestAnimationFrame(view.update);
    }
}


