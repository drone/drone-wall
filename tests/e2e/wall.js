"use strict";

describe( "The wall should", function ()
{
    it( "grab a page of builds", function ()
    {
        expect( $( ".build-health .build-count .count" ).getText() ).toBe( "25" );
        expect( $( ".build-health .pull-count .count" ).getText() ).toBe( "11" );
        expect( $( ".build-health .success-fail .build-bar .success" ).getText() ).toBe( "22" );
        expect( $( ".build-health .success-fail .build-bar .failure span" ).getText() ).toBe( "2" );

        expect( $$( ".latest-builds ol li" ).count() ).toBe( 5 );
        expect( $( ".latest-builds ol li:first-child" ).getAttribute( "class" ) ).toBe( "running" );

    } );

    it( "show some build leaders", function ()
    {
        expect( $$( ".build-leaders ol li" ).count() ).toBe( 4 );
        expect( $( ".build-leaders ol li:first-child .successes" ).getText() ).toBe( "7" );
        expect( $( ".build-leaders ol li:first-child .failures" ).getText() ).toBe( "1" );
    } );

    it( "show the repos", function ()
    {
        browser.sleep( 7000 );  // Let the repos scroll

        expect( $$( ".repos li" ).count() ).toBeGreaterThan( 7 );
    } );

} );
