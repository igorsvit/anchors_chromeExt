'use strict'
import {desc, assay, mlog, olog} from '#mylib/devutils.js'
import {dom} from '#mylib/dom.js'
import {mediator} from '#mylib/mediator.js'

 /*bearing in mind that a particular page creates its own JS runtime
 environment - try to shift from constructors to singletons*/
const AnchorsPrototype = (function createPrototype(){
	let proto = {}

	proto.initPageElement = function(){
		this.pageElement = dom.new('div', {id:'anchors-page-element'})
			this.pageElementHeader = dom.new('div', 
						{class:'anchors-page-element-header'}, 'Anchors')
				this.anchorsSaveButton = dom.new('div', {id:'anchors-save-button'})
				this.anchorsSaveButton.addEventListener('click', ()=>{
					mediator.announce('anchors_save_button_click')
				})
			this.pageElementHeader.appendChild(this.anchorsSaveButton)
		this.pageElement.appendChild(this.pageElementHeader)
		
		this.createContainerElement()
		.pageElement.appendChild(this.containerElement)
		
		document.body.appendChild(this.pageElement)
			if(this.pageElementPosition)
				dom.setElementPosition(this.pageElement, this.pageElementPosition)
			else {
				this.pageElementPosition = {
					'top': window.getComputedStyle(this.pageElement).top,
					'right': window.getComputedStyle(this.pageElement).right
				}
			}
		this.containerElement.addEventListener('click', this.handleAnchorsContainerCLick.bind(this))

		return 'AnchorsDiv initiated'
    }
    proto.createContainerElement = function(){
		this.containerElement = dom.new('div', {class:'anchors-container'})
			for (var [id, data] of Object.entries(this.entries)) {
				this.initAnchor(id, data)
  				//this.containerElement.insertAdjacentHTML(
				//	'beforeend', this.createAnchorHTML(id, data))
  			}
  		return this
	}
	proto.createAnchorHTML = function(anchorId, anchor){
		//let anchorName = anchor.anchorName
		//let anchorText = anchor.anchorText
		let anchorHtml = `<div id="${anchorId}" class="anchor-row">
        				<div class="anchor-name">${anchor.anchorName}</div>
          				<div class="anchor-text">${anchor.anchorText}</div>
          				<div id="anchor-delete-button">X</div>
    					</div>`
    	return anchorHtml
	}

	proto.handleAnchorsContainerCLick = function(event){
		console.log('handleAnchorsContainerCLick: ',event.target)
		if (event.target.id == 'anchor-delete-button'){
			this.deleteAnchorElement(event.target.parentNode)
		}
	//TODO: cancel deleting
	}
	proto.deleteAnchorElement = function (anchorElement) {
		this.containerElement.removeChild(anchorElement)
		delete this.entries[anchorElement.id]
	}
	proto.initAnchor = function(entryId, entry){
		var anchorRow = proto.createAnchorHTML(entryId, entry)
		this.containerElement.insertAdjacentHTML(
					'beforeend', anchorRow)
	}

	
	proto.dataTreeStringMap = {
		'st': 'ст',	
		'pu': 'п',	
		'pp': 'пп', 
		'ch_': 'ч'
	}
	proto.pageHandlers = {
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
			

			anchor.id = anchorTag.getAttribute('name')

			//anchor.id = anchorTag.getAttribute('name').slice(1)
			// = anchorTag.name
			var anchorDataTreeString = anchorTag.getAttribute('data-tree')
			var parsedAnchorDataTreeString = proto.parseDataTreeString(anchorDataTreeString)
			anchor.data = {}
			anchor.data.anchorName = parsedAnchorDataTreeString
			anchor.data.anchorText = parentTag.innerText 
			return anchor
		}
	}

	proto.parseStringTo_StrNumObject = function(str){
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
	proto.parseDataTreeString = function(str){

		//var dataTreeElements = {}
				var dataTreeElements = ''
		var chunks = str.split(':')
		//console.log(chunks)
		chunks.forEach((chunk)=>{
			var parsedChunk = proto.parseStringTo_StrNumObject(chunk)
			//console.log(parsedChunk)
			var key = proto.dataTreeStringMap[parsedChunk.stringPart]
			console.log(key)
			dataTreeElements += key + '.' + parsedChunk.numberPart+' '

			//dataTreeElements += 
				//key + '.' + parsedChunk.numberPart + ' '
		})
		return dataTreeElements.trim()
	}
	
	proto.getAnchorTagData = function(parentTag){
		return this.pageHandlers[window.location.hostname](parentTag)
	}

	proto.add = function(id, data){
            //_.checkArgs(entry)
            //_.checkArgs(entryId)
            if (this.entries[id]) {
                throw new Error("Anchor entry with id "+ id + " already exists") 
            	console.log('new Error thrown')
            }
            this.entries[id] = data
            //console.log(id)
            return {id, data}
        }
    proto.delete = function(id){
        if (this.entries[id]) {
            delete this.entries[id]
        return `Entry with id "${id}" deleted`
        }
        throw new Error(`Anchor entry with id "${id}" cannot be deleted: does not exist`) 
    }
	return proto
})()

function Anchors(savedEntries){
	var anchors = Object.create(AnchorsPrototype)
	anchors.pageElement = {}
	//anchors.isDisplayed = true
	function showNoDisplayedAnchorsPageElement(event) {
		if (event.altKey && anchors.noDisplay) {
			dom.toggleClass(anchors.pageElement, 'no-display')
			document.body.removeEventListener('click', showNoDisplayedAnchorsPageElement)
		}
	}
	anchors.containerElement = {}
	anchors.entries = {}
		if (savedEntries){
        	Object.keys(savedEntries).forEach((entryId)=>{
            	anchors.add(entryId, savedEntries[entryId])
        	})
    	}
    	else {
    		anchors.noDisplay = true
    		document.body.addEventListener('click', showNoDisplayedAnchorsPageElement)
    	}
    anchors.initPageElement()
    	if (anchors.noDisplay){
    		dom.toggleClass(anchors.pageElement, 'no-display')
    	}
	return anchors
}

export {Anchors}

//tests:
/*var page = {}
var page1 = {}
var data = {"n50": {
            		"anchorTitle": "ч.5 п.3 ст.9",
            		"anchorText": "bla bla bla" 
        			},
        	"n71": {
        			"anchorTitle": "ч.1 п.1 ст.8",
            		"anchorText": "Час перебування громадян України на військовій" 
        	}
}

	page.anchors = new Anchors(data)
	console.log('adding an anchor')
	try{
	console.log( page.anchors.add("n30", {
            		"anchorTitle": "ч.5 п.3 ст.9",
            		"anchorText": "bla bla bla" 
        			})
	)
	}
	catch(err){
		console.log(err)
	}
	console.log('deleting an anchor')
	try{
	page.anchors.delete('n5')
	}
	catch(err){
		console.log(err)
	}
	//page1.anchors = new Anchors()
	//console.log('trying to olog(page)')
	console.log(page.entries)*/