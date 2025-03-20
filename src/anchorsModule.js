'use strict'
import {desc, assay, mlog} from '#mylib/devutils.js'
import {dom} from '#mylib/dom.js'
import {mediator} from '#mylib/mediator.js'

 /*bearing in mind that a particular page creates its own JS runtime
 environment - try to shift from constructors to singletons*/
const AnchorsModulePrototype = (function createPrototype(){
	let ob = {}

	ob.initAnchorsDiv = function(anchorsCachedData){
		//var data = anchorsCachedData
		console.log('anchorsCachedData is:', anchorsCachedData)
		//console.log('this for initAnchorsDiv is: ', this)
		this.anchorsAppDiv = this.createAnchorsDiv(anchorsCachedData.anchors)
			this.anchorsAppDiv.addEventListener('click', this.handleAnchorsAppDivCLick)
			document.body.appendChild(this.anchorsAppDiv)
		if(anchorsCachedData.renderInfo.anchorsDivPosition){
			dom.setElementPosition(this.anchorsAppDiv, 
				anchorsCachedData.renderInfo.anchorsDivPosition)
		}
		return 'AnchorsDiv initiated'
    }
    ob.createAnchorsDiv = function(anchorsEntries){
		let anchorsAppDiv = dom.new('div', {id:'anchors-div'})
		this.anchorsContainer = dom.new('div', {class:'anchors-container'})
		//let anchorsContainer = 
			for (const [anchorId, anchor] of Object.entries(anchorsEntries)) {
  				console.log(anchorId, ': ', anchor)
  				this.anchorsContainer.insertAdjacentHTML(
					'beforeend', ob.createAnchorHTML(anchorId, anchor))
  			}
		anchorsAppDiv.appendChild(this.anchorsContainer)
		return anchorsAppDiv
	}
	ob.createAnchorHTML = function(anchorId, anchor){
		//let anchorName = anchor.anchorName
		//let anchorText = anchor.anchorText
		let anchorHtml = `<div id="${anchorId}" class="anchor-row">
        				<div class="anchor-title">${anchor.anchorTitle}</div>
          				<div class="anchor-text">${anchor.anchorText}</div>
          				<div class="anchor-delete-button">X</div>
    					</div>`
    	return anchorHtml
	}
	ob.handleBodyClick	= function(event){
		if (event.altKey) {
			var anchorTagData = ob.getAnchorTagData(event.target)
			mediator.announce('new_anchor_data_ready', anchorTagData)
        	//this.saveAnchorDataToCache(anchorTagData)	
		}

        }
	ob.handleAnchorsAppDivCLick = function(event){
		console.log('handleAnchorsAppDivClick: ',event.currentTarget)
		if (event.target.classList.contains('anchor-delete-button')){
			mediator.announce('anchor_delete_button_click', 
								event.target.parentNode)
		}
	}
	ob.deleteAnchorDiv = function (anchorDiv) {
		let id = anchorDiv.id
		this.anchorsContainer.removeChild(anchorDiv)
		desc(anchorDiv, 'removed')
		mediator.announce('anchor_div_deleted', id)


	}
	ob.initAnchor = function({entryId, entry}){
		console.log('anchorId: ', entryId)
		console.log('data: ', entry)
		var anchorRow = ob.createAnchorHTML(entryId, entry)
		//desc(this, 'this in initAnchor()')
		desc(anchorRow, 'anchorRow')
		this.anchorsContainer.insertAdjacentHTML(
					'beforeend', anchorRow)


		//appendChild(anchorRow)
		//mediator.announce('new_anchor_div_appended', {anchorId, data})
	}
	/*ob.saveAnchorDataToCache = function({data, anchorId}){
		this.cache.put(data, anchorId)	
	}*/
	
	ob.dataTreeStringMap = {
		'st': 'ст',	
		'pu': 'п',	
		'pp': 'пп', 
		'ch_': 'ч'
	}
	ob.pageHandlers = {
		'zakon.rada.gov.ua': function(parentTag){
			var anchor = {}
			var anchorTag 
			for (var node of parentTag.childNodes){
				//desc(node.nodeName, 'node.nodeName')
				if (node.nodeName == 'A'&&
					node.getAttribute('name')){

					anchorTag = node
				}
			}
			desc(anchorTag, 'anchorTag')
			


			anchor.anchorId = anchorTag.getAttribute('name').slice(1)
			// = anchorTag.name
			var anchorDataTreeString = anchorTag.getAttribute('data-tree')
			var parsedAnchorDataTreeString = ob.parseDataTreeString(anchorDataTreeString)
			anchor.data = {}
			anchor.data.anchorName = parsedAnchorDataTreeString
			anchor.data.anchorText = parentTag.innerText 
			return anchor
		}
	}

	ob.parseStringTo_StrNumObject = function(str){
		var stringPart = ''
		var numberPart = ''
		Array.from(str).forEach((sym)=>{
			if (isNaN(sym)){
				stringPart += sym
			}
			else {
			numberPart += sym
			}
	})
		return {stringPart:stringPart,
		   numberPart:numberPart}
	}
	ob.parseDataTreeString = function(str){

		//var dataTreeElements = {}
				var dataTreeElements = ''
		var chunks = str.split(':')
		//console.log(chunks)
		chunks.forEach((chunk)=>{
			var parsedChunk = ob.parseStringTo_StrNumObject(chunk)
			//console.log(parsedChunk)
			var key = ob.dataTreeStringMap[parsedChunk.stringPart]
			console.log(key)
			dataTreeElements += key + '.' + parsedChunk.numberPart+' '

			//dataTreeElements += 
				//key + '.' + parsedChunk.numberPart + ' '
		})
		return dataTreeElements.trim()
	}
	
	ob.getAnchorTagData = function(parentTag){
		//desc(anchorParentTag, 'anchorParentTag is:')
		var anchorTagData = ob.pageHandlers[window.location.hostname](parentTag)
		
		return anchorTagData
		//this.cache.anchors.put(anchorTagData.props, anchorTagData.anchorId)
	}
	return ob
})()

function AnchorsModule(){
	var ob = Object.create(AnchorsModulePrototype)
	//TODO:move following functions to prototype
	ob.anchorsAppDiv = {}
	ob.anchorsContainer = {}
	//ob.cache = {}

	return ob
}

export {AnchorsModule}