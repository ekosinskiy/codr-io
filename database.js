var fs = require('fs');
var oHelpers = require('./helpers');
var assert = require('assert');
var oOS = require('os');
var oPath = require('path')
var g_sDataDirPath = function(){
        var sPath = oPath.join(oOS.tmpDir(), 'codr\\data');
        if(!fs.existsSync(sPath))
            fs.mkdirSync(sPath);
        return sPath
    }();

/*var oFileDatabase = {

    createDocument: function(oDocumentData, oScope, fnCallback)
    {
        fnCallback = oHelpers.createCallback(oScope, fnCallback);
        generateNewDocumentID(this, function(sDocumentID)
        {
            var oDocument = new Document(sDocumentID, oDocumentData);
            this.saveDocument(oDocument, this, function()
            {
                fnCallback(sDocumentID);
            });
        });
    },

    getDocument: function(sID, oScope, fnOnResponse)
    {
        fs.readFile(this._getPathFromID(sID), function(oErr, sDocument)
        {
            // TODO: handle error.
            var oDocument = new Document(sID, JSON.parse(sDocument));
            oHelpers.createCallback(oScope, fnOnResponse)(oDocument);
        });
    },

    saveDocument: function(oDocument, oScope, fnOnResponse)
    {
        var sJSONData = JSON.stringify(oDocument.serialize());
        fs.writeFile(this._getPathFromID(oDocument.getID()), sJSONData, oHelpers.createCallback(oScope, fnOnResponse));
    },
    
    documentExists: function(sID, oScope, fnOnResponse)
    {
        fs.exists(this._getPathFromID(sID), oHelpers.createCallback(oScope, fnOnResponse));
    },

    _getPathFromID: function(sID)
    {
        if (!validateFileID(sID))
            throw 'Invalid File ID: ' + sID;

        return './data/' + sID;
    }
};*/

var oMemoryDatabase =
{   
    createDocument: function(sData, oScope, fnOnResponse)
    {
        generateNewDocumentID(this, function(sID)
        {
            this.saveDocument(sID, sData, this, function()
            {
                oHelpers.createCallback(oScope, fnOnResponse)(sID);
            });
        });
    },

    getDocument: function(sID, oScope, fnOnResponse)
    {
        this.documentExists(sID, this, 
            function(bExists){
                oHelpers.assert(bExists, 'Document does not exist');  
                fs.readFile(oPath.join(g_sDataDirPath, sID), function (ignoredErr, fileData)
                {
                    oHelpers.createCallback(oScope, fnOnResponse)(fileData);
                })
            }
        );
    },

    saveDocument: function(sID, sData, oScope, fnOnResponse)
    {
        fs.writeFile(oPath.join(g_sDataDirPath, sID), sData, oHelpers.createCallback(oScope, fnOnResponse));
    },

    documentExists: function(sID, oScope, fnOnResponse)
    {
        fs.exists(oPath.join(g_sDataDirPath, sID), oHelpers.createCallback(oScope, fnOnResponse))
    }
};

//////////////// HELPERS //////////////////

function validateFileID(sID)
{
    return sID.match('^[a-z0-9]+$');
}

function generateNewDocumentID(oDatabase, fnOnResponse)
{
    // Create a random 7 character alpha numeric string.
    var sID = "";
    var sChars = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 7; i++ )
        sID += sChars.charAt(Math.floor(Math.random() * sChars.length));

    // Try recursively until we get a free one to avoid collisions.
    oDatabase.documentExists(sID, this, function(bExists)
    {
        if (!bExists)
            oHelpers.createCallback(oDatabase, fnOnResponse)(sID);
        else
            generateNewDocumentID(oDatabase, fnOnResponse);
    });
}

/////////////////////////////////////////////////

module.exports = oMemoryDatabase;
