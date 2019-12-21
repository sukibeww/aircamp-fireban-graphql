const graphql = require('graphql');
const _ = require('lodash');
const CFA = require('../model/CFA');
const RegionCFA = require('../model/RegionCFA')
const DistrictRSA = require('../model/DistrictRSA')

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLBoolean,
    GraphQLList,
    GraphQLInt
} = graphql;

const CFAType = new GraphQLObjectType({
    name: 'CFA',
    fields: () => ({
        id: {type: GraphQLID}, 
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        contentSnippet: {type: GraphQLString},
        guid: {type: GraphQLString},
        totalFireBanStatus: {type: GraphQLBoolean},
        regions: {
          type: new GraphQLList(RegionCFAType),
          resolve(parent, args){
            return RegionCFA.find({_cfa: parent._id})
          }
        }
    })
});

const RegionCFAType = new GraphQLObjectType({
  name: 'RegionCFA',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    firebanStatus: {type: GraphQLString},
    fireDangerRating : {type: GraphQLString},
    _cfa: {
      type: CFAType,  
      resolve(parent, args){
        return CFA.findById(parent._cfa)
      }
    }
  })
})

const DistrictRSAType = new GraphQLObjectType({
  name: 'DisctrictRSA',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString}, 
    regionNumber: {type: GraphQLInt},
    councils: {type: GraphQLList(GraphQLString)},
    dangerLevelToday: {type: GraphQLString},
    dangerLevelTomorrow: {type: GraphQLString},
    fireBanToday: {type: GraphQLBoolean},
    fireBanTomorrow: {type: GraphQLBoolean}
  })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        cfaById: {
          type: CFAType,
          args: {id: {type: GraphQLID}},
          resolve(parent, args){
              return CFA.findById(args.id)
          }
        },
        cfas: {
          type: new GraphQLList(CFAType),
          resolve(parent, args){
            return CFA.find({});
          }
        },
        regionByName: {
          type: new GraphQLList(RegionCFAType),
          args: {name: {type: GraphQLString}},
          resolve(parent, args){
            return RegionCFA.find({name : args.name})
          }
        },
        regionById: {
          type: RegionCFAType,
          args: {id: {type: GraphQLID}},
          resolve(parent, args){
            return RegionCFA.findById(args.id)
          }
        },
        districts: {
          type: new GraphQLList(DistrictRSAType),
          resolve(parent, args){
            return DistrictRSA.find({})
          }
        },
        districtByName: {
          type: DistrictRSAType,
          args: {name: {type: GraphQLString}},
          resolve(parent, args){
            return DistrictRSA.findOne({name: args.name})
          }
        },
        districtById: {
          type: DistrictRSAType,
          args: {id: {type: GraphQLID}},
          resolve(parent, args){
            return DistrictRSA.findById(args.id)
          }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});