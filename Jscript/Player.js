/**@fileoverview Player model. Contains all the data associated with player.
*@name Player.js
*@author Iliyan Georgiev
*/

/** Player Model
*@constructor
*@property {int} _iWins number of wins in the game (2 wins means this player won)
*@property {string} _sName name of the player
*@property {bool} _bTeam local/remote player
*/
function Player()
{
    //PRIVATE
    this._iWins;
    this._sName;
    this._bTeam;
    
    this.createPlayer = function(sName, bTeam)
    {
        this.setName(sName);
        this._bTeam = bTeam;
        this._iWins = 0;
    }
    
    /** Returns the name of the player
    *@return {String}
    */
    this.getName = function()
    {
        return this._sName;
    }
    /** Sets the name of the player
    *@param {String} sPlayerName New name
    */
    this.setName = function(sPlayerName)
    {
        this._sName = sPlayerName;   
    }
    
    /** Returns the number of wins this game
    *@return {int}
    */
    this.getWins = function()
    {
        return this._iWins;
    }
    /** Resets the number of wins to 0
    *@function
    */
    this.resetWins = function()
    {
        this._iWins = 0;
    }
    /** Adds a win to the player
    *@function
    */
    this.won = function()
    {
        this._iWins++;
    }
    
}