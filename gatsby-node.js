const path = require("path");
const _ = require("lodash");
const fs = require("fs-extra");
const moment = require("moment");
const crypto = require("crypto");
const siteConfig = require("./data/SiteConfig");
const config = require("./src/config");
const router = config.router;
require("babel-polyfill");

console.log(config)
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
    const contentDigest = crypto
      .createHash(`md5`)
      .update(data)
      .digest(`hex`);
    const localeNode = {
      id: `${node.id} >>> Locale`,
      children: [],
      parent: node.id,
      internal: { content, contentDigest, type: `Locale` },
      lng: node.relativeDirectory,
      ns: node.name,
      data
    };
    localeNode.fileAbsolutePath = node.absolutePath;
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

      console.log("pages", slug);
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

exports.createPages = ({ graphql, actions }) => {
  const { createPage, deleteNode } = actions;

  return new Promise((resolve, reject) => {
    const pagePage = path.resolve("src/templates/page.jsx");
    const postPage = path.resolve("src/templates/post.jsx");
    const instructorPage = path.resolve("src/templates/instructor.jsx");
    const tagPage = path.resolve("src/templates/tag.jsx");
    const categoryPage = path.resolve("src/templates/category.jsx");
    resolve(
      graphql(
        `
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
        `
      ).then(result => {
        if (result.errors) {
          /* eslint no-console: "off" */
          console.log(result.errors);
          reject(result.errors);
        }
        let tagSets = [];
        let categorySets = [];
        let langs = [];
        // const tagSet = new Set();
        // const categorySet = new Set();
        result.data.allMarkdownRemark.edges.forEach(({ node }) => {
          let lng = node.fields.lng;
          if (!tagSets[lng]) tagSets[lng] = new Set();
          if (!categorySets[lng]) categorySets[lng] = new Set();
          if (!langs[lng]) langs.push(lng);
          switch (node.fields.type) {
            case `post`:
            case `instructor`:
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
                component:
                  node.fields.type == "post" ? postPage : instructorPage,
                context: {
                  id: node.id,
                  ...node.fields
                }
              });
              break;
            case `pages`:
              const route = router[node.fields.slugbase];
              if (
                !route ||
                (router[node.fields.slug] && node.fields.slug !== "/")
              ) {
                console.warn("routepages not defined from ",node.fields.slugbase, node.fields.slug);
                return;
              }

              createPage({
                path: node.fields.slug,
                component: pagePage,
                context: {
                  route,
                  id: node.id,
                  ...node.fields
                }
              });
          }
        });

        langs.forEach(lng => {
          const tagList = Array.from(tagSets[lng]);
          tagList.forEach(tag => {
            createPage({
              path: `/tags_${lng}/${_.kebabCase(tag)}/`,
              component: tagPage,
              context: {
                tag,
                lng
              }
            });
          });
          const categoryList = Array.from(categorySets[lng]);
          categoryList.forEach(category => {
            createPage({
              path: `/categories_${lng}/${_.kebabCase(category)}/`,
              component: categoryPage,
              context: {
                category,
                lng
              }
            });
          });
        });
      })
    );
  });
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  const route = router[page.path];
  if (!route) {
    console.warn("no route", page.path);
    return;
  }

  const { locales, defaultLocale } = config;
  let oldPage = Object.assign({}, page);
  const newPage = {};
  locales.forEach(locale => {
    if (route[locale]) {
      if (oldPage) deletePage(oldPage);
      oldPage = null;

      newPage.component = page.component;
      newPage.path = route[locale];
      newPage.context = {
        lng: locale,
        slug: newPage.path,
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
  var filename = 'sw.js';

  var read = fs.createReadStream(path.join(__dirname, 'sw.js'))
  var write = fs.createWriteStream(path.resolve('public', filename));

  return new Promise(function(resolve, reject) {
    var stream = read.pipe(write);

    stream.once('finish', resolve);
    stream.once('error', reject);
  });
};