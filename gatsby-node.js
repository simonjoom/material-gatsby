const path = require("path");
const _ = require("lodash");
const moment = require("moment");
const crypto = require("crypto");
const siteConfig = require("./data/SiteConfig");
require("babel-polyfill");

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

exports.onCreateNode = async ({ node, actions, loadNodeContent, getNode }) => {
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
    console.log("MarkdownRemark", lng, type);

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
    createNodeField({ node, name: `lng`, value: lng });
    createNodeField({ node, name: `type`, value: type });
    createNodeField({ node, name: "slug", value: slug });
    postNodes.push(node);
  }
};

exports.setFieldsOnGraphQLNodeType = ({ type, actions }) => {
  const { name } = type;
  const { createNodeField } = actions;
  if (name === "MarkdownRemark") {
    addSiblingNodes(createNodeField);
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const postPage = path.resolve("src/templates/post.jsx");
    const tagPage = path.resolve("src/templates/tag.jsx");
    const categoryPage = path.resolve("src/templates/category.jsx");
    resolve(
      graphql(
        `
          {
            allMarkdownRemark (
              sort: { order: DESC, fields: [frontmatter___date] }
              limit: 1000
            ) {
              edges {
                node {
                  fileAbsolutePath
                  frontmatter {
                    tags
                    category
                  }
                  fields {
                    lng
                    slug
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
          console.log(node.fields.type);
          let lng = node.fields.lng;
          if (!tagSets[lng]) tagSets[lng] = new Set();
          if (!categorySets[lng]) categorySets[lng] = new Set();
          if (!langs[lng]) langs.push(lng);
          switch (node.fields.type) {
            case `post`:
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
                component: postPage,
                context: node.fields
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

const router = {
  "/": {
    fr: "/fr/",
    en: "/"
  },
  "/about/": {
    fr: "/a-notre-sujet/",
    en: "/about/"
  }
};
const config = { locales: ["fr", "en", "pt", "ru", "uk"], defaultLocale: "en" };

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  const route = router[page.path];
  if (!route) {
    return;
  }

  const { locales, defaultLocale } = config;

  const oldPage = Object.assign({}, page);
  deletePage(oldPage);
  const newPage = {};
  locales.forEach(locale => {
    if (route[locale]) {
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
