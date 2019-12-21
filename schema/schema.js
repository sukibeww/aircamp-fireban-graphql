const graphql = require('graphql');
const _ = require('lodash');
const CFA = require('../model/CFA');
const RegionCFA = require('../model/RegionCFA')

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQL
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
    name: {type: GraphQLString},
    firebanStatus: {type: GraphQLString},
    fireDangerRating : {type: GraphQLString},
    _cfa: {
      type: CFAType,
      resolve(parent, args){
        return CFA.find({_id: parent._cfa})
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        cfa: {
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
          type: RegionCFAType,
          args: {name: {type: GraphQLString}},
          resolve(parent, args){
            return RegionCFA.find({name : args.name})
          }
        },
        regionById: {
          type: RegionCFAType,
          args: {id: {type: GraphQLID}},
          resolve(parent, args){
            return RegionCFA.find({_id : args.id})
          }
        },
    }
});

// const Mutation = new GraphQLObjectType({
//     name: 'Mutation',
//     fields: {
//         updateBook: {
//             type: BookType,
//             args: {
//                 id: {type: new GraphQLNonNull(GraphQLID)},
//                 name: {type: new GraphQLNonNull(GraphQLString)},
//                 genre: {type: new GraphQLNonNull(GraphQLString)},
//                 authorId: {type: new GraphQLNonNull(GraphQLID)}
//             },
//             resolve(parent, args){
//                 const updatedBook = Book.findByIdAndUpdate(args.id, args, (err) => {
//                     return err
//                 })
//                 return updatedBook;
//             }
//         },
//         deleteBook : {
//             type: BookType,
//             args: {id: {type:  new GraphQLNonNull(GraphQLID)}},
//             resolve(parent, args){
//                 const deletedBook = new Book({
//                     name: "Deleted",
//                     genre: "Deleted",
//                     authorId: "Deleted"
//                 });
//                 Book.findByIdAndRemove(args.id, (err) => {
//                     return err
//                 })
//                 return deletedBook;
//             }
//         },
//         addBook: {
//             type: BookType,
//             args: {
//                 name: {type: new GraphQLNonNull(GraphQLString)},
//                 genre: {type: new GraphQLNonNull(GraphQLString)},
//                 authorId: {type: new GraphQLNonNull(GraphQLID)}
//             },
//             resolve(parent, args){
//                 let book = new Book({
//                     name: args.name,
//                     genre: args.genre,
//                     authorId: args.authorId
//                 });
//                 return book.save();
//             }
//         }
//     }
// })

module.exports = new GraphQLSchema({
    query: RootQuery
});