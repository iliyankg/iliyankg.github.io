/** PlayerController resposible for communication beteen all aspects of the View and the Model.
*@constructor
*@property {Player} _left Local player
*@property {Player} _right Remote player
*/
function PlayerController()
{
    //PRIVATE
    this._left = new Player(); 
    this._right = new Player();
    
    /** Sends the local player info to the server
    *@function
    */
    this._sendPlayer = function(){}
    /** Gets the local player info from the server
    *@function
    */
    this._recievePlayer = function(){this._left.setName(_getLocalPlayerName())} 
    
    /** Sends the local player choice to the server
    *@function
    */
    this._sendChoice = function(){}
    /** Recieves the remote player choice from the server
    *@function 
    */
    this._recieveChoice = function(){}
    /** Gets the player choice from the UI
    *@function
    */
    this._reccordPlayerChoice = function()
    {
        //Change random to UI
        _left.setChoice(Math.floor((Math.random() * 3) +1));
    }
    
    //SHIM
    this._SHIM_recieveChoice = function()
    {
        _right._iChoice(Math.floor((Math.random() * 3) +1));
    }
    
    //PUBLIC    
    /** Calls the _sendPlayer() and _recievePlayer() functions to set up the Player.sName variable
    *@function
    */
    this.resolvePlayers = function()
    {

    }
    /** Calls _reccordPlayerChoice(), _sendChoice() and _recieveChoice() for multiplayer
    *@function
    */
    this.resolveChoices = function()
    {
        _reccordPlayerChoice();
        _sendChoice();
        _SHIM_recieveChoice();
    }
    /** Returns the local player choice
    *@returns {Number}
    */
    this.getLeftChoice = function()
    {
        return _left.getChoice();
    }
    /** Returns the remote player choice
    *@returns {Number}
    */
    this.getRightChoice = function()
    {
        return _right.getChoice();
    }
    
    /** Returns the local player name
    *@returns {String}
    */
    this.getLeftName = function()
    {
        return _left.getName();
    }
    /** Returns the remote player name
    *@returns {String}
    */
    this.getRightName = function()
    {
        return _right.getName();
    }

}