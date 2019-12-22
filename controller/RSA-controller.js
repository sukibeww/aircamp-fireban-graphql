const axios = require('axios');
const parseString = require('xml2js').parseString;
const DistrictRSA = require('../model/DistrictRSA');

const fireBanBooleanConverter = (StringBool) => {
  return !(/No/).test(StringBool)
}

exports.getRSA = async (req, res, next ) => {
  DistrictRSA.deleteMany({}, (err)=>{
    if(err){
      console.log(err)
      res.send("Flush Error")
    }
  })
  axios.get('http://www.rfs.nsw.gov.au/feeds/fdrToban.xml')
  .then((response)=>{
    const xml = response.data
    parseString(xml, (err, result) => {
      if(err){
        console.log(err)
      }
      else{
        const districts = result.FireDangerMap.District
        //last item does not mean anything
        districts.pop();
        districts.map((district) => {
          DistrictRSA.create({
            name: district.Name ? district.Name[0] : undefined,
            regionNumber: district.RegionNumber ? Number(district.RegionNumber[0]) : undefined,
            councils: district.Councils ? district.Councils[0].split("; ") : undefined,
            dangerLevelToday: district.DangerLevelToday ? district.DangerLevelToday[0] : undefined,
            dangerLevelTomorrow: district.DangerLevelTomorrow ? district.DangerLevelTomorrow[0] : undefined,
            fireBanToday: district.FireBanToday ? fireBanBooleanConverter(district.FireBanToday[0]) : undefined ,
            fireBanTomorrow: district.FireBanTomorrow ? fireBanBooleanConverter(district.FireBanTomorrow[0]) : undefined
          })
        })
      }
    });
  })

  res.send("RSA information created")
}