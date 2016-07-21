"use strict";

describe( "The config page should", function ()
{
    it( "appear when a token has not been supplied", function ()
    {
        browser.get( "/" );

        expect( $( ".wall-config" ).isPresent() ).toBe( true );

    } );

    it( "require both an API path and a token to be supplied", function ()
    {
        $( "input[id=path]" ).clear();
        $( "input[id=token]" ).clear();

        $( "form[name=configForm] button[type=submit]" ).click();

        expect( $( "[ng-messages='configForm.path.$error'] [ng-message='required']" )
            .isPresent() ).toBe( true );
        expect( $( "[ng-messages='configForm.token.$error'] [ng-message='required']" )
            .isPresent() ).toBe( true );

    } );

    it( "load the wall once changes are saved", function ()
    {
        $( "input[id=path]" ).sendKeys( "https://drone.testdomain.com/api/" );
        $( "input[id=token]" ).sendKeys( "abc123" );

        expect( $( "[ng-messages='configForm.path.$error'] [ng-message='required']" )
            .isPresent() ).toBe( false );
        expect( $( "[ng-messages='configForm.token.$error'] [ng-message='required']" )
            .isPresent() ).toBe( false );

        $( "form[name=configForm] button[type=submit]" ).click();

        expect( $( ".build-column" ).isPresent() ).toBe( true );

    } );

} );
