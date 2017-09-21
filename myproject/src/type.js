import {
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInt,
}from 'graphql';

import * as tables from './tables';
import * as loaders from './loader';

export const NodeInterface = new GraphQLInterfaceType({
    name: 'Node',
    fields:{
        id:{
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    resolveType:(source) => {
        if(source.__tableName === tables.users.getName()){
            return UserType;
        }
        return PostType;
    },
});

const resolveId = (source) => {
    return tables.dbIdToNodeId(source.id, source.__tableName);
};

// export const UserType = new GraphQLObjectType({
//     name: 'User',
//     interfaces: [NodeInterface],
//     // fields:{
//     //     id: {
//     //         type: new GraphQLNonNull(GraphQLID),
//     //         resolve:resolveId
//     //     },
//     //     name: {
//     //         type: new GraphQLNonNull(GraphQLString)
//     //     },
//     //     about: {
//     //         type: new GraphQLNonNull(GraphQLString)
//     //     },
//     //     friends: {
//     //         type: new GraphQLList(GraphQLID),
//     //         resolve(source) {
//     //             if(source.__friends){//性能优化代码
//     //                 console.log('one')
//     //                 return source.__friends.map((row) => {
//     //                     return tables.dbIdToNodeId(row.user_id_b,row.__tableName);
//     //                 });
//     //             }
//     //             return loaders.getFriendIdsForUser(source).then((rows) => {
//     //                 console.log('two')
//     //                 return rows.map((row) => {
//     //                     return tables.dbIdToNodeId(row.user_id_b, row.__tableName);
//     //                 })
//     //             })
//     //         }
//     //     }
//     // }


//     fields:() =>{//lists使用
//         return{
//             id: {
//                 type: new GraphQLNonNull(GraphQLID),
//                 resolve:resolveId
//             },
//             name: {
//                 type: new GraphQLNonNull(GraphQLString)
//             },
//             about: {
//                 type: new GraphQLNonNull(GraphQLString)
//             },
//             friends: {
//                 type: new GraphQLList(UserType),
//                 resolve(source) {
//                     return loaders.getFriendIdsForUser(source).then((rows) => {
//                         const promises = rows.map((row) => {
//                             const friendNodeId = tables.dbIdToNodeId(row.user_id_b, row.__tableName);
    
//                             return loaders.getNodeById(friendNodeId);
//                         });
//                         return Promise.all(promises);
//                     });
//                 }
//             }
//         }
        
//     }
// });



export const PostType = new GraphQLObjectType({
    name:'Post',
    interfaces:[ NodeInterface ],
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: resolveId
        },
        createdAt: {
            type : new GraphQLNonNull(GraphQLString)
        },
        body: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

const PageInfoType = new GraphQLObjectType({
    name: 'PageInfo',
    fields: {
        hasNextPage: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        hasPreviousPage: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        startCursor: {
            type: GraphQLString,
        },
        endCursor: {
            type: GraphQLString,
        }
    }
});

const PostEdgeType = new GraphQLObjectType({
    name: 'PostEdge',
    fields: () => {
        return{
            cursor: {
                type: new GraphQLNonNull(GraphQLString)
            },
            node: {
                type: new GraphQLNonNull(PostType)
            }
        }
    }
});

const PostsConnectionType = new GraphQLObjectType({
    name: 'PostsConnection',
    fields: {
        pageInfo: {
            type: new GraphQLNonNull(PageInfoType)
        },
        edges: {
            type: new GraphQLList(PostEdgeType)
        }
    }
});



export const UserType = new GraphQLObjectType({//分页的使用
    name: 'User',
    interfaces: [NodeInterface],

    fields:() =>{//lists使用
        return{
            id: {
                type: new GraphQLNonNull(GraphQLID),
                resolve:resolveId
            },
            name: {
                type: new GraphQLNonNull(GraphQLString)
            },
            about: {
                type: new GraphQLNonNull(GraphQLString)
            },
            friends: {
                type: new GraphQLList(UserType),
                resolve(source) {
                    return loaders.getFriendIdsForUser(source).then((rows) => {
                        const promises = rows.map((row) => {
                            const friendNodeId = tables.dbIdToNodeId(row.user_id_b, row.__tableName);
    
                            return loaders.getNodeById(friendNodeId);
                        });
                        return Promise.all(promises);
                    });
                }
            },
            posts: {
                type: PostsConnectionType,
                args: {
                    after: {
                        type:GraphQLString
                    },
                    first: {
                        type: GraphQLInt
                    },
                },
                resolve(source, args, context) {
                    return loaders.getPostIdsForUser(source, args, context).then(({rows, pageInfo}) => {
                        const promises = rows.map((row) => {
                            const postNodeId = tables.dbIdToNodeId(row.id, row.__tableName);
                            return loaders.getNodeById(postNodeId).then((node) => {
                                const edge = {
                                    node,
                                    cursor: row.__cursor,
                                };
                                return edge;
                            });
                        });
        
                        return Promise.all(promises).then((edges) => {
                            return{
                                edges,
                                pageInfo
                            }
                        });
                    })
                }
            }
        }
    },
});