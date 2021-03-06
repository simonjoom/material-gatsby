"use strict";

/**
 * Lets plugins implementing support for other compile-to-js add to the list
 * of "resolvable" file extensions. Gatsby supports `.js` and `.jsx` by default.
 * @returns {Array} array of extensions
 */
exports.resolvableExtensions = true;
/**
 * Tell plugins to add pages. This extension point is called only after the initial
 * sourcing and transformation of nodes plus creation of the GraphQL schema are
 * complete so you can query your data in order to create pages.
 *
 * See also [the documentation for the action `createPage`](/docs/actions/#createPage).
 * @example
 * exports.createPages = ({ graphql, actions }) => {
 *   const { createPage } = actions
 *   return new Promise((resolve, reject) => {
 *     const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)
 *     // Query for markdown nodes to use in creating pages.
 *     resolve(
 *       graphql(
 *         `
 *       {
 *         allMarkdownRemark(limit: 1000) {
 *           edges {
 *             node {
 *               fields {
 *                 slug
 *               }
 *             }
 *           }
 *         }
 *       }
 *     `
 *       ).then(result => {
 *         if (result.errors) {
 *           reject(result.errors)
 *         }
 *
 *         // Create blog post pages.
 *         result.data.allMarkdownRemark.edges.forEach(edge => {
 *             createPage({
 *               path: `${edge.node.fields.slug}`, // required
 *               component: blogPostTemplate,
 *               context: {
 *                 // Add optional context data. Data can be used as
 *                 // arguments to the page GraphQL query.
 *                 //
 *                 // The page "path" is always available as a GraphQL
 *                 // argument.
 *               },
 *             })
 *         })
 *
 *         return
 *       })
 *     )
 *   })
 * }
 * @returns {Array} array of extensions
 */

exports.createPages = true;
/**
 * Like `createPages` but for plugins who want to manage creating and removing
 * pages themselves in response to changes in data *not* managed by Gatsby.
 * Plugins implementing `createPages` will get called regularly to recompute
 * page information as Gatsby's data changes but those implementing
 * `createPagesStatefully` will not.
 *
 * An example of a plugin that uses this extension point is the plugin
 * [gatsby-plugin-page-creator](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-page-creator)
 * which monitors the `src/pages` directory for the adding and removal of JS
 * pages. As its source of truth, files in the pages directory, is not known by
 * Gatsby, it needs to keep its own state about its world to know when to
 * add and remove pages.
 */

exports.createPagesStatefully = true;
/**
 * Extension point to tell plugins to source nodes.
 *
 * See also the documentation for [`createNode`](/docs/actions/#createNode).
 * @example
 * exports.sourceNodes = ({ actions }) => {
 *   const { createNode } = actions
 *   // Create nodes here.
 * }
 */

exports.sourceNodes = true;
/**
 * Called when a new node is created. Plugins wishing to extend or
 * transform nodes created by other plugins should implement this API.
 *
 * See also the documentation for [`createNode`](/docs/actions/#createNode)
 * and [`createNodeField`](/docs/actions/#createNodeField)
 * @example
 * exports.onCreateNode = ({ node, actions }) => {
 *   const { createNode, createNodeField } = actions
 *   // Transform the new node here and create a new node or
 *   // create a new node field.
 * }
 */

exports.onCreateNode = true;
/**
 * Called when a new page is created. This extension API is useful
 * for programmatically manipulating pages created by other plugins e.g.
 * if you want paths without trailing slashes.
 *
 * See the guide [Creating and Modifying Pages](/docs/creating-and-modifying-pages/)
 * for more on this API.
 */

exports.onCreatePage = true;
/**
 * Called during the creation of the GraphQL schema. Allows plugins
 * to add new fields to the types created from data nodes. It will be called
 * separately for each type.
 *
 * This function should return an object in the shape of
 * [GraphQLFieldConfigMap](https://graphql.org/graphql-js/type/#graphqlobjecttype)
 * which will be appended to fields inferred by Gatsby from data nodes.
 *
 * *Note:* Import GraphQL types from `gatsby/graphql` and don't add the `graphql`
 * package to your project/plugin dependencies to avoid `Schema must
 * contain unique named types but contains multiple types named` errors.
 * `gatsby/graphql` exports all builtin GraphQL types as well as the `graphQLJSON`
 * type.
 *
 * Many transformer plugins use this to add fields that take arguments.
 *
 * * [`gatsby-transformer-remark`](/packages/gatsby-transformer-remark/)
 * adds an "excerpt" field where the user when writing their query can specify
 * how many characters to prune the markdown source to.
 * * [`gatsby-transformer-sharp`](/packages/gatsby-transformer-sharp/) exposes
 * many image transformation options as GraphQL fields.
 *
 * @param {object} $0
 * @param {object} $0.type Object containing `name` and `nodes`
 * @example
 * import { GraphQLString } from "gatsby/graphql"
 *
 * exports.setFieldsOnGraphQLNodeType = ({ type }) => {
 *   if (type.name === `File`) {
 *     return {
 *       newField: {
 *         type: GraphQLString,
 *         args: {
 *           myArgument: {
 *             type: GraphQLString,
 *          }
 *         }
 *         resolve: (source, fieldArgs) => {
 *           return `Id of this node is ${source.id}.
 *                   Field was called with argument: ${fieldArgs.myArgument}`
 *         }
 *       }
 *     }
 *   }
 *
 *   // by default return empty object
 *   return {}
 * }
 */

exports.setFieldsOnGraphQLNodeType = true;
/**
 * Ask compile-to-js plugins to process source to JavaScript so the query
 * runner can extract out GraphQL queries for running.
 */

exports.preprocessSource = true;
/**
 * Tell plugins with expensive "side effects" from queries to start running
 * those now. This is a soon-to-be-replaced API only currently in use by
 * `gatsby-plugin-sharp`.
 */

exports.generateSideEffects = true;
/**
 * Let plugins extend/mutate the site's Babel configuration.
 * This API will change before 2.0 as it needs still to be converted to use
 * Redux actions.
 */

exports.onCreateBabelConfig = true;
/**
 * Let plugins extend/mutate the site's webpack configuration.
 *
 * See also the documentation for [`setWebpackConfig`](/docs/actions/#setWebpackConfig).
 *
 * @param {object} $0
 * @param {'develop' | 'develop-html' | 'build-javascript' | 'build-html'} $0.stage The current build stage
 * @param {function(): object} $0.getConfig Returns the current webpack config
 * @param {object} $0.rules A set of preconfigured webpack config rules
 * @param {object} $0.loaders A set of preconfigured webpack config loaders
 * @param {object} $0.plugins A set of preconfigured webpack config plugins
 * @param {object} $0.actions
 * @example
 * exports.onCreateWebpackConfig = ({
 *  stage, getConfig, rules, loaders, actions
 * }) => {
 *   actions.setWebpackConfig({
 *     module: {
 *       rules: [
 *         {
 *           test: 'my-css',
 *           use: [loaders.style(), loaders.css()]
 *         },
 *       ],
 *     },
 *   });
 * }
 */

exports.onCreateWebpackConfig = true;
/**
 * The first API called during Gatsby execution, runs as soon as plugins are loaded, before cache initialization and bootstrap preparation.
 */

exports.onPreInit = true;
/**
 * Called once Gatsby has initialized itself and is ready to bootstrap your site.
 */

exports.onPreBootstrap = true;
/**
 * Called at the end of the bootstrap process after all other extension APIs have been called.
 */

exports.onPostBootstrap = true;
/**
 * The first extension point called during the build process. Called after the bootstrap has completed but before the build steps start.
 */

exports.onPreBuild = true;
/**
 * The last extension point called after all other parts of the build process
 * are complete.
 */

exports.onPostBuild = true;
/**
 * Run before GraphQL queries/fragments are extracted from JavaScript files. Useful for plugins
 * to add more JavaScript files with queries/fragments e.g. from node_modules.
 *
 * See gatsby-transformer-remark and gatsby-source-contentful for examples.
 */

exports.onPreExtractQueries = true;
//# sourceMappingURL=api-node-docs.js.map