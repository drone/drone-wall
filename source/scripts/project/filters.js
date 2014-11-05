/* Filters */

angular.module( "wall.filters", [] )

.filter( "moment", function()
{
    "use strict";

    return function( date, format, parse )
    {
        return date ? ( parse ? moment( date ).format( format ) : date.format( format ) ) : "";
    };
} )

.filter( "from", function()
{
    "use strict";

    return function( date, now )
    {
        return date ? moment( date ).from( now, true ) : "";
    };
} )

.filter( "duration", function()
{
    "use strict";

    return function( seconds )
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
} );
