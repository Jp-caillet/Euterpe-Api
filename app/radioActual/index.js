// Dependencies
const mongoose = require('mongoose')
const fetchVideoInfo = require('youtube-info')


module.exports = class Create {
  constructor (app) {
    this.app = app
    this.run()
  }
  

  /**
   * Middleware
   */
 async middleware () {
      try {
        // Save 
        await mongoose.connect('mongodb://localhost:27017/Etherpe', { useNewUrlParser: true })
        this.db = await mongoose.connection
        const result  = await this.db.collection('musics').find( { "pass.current": true , "ended": {"$lte": new Date()}  } ).toArray()
        
        for (let i = result.length - 1; i >= 0; i--) {
          
          const newSong = await this.db.collection('radios').findOne(
             { musics: 
                { $elemMatch : 
                   { 
                     id:  result[i]._id
                   } 
                } 
            }       
          )
           
          for (let j = newSong.musics.length - 1; j >= 0; j--) {

            if(newSong.musics[j].id.equals(result[i]._id) ){
                
              if(j == newSong.musics.length-1){
                const tutu =  await this.db.collection('musics').findOne( { "_id" : newSong.musics[0].id })
                const dateToEndInSec = new Date()
                const sec = (dateToEndInSec.getTime()/1000) + tutu.duration 
                const dateToEnd = new Date(sec*1000)

                const updateS = await this.db.collection('musics').findOneAndUpdate(
            { "_id" : tutu._id },
            {  $set: {"pass.current" : true , "started": new Date(), "ended": dateToEnd }  }
          ) 
              }else{
                const tutu =  await this.db.collection('musics').findOne( { "_id" : newSong.musics[j+1].id })
                const dateToEndInSec = new Date()
                const sec = (dateToEndInSec.getTime()/1000) + tutu.duration 
                const dateToEnd = new Date(sec*1000)

                const updateS = await this.db.collection('musics').findOneAndUpdate(
            { "_id" : tutu._id },
            {  $set: {"pass.current" : true , "started": new Date(), "ended": dateToEnd }  }
          )
              }
            }
            
          }
          
            const update = await this.db.collection('musics').findOneAndUpdate(
            { "_id" : result[i]._id },
            {  $set: {"pass.current" : false }  }
          )
          
        }

      }catch (e) {
        console.log(e)
        
      }
}
  /**
   * Run
   */
  run () {
    this.middleware()
  }
}