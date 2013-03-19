var g_oEditor = null;

$(document).on('ready', function()
{
    /* Grap templates from cash before initialzing. */
    $.get('static/templates.html', function(sData)
    {
        // Compile templates.
        $('#template').append(sData);
        oTemplate.init();
        onReady();
    });
});

function onReady()
{
    g_oEditor = new Editor(IS_NEW_DOCUMENT);    
    if (IS_NEW_DOCUMENT)
        chooseMode();
    else
        connect();
}

function chooseMode()
{
    function fnOnModeSelect(sMode)
    {
        g_oEditor.setMode(sMode);
        g_oEditor.focusEditor();
        oMenu.detach();
        $('BODY').removeClass('chooseMode');
        connect();
    }
    
    // Create the editor mode menu.
    var aDialogFavKeys = jQuery.grep(aFavKeys, function(sKey)
    {
        return sKey != 'html' && sKey != 'text';
    });
    var oMenu = new Menu(aModes, aDialogFavKeys, $('#modes'), null, fnOnModeSelect);
    oMenu.attach();
    
    // Attach button events.
    $('.btn.mode').on('click', function()
    {
        fnOnModeSelect(this.id);
    });
}

function connect()
{
    var sURL = 'ws://' + window.document.location.host + '/';
    console.log(sURL);
    var oSocket = new oHelpers.WebSocket(sURL);
    oSocket.bind('open', null, function()
    {
        g_oEditor.connect(oSocket);
    });
}