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
                                        
    this.update = function()
    {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        
        view._newDrawMinions();
        view._drawPlayerNames();
        
        requestAnimationFrame(view.update);
    }
}
