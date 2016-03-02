"use strict";

module.exports = function ()
{
    return function ( seconds )
    {
        var minutes = Math.floor( seconds / 60 );

        if( minutes > 0 )
        {
            seconds -= 60 * minutes;
            return minutes + "m " + seconds + "s";
        }
        else
        {
            return seconds + "s";
        }

    };
};
