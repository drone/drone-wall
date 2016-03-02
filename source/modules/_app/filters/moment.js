"use strict";

module.exports = function ()
{
    return function ( date, format, parse )
    {
        return date ? ( parse ? moment( date ).format( format ) : date.format( format ) ) : "";
    };
};
