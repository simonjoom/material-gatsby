const path = require("path");
const _ = require("lodash");
const fs = require("fs-extra");
const moment = require("moment");
const crypto = require("crypto");
const siteConfig = require("./data/SiteConfig");
const config = require("./src/config");
const router = config.router;
require("babel-polyfill");

const arraymenu = [
  "/",
  "/about",
  "/jumpsuit",
  "/concept",
  "/contact",
  "/hotels"
];
const arraygallery = ["/", "/about", "/concept"];

const postNodes = [];
let didRunAlready = false;
let absoluteComponentPath;

exports.onPreInit = ({ store }, { component }) => {
  const defaultLayoutComponentPath = `src/layouts/index`;
  if (!component) {
    // Default to `src/layouts/index.[js|jsx]` for drop-in replacement of v1 layouts
    component = path.join(
      store.getState().program.directory,
      defaultLayoutComponentPath
    );
  }

  if (didRunAlready) {
    throw new Error(
      `You can only have single instance of gatsby-plugin-layout in your gatsby-config.js`
    );
  }

  didRunAlready = true;
  absoluteComponentPath = component;
};

exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        GATSBY_LAYOUT_COMPONENT_PATH: JSON.stringify(absoluteComponentPath)
      })
    ]
  });
};

function addSiblingNodes(createNodeField) {
  postNodes.sort(
    ({ frontmatter: { date: date1 } }, { frontmatter: { date: date2 } }) => {
      const dateA = moment(date1, siteConfig.dateFromFormat);
      const dateB = moment(date2, siteConfig.dateFromFormat);

      if (dateA.isBefore(dateB)) return 1;

      if (dateB.isBefore(dateA)) return -1;

      return 0;
    }
  );
  for (let i = 0; i < postNodes.length; i += 1) {
    const nextID = i + 1 < postNodes.length ? i + 1 : 0;
    const prevID = i - 1 > 0 ? i - 1 : postNodes.length - 1;
    const currNode = postNodes[i];
    const nextNode = postNodes[nextID];
    const prevNode = postNodes[prevID];
    createNodeField({
      node: currNode,
      name: "nextTitle",
      value: nextNode.frontmatter.title
    });
    createNodeField({
      node: currNode,
      name: "nextSlug",
      value: nextNode.fields.slug
    });
    createNodeField({
      node: currNode,
      name: "prevTitle",
      value: prevNode.frontmatter.title
    });
    createNodeField({
      node: currNode,
      name: "prevSlug",
      value: prevNode.fields.slug
    });
  }
}

exports.onCreateNode = async ({
  node,
  actions,
  loadNodeContent,
  getNode,
  createNodeId
}) => {
  const { createNode, createNodeField, createParentChildLink } = actions;
  const {
    internal: { mediaType },
    sourceInstanceName
  } = node;
  let slug;

  if (
    node.internal.type === `File` &&
    sourceInstanceName === `locale` &&
    mediaType === `application/json`
  ) {
    const content = await loadNodeContent(node);
    const data = JSON.stringify(JSON.parse(content), undefined, "");
    const localeNode = {
      id: createNodeId(`${node.id} >>> Locale`),
      children: [],
      parent: node.id,
      internal: { content, type: `Locale` },
      lng: node.relativeDirectory,
      ns: node.name,
      data
    };
    //console.log("namespace",node.name)
    localeNode.fileAbsolutePath = node.absolutePath;
    localeNode.internal.contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(localeNode))
      .digest(`hex`);

    createNode(localeNode);
    createParentChildLink({ parent: node, child: localeNode });
  }
  if (
    node.internal.type === `File` &&
    sourceInstanceName === `content` &&
    mediaType === `text/markdown`
  ) {
    const [type, lng, dir] = node.relativeDirectory.split(`/`);
    //console.log("trace", lng, type, dir);
    //const name = dir.substr(dir.indexOf(` `) + 1, dir.length)
    // const prefix = lng === config.defaultLocale ? `` : `/${lng}`
    createNodeField({ node, name: `lng`, value: lng });
    // createNodeField({ node, name: `slug`, value: slug })
    createNodeField({ node, name: `type`, value: type });
  }

  if (node.internal.type === "MarkdownRemark") {
    const fileNode = getNode(node.parent);
    const {
      fields: { lng, type }
    } = fileNode;
    // console.log("MarkdownRemark", lng, type);

    const parsedFilePath = path.parse(fileNode.relativePath);
    if (
      Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, "title")
    ) {
      slug = `/${_.kebabCase(node.frontmatter.title)}`;
    } else if (parsedFilePath.name !== "index" && parsedFilePath.dir !== "") {
      slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
    } else if (parsedFilePath.dir === "") {
      slug = `/${parsedFilePath.name}/`;
    } else {
      slug = `/${parsedFilePath.dir}/`;
    }

    if (Object.prototype.hasOwnProperty.call(node, "frontmatter")) {
      if (Object.prototype.hasOwnProperty.call(node.frontmatter, "slug"))
        slug = `/${_.kebabCase(node.frontmatter.slug)}`;
      if (Object.prototype.hasOwnProperty.call(node.frontmatter, "date")) {
        const date = moment(node.frontmatter.date, siteConfig.dateFromFormat);
        if (!date.isValid)
          console.warn(`WARNING: Invalid date.`, node.frontmatter);

        createNodeField({
          node,
          name: "date",
          value: date.toISOString()
        });
      }
    }

    let slugfin;
    if (router[slug]) slugfin = router[slug][lng];

    if (type === "instructor")
      slugfin = slugfin + _.kebabCase(node.frontmatter.title) + "/";

    if (!slugfin) {
      slugfin = slug;
    }

    //console.log("pages", slug);
    if (type === "pages") {
      createNodeField({
        node,
        name: `inmenu`,
        value: arraymenu.includes(slug)
      });

      createNodeField({
        node,
        name: `carousel`,
        value: arraygallery.includes(slug)
      });
    }

    createNodeField({ node, name: `lng`, value: lng });
    createNodeField({ node, name: `type`, value: type });
    createNodeField({ node, name: "slugbase", value: slug });
    createNodeField({ node, name: "slug", value: slugfin });
    if (type !== "pages") postNodes.push(node);
  }
};

exports.setFieldsOnGraphQLNodeType = ({ type, actions }) => {
  // console.log("setFieldsOnGraphQLNodeType", type);
  const { name } = type;
  const { createNodeField } = actions;
  if (name === "MarkdownRemark") {
    addSiblingNodes(createNodeField);
  }
};
const MarkdownQueries = `
  {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          id
          fileAbsolutePath
          frontmatter {
            title
            deps
            cover
            date
            category
            tags
          }
          fields {
            lng
            slugbase
            slug
            inmenu
            carousel
            type
          }
        }
      }
    }
  } 
`;

const filesArrayCache = [];
const QueryFiles = depsfiles => `
{
  allFile(
    filter: { 
      absolutePath:{regex:"\/assets\/\.\*\(${depsfiles}\)\\\\.\(jpg\$|png\$\)\/"}
    }
    )
    {
      edges {
        node {
      id
      absolutePath
      childImageSharp {
        id
        fluid(maxWidth: 1300) {
          tracedSVG
          aspectRatio
          src
          srcSet
          sizes
          srcWebp
          srcSetWebp
          originalName
        }
      }
    }
  }
}
}`;
let arraydepfiles = [];
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
let MarkdownQueriesCache = null;
exports.createPages = ({ graphql, actions }) => {
  const { createPage, deleteNode } = actions;

  // return new Promise((resolve, reject) => {
  const pagePage = path.resolve("src/templates/page.jsx");
  const postPage = path.resolve("src/templates/post.jsx");
  const instructorPage = path.resolve("src/templates/instructor.jsx");
  const tagPage = path.resolve("src/templates/tag.jsx");
  const categoryPage = path.resolve("src/templates/category.jsx");

  return new Promise(async (resolve, reject) => {
    if (!MarkdownQueriesCache) {
      MarkdownQueriesCache = await graphql(MarkdownQueries);
    }
    //.then(result => {
    if (MarkdownQueriesCache.errors) {
      /* eslint no-console: "off" */
      console.log(result.errors);
      reject(result.errors);
    }
    let tagSets = [];
    let categorySets = [];
    let langs = [];
    // const tagSet = new Set();
    // const categorySet = new Set();

    await asyncForEach(
      MarkdownQueriesCache.data.allMarkdownRemark.edges,
      async ({ node }) => {
        const lng = node.fields.lng;
        if (!tagSets[lng]) tagSets[lng] = new Set();
        if (!categorySets[lng]) categorySets[lng] = new Set();
        if (!langs[lng]) langs.push(lng);
        let route = Object.assign({}, router[node.fields.slugbase]);
        if (!route || (router[node.fields.slug] && node.fields.slug !== "/")) {
          console.warn(
            "routepages not defined from ",
            node.fields.slugbase,
            node.fields.slug
          );
        }
        if (node.fields.type == "instructor") {
          route.fr = route.fr + _.kebabCase(node.frontmatter.title) + "/";
          route.en = route.en + _.kebabCase(node.frontmatter.title) + "/";
          route.ru = route.ru + _.kebabCase(node.frontmatter.title) + "/";
          route.uk = route.uk + _.kebabCase(node.frontmatter.title) + "/";
          route.pt = route.pt + _.kebabCase(node.frontmatter.title) + "/";
          route.ch = route.ch + _.kebabCase(node.frontmatter.title) + "/";
        }

        let depsfiles = node.frontmatter.deps
          ? node.frontmatter.deps
          : "mainpage";

        const next =
          node.frontmatter && node.frontmatter.cover
            ? node.frontmatter.cover
                .replace(/(.jpg|.jpeg|.png)/g, "")
                .split(",")
            : [];
        arraydepfiles = Array.from(new Set(arraydepfiles.concat(next)));

        const extra = next.join("|");

        console.log(depsfiles, node.frontmatter.cover);
        depsfiles = extra === "" ? depsfiles : depsfiles + "|" + extra;

        const myquery = QueryFiles(depsfiles);
        if (!filesArrayCache[depsfiles]) {
          const {
            data: {
              allFile: { edges: filedeps }
            }
          } = await graphql(myquery);
          filesArrayCache[depsfiles] = filedeps;
        }
        const files = filesArrayCache[depsfiles];

        console.log(files);
        switch (node.fields.type) {
          case "post":
          case "instructor":
            if (node.frontmatter.tags) {
              node.frontmatter.tags.forEach(tag => {
                tagSets[lng].add(tag);
              });
            }

            if (node.frontmatter.category) {
              categorySets[lng].add(node.frontmatter.category);
            }

            createPage({
              path: node.fields.slug,
              component: node.fields.type == "post" ? postPage : instructorPage,
              context: {
                route,
                files,
                id: node.id,
                ...node.fields
              }
            });
            break;
          case "pages":
            route = router[node.fields.slugbase];
            if (
              !route ||
              (router[node.fields.slug] && node.fields.slug !== "/")
            ) {
              return;
            }
            createPage({
              path: node.fields.slug,
              component: pagePage,
              context: {
                route,
                files,
                id: node.id,
                ...node.fields
              }
            });
            break;
          default:
            console.log("????");
            break;
        }

        langs.forEach(lg => {
          const tagList = Array.from(tagSets[lg]);
          tagList.forEach(tag => {
            createPage({
              path: `/tags_${lg}/${_.kebabCase(tag)}/`,
              component: tagPage,
              context: {
                tag,
                lng: lg
              }
            });
          });
          const categoryList = Array.from(categorySets[lg]);
          categoryList.forEach(category => {
            createPage({
              path: `/categories_${lg}/${_.kebabCase(category)}/`,
              component: categoryPage,
              context: {
                category,
                lng: lg
              }
            });
            // });
            // });
          });
        });
      }
    );
    resolve();
  });
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  const route = router[page.path];
  if (!route) {
    console.warn("no route", page.path);
  }

  const { locales, defaultLocale } = config;
  let oldPage = Object.assign({}, page);
  const newPage = {};
  await asyncForEach(locales, async locale => {
    if (!route) {
      if (oldPage) deletePage(oldPage);
      oldPage = null;
      newPage.component = page.component;
      newPage.path = page.path + "_" + locale;
      newPage.context = {
        lng: locale,
        slug: newPage.path,
        route: {
          fr: page.path + "_fr",
          en: page.path + "_en",
          pt: page.path + "_pt",
          ru: page.path + "_ru",
          uk: page.path + "_uk",
          ch: page.path + "_ch"
        }
      };
      createPage(newPage);
    } else if (route[locale]) {
      console.log("oncreate", page.path, arraydepfiles);
      const depsfiles = arraydepfiles.join("|");
      const myquery = QueryFiles(depsfiles);
      if (!filesArrayCache[depsfiles]) {
        const _require2 = require(`gatsby/dist/redux`);
        const store = _require2.store;
        const schema = store.getState().schema;
        const graphqlo = require(`graphql`).graphql;
        const {
          data: {
            allFile: { edges: filedeps }
          }
        } = await graphqlo(schema, myquery, {}, {}, {});
        console.log("filesArrayCache", filedeps);
        filesArrayCache[depsfiles] = filedeps;
      }
      const files = filesArrayCache[depsfiles];

      if (oldPage) deletePage(oldPage);
      oldPage = null;
      newPage.component = page.component;
      newPage.path = route[locale];
      newPage.context = {
        lng: locale,
        slug: newPage.path,
        files,
        route
      };
      createPage(newPage);
    }
  });
};

exports.onPostBootstrap = () => {
  console.log("Copying locales");
  fs.copySync(
    path.join(__dirname, "/src/locales"),
    path.join(__dirname, "/public/locales")
  );
};

exports.onPostBuild = function(args, options) {
  var filename = "sw.js";

  var read = fs.createReadStream(path.join(__dirname, "sw.js"));
  var write = fs.createWriteStream(path.resolve("public", filename));

  return new Promise(function(resolve, reject) {
    var stream = read.pipe(write);

    stream.once("finish", resolve);
    stream.once("error", reject);
  });
};
