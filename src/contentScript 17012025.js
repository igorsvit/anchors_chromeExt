'use strict';
import {dom} from '#mylib/dom.js'
import {desc, assay, flog, olog} from '#mylib/devutils.js'
import {mediator} from '#mylib/mediator.js'
import {Anchors} from './anchors.js'
import {chromeStorage as storage} from '../../chromeStorage.js'

window.onload = ()=>{
console.log('window loaded')
var page = {}
page.cache = {}

page.pathname = window.location.pathname
page.storageQueryString = page.pathname.substring(page.pathname.lastIndexOf('/')+1)

storage.get(page.storageQueryString)
.then((storagePageEntry)=>{
                desc(storagePageEntry, 'storagePageEntry from Chrome Storage')
    Object.assign(page.cache, storagePageEntry)
})
.catch(function (error){
    console.log(error)
})
.finally(()=>{
desc(page, 'page')(page.cache, 'cache')
})

var anchors = {}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'anchorsButtonClicked') {
        anchors = new Anchors(page.cache.anchors)
        desc(anchors, 'anchors after anchorsButtonClicked')
        page.saveAnchors = function(){
            //page.cache.anchors = {}
            //if (!page.cache.anchors) page.cache.anchors = {}
            desc(page.cache.anchors, 'page.cache.anchors')
            desc(anchors.entries, 'anchors.entries')
            //Object.assign(page.cache.anchors, anchors.entries)
            page.cache.anchors = anchors.entries
            //if (!page.cache.renderInfo) page.cache.renderInfo = {}
            page.cache.renderInfo.anchorsPageElementPosition = anchors.pageElementPosition
            storage.set({[page.storageQueryString]:page.cache})
        }
        mediator.subscribe('anchors_save_button_click', 
                page, page.saveAnchors)
        document.addEventListener('click', (event)=>{
            if (event.altKey) {
                desc(event.target.children, 'event.target.children')
                desc(event.target, 'event.target')
                let anchorTag = anchors.getAnchorTagData(event.target)
                anchors.add(anchorTag.id, anchorTag.data)
                anchors.initAnchor(anchorTag.id,
                                    anchorTag.data)
            }

        })
        //!!!!!!!!!! WTF
        window.addEventListener("beforeunload", page.saveAnchors)
    }
    sendResponse('Message from contentScript: anchorsButtonClicked processed')
})
}

