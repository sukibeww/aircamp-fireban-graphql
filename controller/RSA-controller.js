let Parser = require('rss-parser');
let parser = new Parser();

exports.getRSA = async (req, res, next ) => {
  // let feed = await parser.parseURL('http://www.rfs.nsw.gov.au/feeds/fdrToban.xml');
  // console.log(feed.items)
  res.send("test");
}