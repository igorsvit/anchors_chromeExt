'use strict'
import {desc, assay, mlog, olog} from '#mylib/devutils.js'
import {dom} from '#mylib/dom.js'
import {mediator} from '#mylib/mediator.js'

//TODO
//1. vertical container and row border shift
//2. taking division, chapter etc out of the container
//3. plug in DB


 /*bearing in mind that a particular page creates its own JS runtime
 environment - try to shift from constructors to singletons*/
const AnchorsPrototype = (function createPrototype(){
	let proto = {}
	function prepareAnchorsForDrag(element){
		element.style.minWidth = element.offsetWidth+'px'
        element.style.minHeight = element.offsetHeight+'px'
        element.style.opacity = '0.75'
	}
	function moveAnchorsElement(event, element, {initials}){
       	element.style.left = event.clientX - initials.shiftX + 'px';
            element.style.top = event.clientY - initials.shiftY + 'px'
        return true
	}
	function normalizeAnchorsAfterDrag(element){
		element.style.opacity = '1'
		//!!!!!! Place this function in an appropriate spot
		//anchors.setPageElementOptions()
	}
	function prepareElementForBorderDrag(element){
        //presently this fn is unnescessary
        dom.toggleClass(document.body, 'col-resizing')
        return true
	}
	function moveElementBorderAtLeft(event, element, {
					initials, settings}) {
		//console.log(width, left)

		element.style.left = event.clientX + initials.shiftX + 'px'
		let newWidth = initials.right - event.clientX + initials.shiftX
		//let newHeight = settings.curHeightElement.offsetHeight

			//console.log(newHeight)
		if (newWidth < settings.stopWidth) 
			{return false}// see to the magic number problem
		//if (newHeight < 200) {return false}
		//console.log('smths wrong')
		element.style.width = 
				element.style.maxWidth = //remove it
				element.style.minWidth = //remove it
				newWidth + 'px'
		//element.style.height = newHeight + 'px'	
		//element.style.maxHeight = window.getComputedStyle(element)['maxHeight']
		//element.style.minHeight = window.getComputedStyle(element)['minHeight']
	    element.style.right = ''
        return true
	}
	
	function normalizeElementAfterBorderDrag(element){
        //presently this fn is unnescessary
        dom.toggleClass(document.body, 'col-resizing')

        return true
	}
	
	proto.initPageElement = function(){
		console.log('this is:',this,)
		let anchors = this
		anchors.pageElement = dom.new('div', {id:'anchors-page-element'})
			anchors.maximizeButton = dom.new('div', {	id:'anchors-maximize-button',
														class: 'no-display'})
			anchors.maximizeButton.addEventListener('click', (e)=>{
					//dom.toggleClass(anchors.pageElement, 'no-display')
					//console.log('maximizeButton clicked')
					anchors.pageElement.style.display = 'block'
					//anchors.maximizeButton.style.display = 'none'
					dom.toggleClass(anchors.maximizeButton, 'no-display')
			})

			let resizerGripsHTML = `<div id="left-resizer-grip" class="resizer-grip"></div>
        		<div id="bottom-resizer-grip" class="resizer-grip"></div>
        		<div id="right-resizer-grip" class="resizer-grip"></div>
        		<div id="top-resizer-grip" class="resizer-grip"></div>`
    		anchors.pageElement.insertAdjacentHTML(
					'afterbegin', resizerGripsHTML)
		console.log(anchors.pageElement)
		anchors.pageElementHeader = dom.new('div', 
						{id:'anchors-page-element-header'}, 'Anchors')
				anchors.saveButton = dom.new('div', {id:'anchors-save-button'})
				anchors.saveButton.addEventListener('click', (e)=>{
					//e.stopPropagation()
					anchors.setPageElementOptions()
					mediator.announce('anchors_save_button_click')
				})
				anchors.delALLButton = dom.new('div', {id:'del-anchors-button'},'X')
				anchors.delALLButton.addEventListener('click', (e)=>{
					e.stopImmediatePropagation()
					console.log('containerElement.children: ', anchors.containerElement.children)
					for (var element of Array.from(anchors.containerElement.children)){
						console.log('one of containerElement.children: ',element)
						anchors.deleteAnchorElement(element)
					}
					//mediator.announce('anchors_save_button_click')
				})
				anchors.minimizeButton = dom.new('div', {id:'anchors-minimize-button'}, 'min')
				anchors.minimizeButton.addEventListener('click', (e)=>{
					//dom.toggleClass(anchors.pageElement, 'no-display')
					anchors.pageElement.style.display = 'none'
					//anchors.maximizeButton.style.display = 'block'
					dom.toggleClass(anchors.maximizeButton, 'no-display')
				})

			anchors.pageElementHeader.appendChild(anchors.saveButton)
			anchors.pageElementHeader.appendChild(anchors.minimizeButton)
			anchors.pageElementHeader.appendChild(anchors.delALLButton)
			document.body.appendChild(anchors.maximizeButton)
		anchors.pageElement.appendChild(anchors.pageElementHeader)
		
		anchors.createContainerElement()
			.pageElement.appendChild(anchors.containerElement)
		document.body.appendChild(anchors.pageElement)
		//document.body.appendChild(
		if(anchors.options.pageElement){
			Object.keys(anchors.options.pageElement)
				.map(option=>{
						anchors.pageElement.style[option] = anchors.options.pageElement[option]
				})
			}	
			else {
				anchors.options.pageElement = {
				}
			}
		//console.log(anchors.pageElement)
		var dragAnchorsElement = dom.initElementShifting(
			anchors.pageElement,
			{	prepFn: prepareAnchorsForDrag,
				rollbackFn: normalizeAnchorsAfterDrag,
				cb: moveAnchorsElement})

		var resizeAnchorsElementAtLeft = dom.initElementShifting(
				anchors.pageElement,
				{	prepFn: prepareElementForBorderDrag,
					rollbackFn: normalizeElementAfterBorderDrag,
					cb: moveElementBorderAtLeft,
					settings: {stopWidth: 180,
							//curHeightElement: anchors.containerElement,//to adjust height while resizing
							minHeight: 100}//set up the mess with magic numbers
			})
		/*var resizeAnchorRowVertically = function(event){
			
		}*/

		anchors.pageElement.addEventListener('mousedown', (event)=>{
			event.stopPropagation()
			//console.log(event.target)
			//console.log(anchors.pageElementHeader)
			//console.log(event.target == anchors.pageElementHeader)
			//(event.target == anchors.pageElementHeader) && (dragAnchorsPageElement())
			if (event.target == anchors.pageElementHeader) 
				dragAnchorsElement(event)
			if (event.target.id == 'left-resizer-grip')
				resizeAnchorsElementAtLeft(event)
		})
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
  		return this
	}
	proto.createAnchorHTML = function(anchorId, anchor){
		//let anchorName = anchor.anchorName
		//let anchorText = anchor.anchorText
		let anchorHtml = `<div id="${anchorId}" class="anchor-row">
        				<div class="anchor-name">${anchor.anchorName}</div>
          				<div class="anchor-text">${anchor.anchorText}</div>
          				<div id="anchor-delete-button">X</div>
						<div class="row-resizer-grip"></div>
    					</div>`
    	return anchorHtml
	}

	proto.handleAnchorsContainerCLick = function(event){
		event.stopPropagation()//so as not to mess with anchorsPageELement events 
		console.log('handleAnchorsContainerCLick: ',event.target)
		if (event.target.id == 'anchor-delete-button'){
			this.deleteAnchorElement(event.target.parentNode)
		}
/*		if (event.altKey) {
			event.stopImmediatePropagation()
			event.preventDefault()
		}*/
		if (event.target.classList.contains('anchor-text')
			& !event.altKey) {
			this.goToAnchor(event.target.parentNode)
		}


	//TODO: cancel deleting
	}
	proto.deleteAnchorElement = function (anchorElement) {
		console.log('this for proto.deleteAnchorElement: ',this)
		this.containerElement.removeChild(anchorElement)
		this.delete(anchorElement.id)
		//delete this.entries[anchorElement.id]
		//desc(this.entries, 'this.entries')
	}
	
	proto.initAnchor = function(entryId, entry){
		//console.log('entryId, entry:', entryId, entry)
		var anchorRow = proto.createAnchorHTML(entryId, entry)
		this.containerElement.insertAdjacentHTML(
					'beforeend', anchorRow)
		//console.log('this for proto.initAnchor: ',this)
	}
	proto.dataTreeStringMap = {
		'st': 'ст',	
		'pu': 'п',	
		'pp': 'пп', 
		'ch_': 'ч',
		'pr': "пр",
		'pr_': "пр",
		'ppa_': "пп а",
		'ppg_': "пп г",
		'rz': 'р',
		processIrregulerStringPart(numberPart){
			let symIndex = 1071 + (+numberPart)
			let sym = String.fromCodePoint(symIndex)
			//let arr = ['а',]
			return 'абз ' + sym
		}
	}
	proto.pageHandlers = {
		'zakon.rada.gov.ua': function(parentTag){
			//debugger
			if(parentTag.nodeName!=='P'){
				parentTag = parentTag.parentNode
			}

			desc(parentTag.nodeName, 'parentTag.nodeName')
			var anchor = {}
			var anchorTag 
			
			for (var node of parentTag.childNodes){
				desc(node.nodeName, 'node.nodeName')
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
		},
		'default': function(tag){
			let anchor = {}
			anchor.id = dom.getTagDOM_TreeIndex(tag)
			anchor.data = {}
			anchor.data.anchorName = anchor.id.join(' ')
			anchor.data.anchorText = tag.innerText 
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
			var key
				if (parsedChunk.stringPart.length>3){
					console.log('parsedChunk:',parsedChunk)
					key = proto.dataTreeStringMap.processIrregulerStringPart(
						parsedChunk.numberPart)

				}
				else {
					key = proto.dataTreeStringMap[parsedChunk.stringPart]
				}

			console.log('key',key)
			dataTreeElements += key + '.' + parsedChunk.numberPart+' '
		})
		console.log('dataTreeElements', dataTreeElements)
		return dataTreeElements.trim()
	}
	proto.initNewAnchor = function(eventTag){
		console.log('eventTag: ', eventTag)
		let anchorTag = this.getAnchorTagData(eventTag)
		
            this.add(anchorTag.id, anchorTag.data)
            this.initAnchor(anchorTag.id, anchorTag.data)

	}
	proto.findAnchor = function(indicesArray, rootTag){

    let anchorTag = indicesArray.reduceRight((acc, current)=>{
        
        //console.log(rootTag)
        let currentTag = rootTag.children[current]
        rootTag = currentTag
        //console.log(rootTag)
        return currentTag
    },null)
    
    return anchorTag
}
	if (proto.pageHandlers[window.location.hostname]){
		proto.getAnchorTagData = function(parentTag){
			return this.pageHandlers[window.location.hostname](parentTag)
		}
		proto.goToAnchor = function(anchorTag){
			var tag = document.getElementsByName(anchorTag.id)[0].parentNode
			tag.scrollIntoView({ block: "center", behavior: "smooth" })
			dom.tempStyleChange(tag, 'backgroundColor', 'cyan', 2000)
		}
	}
	else {
		proto.getAnchorTagData = function(rootTag){
			return this.pageHandlers['default'](rootTag)
		}
		proto.goToAnchor = function(anchorTag){
			console.log('anchorTag.id:', anchorTag.id)
			let id = anchorTag.id.split(',')
			console.log('id:', id)
			let tag = proto.findAnchor(id, document.body)
			//var tag = document.getElementsByName(anchorTag.id)[0].parentNode
			
			tag.scrollIntoView({ block: "center", behavior: "smooth" })
			dom.tempStyleChange(tag, 'backgroundColor', 'cyan', 2000)
	}
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
    	var props = ['top', 'left','right', 
    		//'minWidth', 'minHeight', 'height',
    		'width', 'maxWidth', 'maxHeight']
    	props.forEach((option)=>{
    		anchors.options.pageElement[option] 
    			= window.getComputedStyle(anchors.pageElement)[option]
    		//desc(anchors.options.pageElement[option], 'self.options.pageElement[option]')
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
	desc(savedAnchors, 'savedAnchors')
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
        		anchors.options.pageElement.minWidth = '180px'
        		anchors.options.pageElement.minHeight = '100px'
        		//anchors.options.pageElement.maxWidth = document.documentElement.clientWidth+'px'

        	})
		}
		//else {anchors.options = undefined}

	anchors.entries = new Map()//{}
	if (savedAnchors.entries){
        	/*Object.keys(savedAnchors.entries).forEach((entryId)=>{
            	anchors.entries.set(entryId, savedAnchors.entries[entryId])
            	//anchors.add(entryId, savedAnchors.entries[entryId])
        	})*/
    console.log('442')
    console.log(savedAnchors.entries)
        savedAnchors.entries.forEach((entry)=>{
        	console.log('444')
        	console.log(entry[0], entry[1])
            	anchors.entries.set(entry[0], entry[1])
            	//anchors.add(entryId, savedAnchors.entries[entryId])
        })


    	}
    	else {
    		anchors.noDisplay = true
    		document.body.addEventListener('click', showNoDisplayedAnchorsPageElement)
    	}
    	console.log('454')
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
