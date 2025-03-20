var cachePrototype = {}
    cachePrototype.add = function(id, value){
        this.anchors[id] = value
        return this
    }

function Cache(data){
    var cache = {}
    if (data){
        Object.assign(cache, data)
    }
    else {
        cache = {
            anchors:{}
            renderInfo:{
                anchorsDivPosition: {}
            }
        }
    } 
    Object.setPrototypeOf(cache, cachePrototype)
    return cache
}




    /*cache.clearCache = function(property){
        if (property) {
            delete this.cache[property]
            //console.log(this.cache)
            return this
        }
        this.cache = {}
        return this
    }*/
/*    cache.saveCache = function(pageStorageQuery){
        console.log('pageStorageQuery: ', pageStorageQuery)
            //console.log({pageStorageQuery:this.cache})
        let entry = {}
        entry[pageStorageQuery] = this.cache
        console.log(entry)
        chrome.storage.sync.set(entry)
        //chrome.storage.sync.set({pageStorageQuery:this.cache})

    }
*/    
    /*cache.setSyncStorage = async function(){
        chrome.storage.sync.set()
    }*/

/*    cache.get = async function(query){
        let data = await chrome.storage.sync.get(query)
 
        if (!data[query]) {
            return Promise.reject(query +' Storage for this query is empty')
        }
        return Promise.resolve(data[query])
        if (data[query]) {
            return Promise.resolve(data[query])
        }
        throw new TypeError(query + ' failed: no ChromeStorage entry for the query');

    }*/

/*    cache.saveToCache = function(){



    }*/

//storageArea??, for ex. 'sync' or 'local'




//export {cache}

//tests:
var anchor = {"n50": {
            "anchorTitle": "ч.5 п.3 ст.9",
            "anchorText": "bla bla bla" 
        }}
var cache = new Cache()
cache.addAnchor = 

/*var storage = new ChromeStorage()
storage.cache.anchors = {'1':'anchor one', '2':'anchor two'}
console.log(storage.cache.anchors)
storage.cache.smth = {'www':'eee'}
console.log(storage.clearCache('anchors'))
console.log(storage.clearCache())*/