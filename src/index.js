const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
    Query: {
        info: () => `This is de API of a Hackernews Clone`,
        feed: (root, args, context, info) => {
            return context.db.query.links({}, info)
        },
    },
    Mutation: {
        post: (root, args, context, info) => {
            return context.db.mutation.createLink({
                data: {
                    url: args.url,
                    description: args.description,
                },
            }, info)
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: 'https://us1.prisma.sh/melissa-ramirez-af6c39/database/dev',
            secret: 'mysecret123',
            debug: true,
        }),
    }),
})
server.start(() => console.log(`Sever is running on http://localhost:4000`))