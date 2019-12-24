let Parser = require('rss-parser');
let parser = new Parser();
var htmlParser = require('html-dom-parser');
const LGA = require('../model/LGA');

const processDescription = (description) => {
  const sections = description.split('\n')
  sections.pop();
  const LGAs = []
  sections.forEach((section) => {
    const parsedSection = htmlParser(section)
    const lga = {}
    const label = parsedSection[0].children[0].children[0].data
    const value = parsedSection[0].children[0].children[0].parent.next.data.trim()
    lga[label] = value;
    LGAs.push(lga)
  })
  return processLGA(LGAs)
}

const processLGA = (lgas) => {
  let regions, fireBanStatus, modified, startDate, endDate = undefined;
  lgas.forEach((topic) => {
    switch(Object.keys(topic)[0]){
      case 'Local Government Area:':
        regions = topic["Local Government Area:"].split(", ")
        break
      case 'Fire Bans:':
        const regex = RegExp('no');
        fireBanStatus = !regex.test(topic['Fire Bans:'])
        break
      case 'Modified:':
        modified = topic['Modified:']
        break
      case 'Start Date:':
        startDate = topic['Start Date:']
        break
      case 'End Date:':
        endDate = topic['End Date:']
        break
    }
  })
  return { regions, fireBanStatus, modified, startDate, endDate }
}

exports.getRuralfire = async (req, res, next ) => {
  LGA.deleteMany({}, (err)=>{
    if(err){
      console.log(err)
      res.send("Flush Error")
    }
  })
  let feed = await parser.parseURL('https://www.ruralfire.qld.gov.au/BushFire_Safety/Neighbourhood-Safer-Places/lgas/_layouts/15/listfeed.aspx?List=a4f237e1-b263-4062-a8e2-82774f87f01d&View=a0a7270f-6252-422c-96f2-d7088ae16ffe');
  const items = feed.items
  items.forEach((item) => {
    const author = item.author
    const publishDate = item.pubDate
    const description = item.content
    const { regions, fireBanStatus, modified, startDate, endDate } = processDescription(description)
    regions.forEach((region) => {
      LGA.create({
        name: region ? region : undefined,
        author: author ? author : undefined,
        fireBanStatus: fireBanStatus, 
        startDate: startDate ? startDate : undefined, 
        endDate: endDate ? endDate : undefined, 
        publishDate: publishDate ? publishDate : undefined,
        modifiedDate: modified ? modified : undefined
      })
    })
  })
  res.send("LGA information retrieved")
}
