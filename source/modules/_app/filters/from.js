"use strict";

module.exports = function ()
{
    return function ( date, now )
    {
        return date ? moment( date ).from( now, true ) : "";
    };
};
