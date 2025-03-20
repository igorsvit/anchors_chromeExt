'use strict'
import {desc, assay, mlog, olog} from '#mylib/devutils.js'
import {dom} from '#mylib/dom.js'
import {mediator} from '#mylib/mediator.js'

const ArrangerPrototype = (function createPrototype(){
	let proto = {}
	proto.initPageElement = function(){
		let arranger = this
		arranger.pageElement = dom.new('div', {id:'arranger-element'})
			let resizerGripsHTML = `<div id="left-resizer-grip" class="resizer-grip"></div>
        		<div id="bottom-resizer-grip" class="resizer-grip"></div>
        		<div id="right-resizer-grip" class="resizer-grip"></div>
        		<div id="top-resizer-grip" class="resizer-grip"></div>`
    	arranger.pageElement.insertAdjacentHTML(
					'afterbegin', resizerGripsHTML)
		console.log(arranger.pageElement)
	}
})()