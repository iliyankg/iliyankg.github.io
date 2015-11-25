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
    this._rects = [{x: canvas.width/2 - 200, y: canvas.height/2 + 100, w: 150, h: 50, t:"play"},//Play game
                   {x: canvas.width/2 + 50, y: canvas.height/2 + 100, w: 150, h: 50, t:"google"}];//Google
    
    
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

    this._drawPlayerNames = function()
    {
        canvasContext.font = "20px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "blue";
        canvasContext.fillText(playerController._left.getName(), 100, 180);
        canvasContext.fillStyle = "red";
        canvasContext.fillText(playerController._right.getName(), canvas.width - 100, 180);
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
        for (var i = 0, len = this._rects.length; i < len; i++) 
        {
            canvasContext.fillRect(this._rects[i].x, this._rects[i].y, this._rects[i].w, this._rects[i].h);
        }
        
        canvasContext.font = "20px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "white";
        canvasContext.fillText("Play game", canvas.width/2 - 125, canvas.height/2 + 130, 150);
        canvasContext.fillText("Sign In", canvas.width/2 + 125, canvas.height/2 + 130, 150);
        
        canvasContext.font = "50px Arial";
        canvasContext.fillStyle = "blue";
        canvasContext.fillText("Minion", canvas.width/2 - 80, canvas.height/2 - 130, 150);
        canvasContext.fillStyle = "red";
        canvasContext.fillText("Wars", canvas.width/2 + 80, canvas.height/2 - 130, 150);
    }
    
    this.update = function()
    {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        
        if(gameController.gameState == "menu")
        {
            view._drawMenuScrren();
        }
        else if(gameController.gameState == "game")
        {
            view._newDrawMinions();
            view._drawPlayerNames();
        }
        else if(gameController.gameState == "over")
        {
            
        }
        
        requestAnimationFrame(view.update);
    }
}


