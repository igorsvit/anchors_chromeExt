'use strict';
import {desc, assay, flog, olog} from '#mylib/devutils.js'
import {mediator} from '#mylib/mediator.js'
import {chromeStorage as storage} from '../../chromeStorage.js'
import {Anchors} from './anchors.js'
//TODO
//Chapters names don't get into anchors
//
//
//
//fulfil copying of anchor's content when clicking anchor-name
window.onload = ()=>{
console.log('window loaded')
var page = {}
    page.anchors = {}
    page.anchors.active = false
    page.arranger = {}
    page.saveAnchors = function(){
        let data = {}
        //desc(page.anchors.entries,'page.anchors.entries')
        data.entries = [...page.anchors.entries]
                desc(data,'page.saveAnchors > data')
        //console.log(Object.fromEntries(page.anchors.entries))
            //data.entries = structuredClone(
             //       Object.fromEntries(page.anchors.entries))
            data.options = structuredClone(page.anchors.options)
        //desc(data.entries, 'data.entries')    
        storage.save('anchors', data)
        //storage.save('anchors', data)
    }
    page.initAnchors = function () {
        try {
        page.anchors = new Anchors(storage.getCacheData('anchors'))
        mediator.subscribe('anchors_save_button_click', 
                page, page.saveAnchors)
        document.addEventListener('click', (event)=>{
            if (event.ctrlKey) {
                console.log('event.ctrlKey: ', event.target)
                page.anchors.initNewAnchor(event.target)
                //let anchorTag = page.anchors.getAnchorTagData(event.target)
                //page.anchors.add(anchorTag.id, anchorTag.data)
                //page.anchors.initAnchor(anchorTag.id, anchorTag.data)
            }
        })
        window.addEventListener("beforeunload", (e)=>{
            page.anchors.setPageElementOptions()
            page.saveAnchors()
        })
        return true
        }
        catch(err){
            return err
        }
    }
chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.message === 'Anchors active?'){
        //console.log('page.anchors.active: ', page.anchors.active)
        return response({status: page.anchors.active})
    }
    if (request.message === 'popupAnchorsButtonClick') {
        var result = page.initAnchors()
        if (result){
            page.anchors.active = true
            response({status: page.anchors.active, message: 'page.anchors is active'})
        }
        else {
            console.log(error)
            response({status: 2, message: error})
        }
    }
    if(request.initModule === 'arranger'){
        if (page.arranger.run)
            return response({status: 2, message: 'Arranger already run'})
        console.log('call for arranger')
        var result = page.initArranger()
        if (result){
            page.arranger.run = true
            response({status: 1, message: 'page.arranger.run'})
        }
        else {
            console.log(error)
            response({status: 2, message: error})
        }
    }
})
   
async function sendMessageToPopup(message){
    var response = await chrome.runtime.sendMessage
        (message)
    if (response.status === 1){
        return true
    }
    throw new Error('response from popup failed');
}
//sendMessageToPopup({status: 1, message: "contentScript is ready"})
}

//npm run watch
