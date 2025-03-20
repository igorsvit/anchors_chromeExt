'use strict'
import {desc, assay, mlog, olog} from '#mylib/devutils.js'
import {dom} from '#mylib/dom.js'
import {mediator} from '#mylib/mediator.js'

 /*bearing in mind that a particular page creates its own JS runtime
 environment - try to shift from constructors to singletons*/
const AnchorsPrototype = (function createPrototype(){
	let proto = {}
	function prepareAnchorsForDrag(element){
		//var element = anchors.pageElement
		element.style.minWidth = element.offsetWidth+'px'
        element.style.minHeight = element.offsetHeight+'px'
        element.style.opacity = '0.75'
	}
	function dragAnchorsElement(event){
console.log(element.style.left)
		//if (event.clientY <= 75) return false
        element.style.left = event.clientX - shiftX + 'px';
                    element.style.top = event.clientY - shiftY + 'px';
	}
	function normalizeAnchorsAfterDrag(element){
		//var element = anchors.pageElement
		element.style.opacity = '1'
		//!!!!!! Place this function in an appropriate spot
		//anchors.setPageElementOptions()
	}
	proto.initPageElement = function(){
		let anchors = this
		anchors.pageElement = dom.new('div', {id:'anchors-page-element'})
			anchors.pageElementHeader = dom.new('div', 
						{id:'anchors-page-element-header'}, 'Anchors')
				anchors.saveButton = dom.new('div', {id:'anchors-save-button'})
				anchors.saveButton.addEventListener('click', (e)=>{
					//e.stopPropagation()
					mediator.announce('anchors_save_button_click')
				})
			anchors.pageElementHeader.appendChild(anchors.saveButton)
		anchors.pageElement.appendChild(anchors.pageElementHeader)
		
		anchors.createContainerElement()
			.pageElement.appendChild(anchors.containerElement)
		document.body.appendChild(anchors.pageElement)
		
		if(anchors.options.pageElement){
			Object.keys(anchors.options.pageElement)
				.map(option=>{
						anchors.pageElement.style[option] = anchors.options.pageElement[option]
				//dom.setElementPosition(anchors.pageElement, anchors.pageElementPosition)
				})
			}	
			else {
				anchors.options.pageElement = {
					//'top': window.getComputedStyle(anchors.pageElement).top,
					//'right': window.getComputedStyle(anchors.pageElement).right
				}
			}
		//InTEST code
		//dom.setElementDraggable(anchors
		//	,prepareElemForDragging, normalizeElemAfterDragging
		//	)
		//TEST start
		var dragAnchorsPageElement = dom.setElementDraggable(anchors.pageElement
			,{	prepareFn: prepareAnchorsForDrag,
				restoreFn: normalizeAnchorsAfterDrag
			}
			)
		anchors.pageElement.addEventListener('mousedown', (event)=>{
			event.stopPropagation()
			//console.log(event.target)
			//console.log(anchors.pageElementHeader)
			//console.log(event.target == anchors.pageElementHeader)
			//(event.target == anchors.pageElementHeader) && (dragAnchorsPageElement())
			if (event.target == anchors.pageElementHeader) dragAnchorsPageElement(event)

		})
		//TEST end

		anchors.containerElement.addEventListener('click', anchors.handleAnchorsContainerCLick.bind(anchors))

		return 'AnchorsDiv initiated'
    }
    proto.createContainerElement = function(){
		this.containerElement = dom.new('div', {class:'anchors-container'})
			desc(this.entries, 'this.entries')
			this.entries.forEach((entryData, entryId)=>{
				//desc(this, 'this')
				//desc(entryId, 'entryId')
				//	desc (entryData, 'entryData')
				this.initAnchor(entryId, entryData)
			})
			//for (var [id, data] of Object.entries(this.entries)) {
				//this.initAnchor(id, data)
  				//this.containerElement.insertAdjacentHTML(
				//	'beforeend', this.createAnchorHTML(id, data))
  			//}
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
		event.stopPropagation()//so as not to mess with anchorsPageELement events 
		console.log('handleAnchorsContainerCLick: ',event.target)
		if (event.target.id == 'anchor-delete-button'){
			this.deleteAnchorElement(event.target.parentNode)
		}
		if (event.altKey) {
			this.goToAnchor(event.target.parentNode)
		}

	//TODO: cancel deleting
	}
	proto.deleteAnchorElement = function (anchorElement) {
		this.containerElement.removeChild(anchorElement)
		this.delete(anchorElement.id)
		//delete this.entries[anchorElement.id]
		desc(this.entries, 'this.entries')
	}
	proto.goToAnchor = function(anchorTag){
		var tag = document.getElementsByName(anchorTag.id)[0].parentNode
		tag.scrollIntoView({ block: "center", behavior: "smooth" })
		dom.tempStyleChange(tag, 'backgroundColor', 'cyan', 2000)
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
		'ch_': 'ч',
		'pr': "пр"
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
			//desc(anchorTag, 'anchorTag')
			anchor.id = anchorTag.getAttribute('name')
			var anchorDataTreeString = anchorTag.getAttribute('data-tree')
			var parsedAnchorDataTreeString = 
					proto.parseDataTreeString(anchorDataTreeString)
			anchor.data = {}
			anchor.data.anchorName = parsedAnchorDataTreeString
			anchor.data.anchorText = parentTag.innerText 
			return anchor
		}
	}
	proto.parseStringTo_StrNumObject = function(str){
		console.log(str)
		var stringPart = ''
		var numberPart = ''
		var array = Array.from(str)
			function iter(arr){
    			if (isNaN(arr[0])){
					stringPart += arr[0]
        			arr.shift(0)
        		return iter(arr)
				}
      			numberPart = arr.join('')
      		return
    		}
    	iter(array)
		/*Array.from(str).forEach((sym)=>{
			if (isNaN(sym)){
				stringPart += sym
			}
			else {
				numberPart += sym
			}
	})*/
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
			console.log('key',key)
			dataTreeElements += key + '.' + parsedChunk.numberPart+' '
		})
		console.log('dataTreeElements', dataTreeElements)
		return dataTreeElements.trim()
	}
	proto.getAnchorTagData = function(parentTag){
		return this.pageHandlers[window.location.hostname](parentTag)
	}
	proto.add = function(id, data){
			let anchorsMap = this.entries
            if (anchorsMap.get(id)){
             	dom.tempStyleChange(dom.get('#'+id),
            		'backgroundColor','rgb(21, 237, 86)', 2000)
                throw new Error("Anchor entry with id "+ id + " already exists") 
            	console.log('new Error thrown')
            }
            anchorsMap.set(id, data)
            console.log('this.entries:',anchorsMap)
            mediator.announce('anchor_entry_added')
            console.log('mediator announced anchor_entry_added event')
    }
    proto.setPageElementOptions = function(){
    	let anchors = this
    	var props = ['top', 'left','right', 'minWidth', 'minHeight', 'width']
    	props.forEach((option)=>{
    		anchors.options.pageElement[option] 
    			= window.getComputedStyle(anchors.pageElement)[option]
    		desc(anchors.options.pageElement[option], 'self.options.pageElement[option]')
    	})
    	
    }
    proto.delete = function(id){
        if (this.entries.get(id)
        	//this.entries[id]
        	) {
            this.entries.delete(id)
            //delete this.entries[id]
        return `Entry with id "${id}" deleted`
        }
        throw new Error(`Anchor entry with id "${id}" cannot be deleted: does not exist`) 
    }
	return proto
})()

function Anchors(savedAnchors){
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
	//if (savedAnchors.options) console.log('if (anchors.options) is true')
	anchors.options = {}
		/*if (savedAnchors){
		}*/
		if (savedAnchors.options){
			Object.keys(savedAnchors.options).forEach((option)=>{
            	anchors.options[option] = savedAnchors.options[option]
        	})
		}
		//else {anchors.options = undefined}
	anchors.entries = new Map()//{}
		if (savedAnchors.entries){
        	Object.keys(savedAnchors.entries).forEach((entryId)=>{
            	anchors.entries.set(entryId, savedAnchors.entries[entryId])
            	//anchors.add(entryId, savedAnchors.entries[entryId])
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
    //desc(anchors, 'anchors after construction')
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