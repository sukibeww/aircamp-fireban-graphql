let Parser = require('rss-parser');
let parser = new Parser();
const CFA = require('../model/CFA')
const RegionCFA = require('../model/RegionCFA')

const processRegion = async (fireBanStatuses, fireDangerRatings, cfa) => {
  const regions = await fireBanStatuses.forEach( async (status) => {
    const regionInfo = status.split(": ")
    return await RegionCFA.create({
      _cfa : cfa,
      name: regionInfo[0],
      firebanStatus: regionInfo[1],
      fireDangerRating: fireDangerRatings[0].split(": ")[1]
    })
  })
  return regions;
}

const processContent = async (firebanInfo) => {
  let splitContent = firebanInfo.content.split("<p>")
  const cleanContent = splitContent.map((content) => {
    return content.replace("</p>", '');
  })
  cleanContent.shift();
  const totalFireBanStatus = await !(/is not currently a day of Total Fire Ban/).test(cleanContent[0])
  const fireBanStatuses = cleanContent[1].split('<br>')
  fireBanStatuses.pop()
  const fireDangerRatings = cleanContent[3].split('<br>')
  fireDangerRatings.pop()
  return {totalFireBanStatus, fireBanStatuses, fireDangerRatings }
}

exports.getCFA = async (req, res, next ) => {
  await CFA.deleteMany({}, (err) => {
    if(err){
      console.log(err)
      res.send("Flush error")
    }
  })
  await RegionCFA.deleteMany({}, (err) => {
    if(err){
      console.log(err)
      res.send("Flush error")
    }
  })
  let feed = await parser.parseURL('https://data.emergency.vic.gov.au/Show?pageId=getFDRTFBRSS');
  feed.items.forEach( async (item) => {
    const {totalFireBanStatus, fireBanStatuses, fireDangerRatings } = await processContent(item);
    const cfa = await new CFA({
      title: item.title,
      link: item.link,
      content: item.content,
      contentSnippet: item.contentSnippet,
      guid: item.guid,
      totalFireBanStatus: totalFireBanStatus,
      regions: undefined
    }, (err) => {
      if(err){
        console.log(err)
        res.send(err)
      }
    })
    //generate regions
    cfa.regions = await processRegion(fireBanStatuses, fireDangerRatings, cfa._id)
    cfa.save();
  })
  res.send("CFA information retrieved!")
}