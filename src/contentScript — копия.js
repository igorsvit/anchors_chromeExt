'use strict';
window.onload = ()=>console.log('window loaded')
document.onload = ()=>console.log('document loaded')
console.log('contentScript is running')
import {dom} from '#mylib/dom.js'
import {desc, assay, flog, olog} from '#mylib/devutils.js'
import {mediator} from '#mylib/mediator.js'
import {AnchorsModule} from './anchorsModule.js'
import {ChromeStorage} from '../../chromeStorage.js'
//import {Dictionary} from '#mylib/dictionary.js'

var page = {}
page.pathname = window.location.pathname
//var pagePathname = window.location.pathname
//var pageHostname = window.location.hostname
page.storageQueryString = page.pathname.substring(page.pathname.lastIndexOf('/')+1)
olog(page.storageQueryString)
var storage = new ChromeStorage()
var anchorsModule = new AnchorsModule()

mediator.subscribe('storage_cache_ready', 
                    anchorsModule, anchorsModule.initAnchorsDiv)
//mediator.subscribe('new_anchor_div_appended', 
 //                   anchorsModule, anchorsModule.initAnchor)
mediator.subscribe('anchor_delete_button_click', 
                    anchorsModule, anchorsModule.deleteAnchorDiv)

/*mediator.subscribeSome('anchor_delete_button_click', [
                    [anchorsModule, anchorsModule.deleteAnchorDiv],
                    [storage.cache.anchors, storage.cache.anchors.delete]
                    ])
*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //console.log(request.type)
  if (request.type === 'anchorsButtonClicked') {
    //TODO: make fallback to storage startup state 
    if(storage.cache.anchors) {
      return console.log("anchorsButtonClicked but storage.cache's been loaded")
    }
    storage.get(pageStorageQuery)
    .then((storageEntry)=>{
        console.log('storageEntry is:', storageEntry)
        storage.cache.anchors = new Dictionary(storageEntry)
        //mediator.subscribe('new_anchor_data_ready', 
        //            storage.cache.anchors, storage.cache.anchors.put)
        storage.cache.renderInfo = storageEntry.renderInfo
        //mediator.subscribe('anchor_div_deleted', 
                    //storage.cache.anchors, storage.cache.anchors.delete)
        //mediator.announce('storage_cache_ready', storage.cache)
        
        //working callback
        /*document.addEventListener('click', (event)=>{
            if (event.ctrlKey) {
                event.preventDefault()
                desc(storage.cache, 'storage')

                storage.saveCache(pageStorageQuery)
        }
        }) */
           /*
    }*/
    
    }
    /*,

      (rejected)=>{
        console.log(rejected)

      }*/
      )
    .catch(function (error) {
      console.log(error)
      //TODO: here will be 
      storage.cache.anchors = new Dictionary()
      storage.cache.renderInfo = {}//storageEntry.renderInfo
  })
    .finally(()=>{
      //TODO: new Anchor div must be appended AFTER
      //having  attempted to put it into cache
        mediator.announce('storage_cache_ready', storage.cache)
        mediator.subscribe('anchor_div_deleted', 
                    storage.cache.anchors, storage.cache.anchors.delete)
                .subscribe('new_anchor_data_ready',                  
                    storage.cache.anchors, storage.cache.anchors.put)
                .subscribe('new_anchor_data_ready',  
                    anchorsModule, anchorsModule.initAnchor)
        document.body.addEventListener('click', (event)=>{
            if (event.altKey) {
                var anchorTagData = anchorsModule.getAnchorTagData(event.target)
                desc(anchorTagData, 'anchorTagData')
                mediator.announce('new_anchor_data_ready', {entryId:anchorTagData.anchorId,
                                                            entry:anchorTagData.data})
            }
            if (event.ctrlKey) {
                //onbeforeunload = (event)=>{
                    storage.saveCache(pageStorageQuery)
            //}
    }
})
    })

        //(error)=>{console.log(error)})
  }

})




/*{
    "anchors": {
        "n40": {
            "anchorTitle": "ч.1 п.1 ст.8",
            "anchorText": "Час перебування громадян України" 
        }
    },
    "renderInfo": {
        "anchorsDivPosition": {
            "right": "0px",
            "top": "70px"
        }
    }
}*/

/*async function setSyncStorage(data){
    let result = await chrome.storage.sync.set(
      {'2011-12':{
            anchors: {
              '40': {anchorName: 'n40', anchorText: 'cfc csa'},
              '50': {anchorName: 'n50', anchorText: 'mmmmmmm'}
            },
            renderInfo: {
              'anchorsContainerPosition':{top:'70px', right:'0px'}
            }
            }
      })



        anchors: [{anchorId: 40, anchorName: 'n40', anchorText: 'cfc csa'},
                  {anchorId: 50, anchorName: 'n50', anchorText: 'mmmmmmm'}],
        anchorsDivPosition:{top:'70px', right:'0px'}
      }}
      data)
    //console.log(result);
}*/  

/*chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  (response) => {
    console.log(response.message);
  }
);*/