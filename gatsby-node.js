const path = require("path");
const _ = require("lodash");
const fs = require("fs-extra");
const moment = require("moment");
const crypto = require("crypto");
const siteConfig = require("./data/SiteConfig");
require("babel-polyfill");

const postNodes = [];
const router = {
  "/": {
    fr: "/fr/",
    en: "/",
    ru: "/ru/",
    uk: "/uk/",
    pt: "/pt/",
    cn: "/cn/"
  },
  "/blog/": {
    fr: "/fr/blog/",
    en: "/blog/",
    ru: "/ru/blog/",
    uk: "/uk/blog/",
    pt: "/pt/blog/",
    cn: "/cn/blog/"
  },
  "/concept": {
    fr: "/fr/concept",
    en: "/concept/",
    ru: "/ru/concept/",
    uk: "/uk/concept/",
    pt: "/pt/concept/",
    cn: "/cn/concept/"
  },
  "/contact": {
    fr: "/fr/contact",
    en: "/contact/",
    ru: "/ru/contact/",
    uk: "/uk/contact/",
    pt: "/pt/contact/",
    cn: "/cn/contact/"
  },
  "/instructor": {
    fr: "/fr/instructor/",
    en: "/instructor/",
    ru: "/ru/instructor/",
    uk: "/uk/instructor/",
    pt: "/pt/instructor/",
    cn: "/cn/instructor/"
  },
  "/hotels": {
    fr: "/fr/hotels/",
    en: "/hotels/",
    ru: "/ru/hotels/",
    uk: "/uk/hotels/",
    pt: "/pt/hotels/",
    cn: "/cn/hotels/"
  },
  "/jumpsuit": {
    fr: "/jumpsuit/fr/",
    en: "/jumpsuit/",
    ru: "/ru/jumpsuit/",
    uk: "/uk/jumpsuit/",
    pt: "/pt/jumpsuit/",
    cn: "/cn/jumpsuit/"
  }, 
  "/skipass": {
    fr: "/Articles/Forfait-de-ski/",
    en: "/Articles/SkiPass/",
    ru: "/Articles/Ски-пасс/",
    uk: "/Articles/Ски-пас/",
    pt: "/pt/Articles/SkiPass/",
    cn: "/cn/Articles/SkiPass/"
  },
  "/meribel": {
    fr: "/fr/Articles/Meribel/",
    en: "/en/Articles/Meribel/",
    ru: "/ru/Articles/Meribel/",
    uk: "/uk/Articles/Meribel/",
    pt: "/pt/Articles/Meribel/",
    cn: "/cn/Articles/Meribel/"
  },
  "/menuires": {
    fr: "/fr/Articles/Menuires/",
    en: "/en/Articles/Menuires/",
    ru: "/ru/Articles/Menuires/",
    uk: "/uk/Articles/Menuires/",
    pt: "/pt/Articles/Menuires/",
    cn: "/cn/Articles/Menuires/"
  },
  "/courchevel": {
    fr: "/fr/Articles/Courchevel/",
    en: "/en/Articles/Courchevel/",
    ru: "/ru/Articles/Courchevel/",
    uk: "/uk/Articles/Courchevel/",
    pt: "/pt/Articles/Courchevel/",
    cn: "/cn/Articles/Courchevel/"
  },
  "/valthorens": {
    fr: "/fr/Articles/Valthorens/",
    en: "/en/Articles/Valthorens/",
    ru: "/ru/Articles/Valthorens/",
    uk: "/uk/Articles/Valthorens/",
    pt: "/pt/Articles/Valthorens/",
    cn: "/cn/Articles/Valthorens/"
  },
  "/latania": {
    fr: "/fr/Articles/Tania/",
    en: "/en/Articles/Tania/",
    ru: "/ru/Articles/Tania/",
    uk: "/uk/Articles/Tania/",
    pt: "/pt/Articles/Tania/",
    cn: "/cn/Articles/Tania/"
  },
  "/about": {
    fr: "/L_ecole_de_ski/",
    en: "/en/About_Skiscool/",
    ru: "/Около_Skiscool/",
    uk: "/про_Skiscool/",
    pt: "/pt/About_Skiscool/",
    cn: "/cn/About_Skiscool/"
  }
};
const config = {
  locales: ["fr", "en", "pt", "ru", "uk", "cn"],
  defaultLocale: "en"
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
    console.log("testttt", node.name);
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
    if (!slugfin) {
      slugfin = slug;
    }
    createNodeField({ node, name: `lng`, value: lng });
    createNodeField({ node, name: `type`, value: type });
    createNodeField({ node, name: "slugbase", value: slug });
    createNodeField({ node, name: "slug", value: slugfin });
    if(type!=="pages")
    postNodes.push(node);
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
  const { createPage,deleteNode } = actions;

  return new Promise((resolve, reject) => {
    const pagePage = path.resolve("src/templates/page.jsx");
    const postPage = path.resolve("src/templates/post.jsx");
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
                    tags
                    category
                  }
                  fields {
                    lng
                    slug
                    slugbase
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
         // console.log(node.fields);
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
                context: {
                  id: node.id,
                  ...node.fields
                }
              });
              break;
            case `pages`:
              const route = router[node.fields.slugbase];
              if(!route||(router[node.fields.slug]&&node.fields.slug!=="/")){
                 
              console.warn("routepages not defined from ",node.fields.slug)
            return;  
            }
            console.log(node.fields.slug)
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
  console.log("route", page.path);
  if (!route) {
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
