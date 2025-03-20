'use strict';
import './popup.css'
var buttonsContainer = document.querySelector('.button-container')
var anchorsButton = document.querySelector('#anchors')
var arrangerButton = document.querySelector('#arranger')
console.log(new Date())
    //if (!checkContentScriptModules({message: 'Anchors active?'})){
    //console.log(anchorsButton)
    //anchorsButton.toggleAttribute("disabled")
    //}
sendMessageToTab({message: 'Anchors active?'})
        .then(res=>{
            console.log(res.status)
            if (!res.status){
                console.log(anchorsButton)
                //anchorsButton.toggleAttribute("disabled", true)
                anchorsButton.setAttribute("disabled")
                //anchorsButton.style.backgroundColor = 'red'
            }
            else {
                anchorsButton.setAttribute("disabled", "")
                //anchorsButton.toggleAttribute("disabled", false)
            }
        })
        .catch(err=>{
                console.log(err)
            })


//anchorsButton.toggleAttribute("disabled")
async function sendMessageToTab(message){
    var [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
        var response = await chrome.tabs.sendMessage(
                tab.id, message);
        //if (response.status === 1){
        //    return response
       // }
        if (!response){
            throw new Error('contentScript failure')
        }
        return response
}
function checkContentScriptModules(message){
    console.log(message)
    sendMessageToTab(message)
        .then(res=>{
            console.log(res.status)
                if (res.status)
                    {return true}
                else {
                    return false
                }
                //anchorsButton.toggleAttribute("disabled")

            }).catch(err=>{
                console.log(err)
            })
}
//buttonsContainer.addEventListener('click', checkContentScriptState)
buttonsContainer.addEventListener('click', (event)=>{
        if (event.target == anchorsButton){
            sendMessageToTab({message: 'popupAnchorsButtonClick'})
            .then(res=>{
                console.log(res.message)
                if (res.status){
                    anchorsButton.setAttribute("disabled", "")
                }
                //event.target.toggleAttribute("disabled")
            }).catch(err=>{
                console.log(err)
            })
        }
        if (event.target == arrangerButton){
            sendMessageToTab({initModule: 'arranger'})
            .then(res=>{
                console.log(res.message)
                //event.target.toggleAttribute("disabled")
            }).catch(err=>{
                console.log(err)
            })
        }
})
/*chrome.runtime.onMessage.addListener((request, sender, response) => {               
    if (sender.tab && request.status === 1){
            anchorsButton.toggleAttribute("disabled")
        }
    else {
        console.log(`somthing's wrong with sender.tab`)
    }
})*/


          
