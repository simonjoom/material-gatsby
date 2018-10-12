const path = require("path");
const _ = require("lodash");
const fs = require("fs-extra");
const uuid = require("uuid");
const uuidv5 = require("uuid/v5");
const moment = require("moment");
const crypto = require("crypto");
const siteConfig = require("./data/SiteConfig");
const config = require("./src/config");
const mkdirp = require("mkdirp");
const router = config.router;
require("babel-polyfill");
mkdirp("./cachedir");
function encode(name) {
  return uuidv5(name, "8e884ace-cee4-11e4-8dfc-aa07a5b093db");
}

const getObj = async name => {
  try {
    const packageObj = await fs.readJson(
      path.join("./cachedir", name + ".json")
    );
    const res = JSON.parse(packageObj);
    return res.value;
  } catch (err) {
    return [{ node: {} }];
  }
};

const storeObj = async obj => {
  let json;
  try {
    json = JSON.stringify(obj, null, 2);
  } catch (e) {
    console.log("error JSON", e);
  }

  obj.id = obj.name || obj.id || uuid.v4();

  try {
    await fs.writeJson(path.join("./cachedir", obj.id + ".json"), json, err => {
      if (err) return console.error(err);
      console.log("success!");
    });
  } catch (err) {
    console.error(err);
  }
};

const arraymenu = ["/", "/about/", "/concept/", "/contact/"];
const arraygallery = [
  "/",
  "/about/",
  "/concept/",
  "/hotel/",
  "/instructor/",
  "/concept/",
  "/contact/"
];
const tagListDone = {};
const catListDone = {};
const postTypes = ["post", "instructor", "hotel"];
//const postNodes = { fr: [], en: [], pt: [], ru: [], uk: [], ch: [] };
const postNodes = {
  post: { fr: [], en: [], pt: [], ru: [], uk: [], ch: [] },
  instructor: { fr: [], en: [], pt: [], ru: [], uk: [], ch: [] },
  hotel: { fr: [], en: [], pt: [], ru: [], uk: [], ch: [] }
};
console.log("process.env.NODE_ENV", process.env.NODE_ENV);

const isProd = process.env.NODE_ENV === "production" || true;
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
  for (let k in postTypes) {
    const type = postTypes[k];
    for (let l in config.locales) {
      const lng = config.locales[l];
      const el = postNodes[type][lng].filter(
        a =>
          a &&
          a.frontmatter &&
          a.frontmatter.title !== "" &&
          a.frontmatter.title !== "default"
      );
      el.sort(
        (
          { frontmatter: { date: date1 } },
          { frontmatter: { date: date2 } }
        ) => {
          const dateA = moment(date1, siteConfig.dateFromFormat);
          const dateB = moment(date2, siteConfig.dateFromFormat);

          if (dateA.isBefore(dateB)) return 1;

          if (dateB.isBefore(dateA)) return -1;

          return 0;
        }
      );
      for (let i = 0; i < el.length; i += 1) {
        const nextID = i + 1 < el.length ? i + 1 : 0;
        const prevID = i - 1 > 0 ? i - 1 : el.length - 1;
        const currNode = el[i];
        const nextNode = el[nextID];
        const prevNode = el[prevID];
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
    if (node.frontmatter && node.frontmatter.title === "") return;
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
        slug = node.frontmatter.slug;
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
    else slugfin = slug;

    if (type === "instructor" || type === "hotel")
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

    if (type === "hotel") {
      createNodeField({ node, name: `star`, value: node.frontmatter.star });
    }
    createNodeField({ node, name: `lng`, value: lng });
    createNodeField({ node, name: `type`, value: type });
    createNodeField({ node, name: "slugbase", value: slug });
    createNodeField({ node, name: "slug", value: slugfin });
    if (type !== "pages") postNodes[type][lng].push(node);
  }
};

exports.setFieldsOnGraphQLNodeType = ({ type, actions }) => {
  const { name, nodes } = type;
  const { createNodeField } = actions;
  //console.log("setFieldsOnGraphQLNodeType", nodes);

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
          html
          id
          fileAbsolutePath
          frontmatter {
            title
            deps
            cover
            avatar
            date
            category
            tags
          }
          fields {
            lng
            star
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
      absolutePath:{regex:"\/assets\/.*(${depsfiles})\\\\.(jpg\$|png\$)\/"}
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

let arraydepfilesInstructor = [];
let arraydepfilesBlog = [];
let arraydepfilesHotel = [];
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
let MarkdownQueriesCache = null;
exports.createPages = ({ graphql, actions }) => {
  const { createPage, deleteNode } = actions;

  // return new Promise((resolve, reject) => {
  const hotelPage = path.resolve("src/templates/hotel.jsx");
  const pagePage = path.resolve("src/templates/page.jsx");
  const postPage = path.resolve("src/templates/post.jsx");
  const instructorPage = path.resolve("src/templates/instructor.jsx");
  const tagPage = path.resolve("src/templates/tag.jsx");
  const categoryPage = path.resolve("src/templates/category.jsx");

  return new Promise(async (resolve, reject) => {
    MarkdownQueriesCache = await getObj("MarkdownQueriesCache");
    if (!MarkdownQueriesCache[0].node.fields) {
      let mak = await graphql(MarkdownQueries);
      if (mak.errors) {
        /* eslint no-console: "off" */
        console.log(mak);
        reject(mak.errors);
      }
      MarkdownQueriesCache = mak.data.allMarkdownRemark.edges.filter(
        a => a.node && a.node.frontmatter && a.node.frontmatter.title !== ""
      );
      storeObj({ name: "MarkdownQueriesCache", value: MarkdownQueriesCache });
    }

    //.then(result => {

    let tagSets = [];
    let categorySets = [];
    let langs = [];
    // const tagSet = new Set();
    // const categorySet = new Set();
    await asyncForEach(MarkdownQueriesCache, async ({ node }) => {
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
      if (node.fields.type == "instructor" || node.fields.type == "hotel") {
        route.fr = route.fr + _.kebabCase(node.frontmatter.title) + "/";
        route.en = route.en + _.kebabCase(node.frontmatter.title) + "/";
        route.ru = route.ru + _.kebabCase(node.frontmatter.title) + "/";
        route.uk = route.uk + _.kebabCase(node.frontmatter.title) + "/";
        route.pt = route.pt + _.kebabCase(node.frontmatter.title) + "/";
        route.ch = route.ch + _.kebabCase(node.frontmatter.title) + "/";
      }

      const coverstr =
        node.frontmatter && node.frontmatter.cover
          ? node.frontmatter.cover.replace(/(.jpg|.jpeg|.png)/g, "")
          : "";
      const avatarstr =
        node.frontmatter && node.frontmatter.avatar
          ? node.frontmatter.avatar.replace(/(.jpg|.jpeg|.png)/g, "")
          : "";
      const nextstr = avatarstr === "" ? coverstr : coverstr + "," + avatarstr;
      const next = nextstr === "" ? [] : nextstr.split(",");
      const extra = next.join("|");
      const extrat = next.join("-");

      //add for the page frontmatter instructor type
      if (
        node.fields.type === "instructor" ||
        node.frontmatter.category === "instructor"
      ) {
        arraydepfilesInstructor = Array.from(
          new Set(arraydepfilesInstructor.concat(next))
        );
      }
      //add for the page frontmatter post type
      if (
        node.fields.type === "post" ||
        node.frontmatter.category === "ski-resort"
      ) {
        arraydepfilesBlog = Array.from(new Set(arraydepfilesBlog.concat(next)));
      }
      if (
        node.fields.type === "hotel" ||
        node.frontmatter.category === "hotel"
      ) {
        arraydepfilesHotel = Array.from(
          new Set(arraydepfilesHotel.concat(next))
        );
      }

      let depsfiles = "";
      let depsfilest = "";

      if (node.frontmatter.deps) {
        depsfiles = node.frontmatter.deps;
        depsfilest = depsfiles.split("|").join("_");
      } else {
        var regex = /imgtest data=['|"](.*)\..*["|']/g;
        var matches = [];
        var str = node.html;
        if (str && str != "") {
          str.replace(regex, function() {
            var match = Array.prototype.slice.call(arguments, 0, -1);
            matches.push(_.kebabCase(match[1]));
            // example: ['test1', 'e', 'st1', '1'] with properties `index` and `input`
          });
          depsfilest = matches.join("_");
          depsfiles = matches.join("|");
          //console.log(depsfiles);
        }
      }
      // console.log(depsfiles, node.frontmatter.cover);
      depsfiles =
        extra === ""
          ? depsfiles
          : depsfiles !== ""
            ? depsfiles + "|" + extra
            : extra;
      depsfilest =
        extrat === ""
          ? depsfilest
          : depsfilest !== ""
            ? depsfilest + "_" + extrat
            : extrat;
      let files;
      if (depsfilest !== "") {
        if (depsfilest.length > 15) depsfilest = encode(depsfilest);
        files = await getObj(depsfilest);
        if (!files[0].node.fields) {
          if (!filesArrayCache[depsfilest]) {
            const myquery = QueryFiles(depsfiles);
            const res = await graphql(myquery);
            if (res.data.allFile && res.data.allFile.edges) {
              const {
                data: {
                  allFile: { edges: filedeps }
                }
              } = res;
              filesArrayCache[depsfilest] = filedeps;
              storeObj({ name: depsfilest, value: filedeps });
            } else {
              console.log("problem pictures with", depsfiles);
            }
          }
          files = filesArrayCache[depsfilest];
        }
      }

      switch (node.fields.type) {
        case "post":
        case "hotel":
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
            component:
              node.fields.type == "post"
                ? postPage
                : node.fields.type == "instructor"
                  ? instructorPage
                  : hotelPage,
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
          if (!route) {
            console.log("no route pages", node.fields.slug);
            return;
          }
          const page = {
            path: node.fields.slug,
            component: pagePage,
            context: {
              route,
              files,
              id: node.id,
              ...node.fields
            }
          };
          if (page.path == "/") {
            let newPage = {
              component: page.component,
              path: "/",
              context: { ...node.fields }
            };
            /* let newPage1 = Object.assign({}, newPage, {
              matchPath: `/z/create`
            });
            createPage(newPage1);
            let newPage2 = Object.assign({}, newPage, { matchPath: `/z/api` });
            createPage(newPage2);
            let newPage3 = Object.assign({}, newPage, {
              matchPath: `/z/post/:id`
            });
            createPage(newPage3);
            let newPage4 = Object.assign({}, newPage, {
              matchPath: `/z/drafts`
            });
            createPage(newPage4);*/
            let newPage5 = Object.assign({}, newPage, {
              matchPath: `/z/chats`
            });
            createPage(newPage5);
            /* let newPage6 = Object.assign({}, newPage, {
              matchPath: `/z/car/:id`
            });
            createPage(newPage6);
            let newPage7 = Object.assign({}, newPage, { matchPath: `/z/cars` });
            createPage(newPage7);*/
            let newPage8 = Object.assign({}, newPage, {
              matchPath: `/z/users`
            });
            createPage(newPage8);
            let newPage9 = Object.assign({}, newPage, {
              matchPath: `/z/user/:id`
            });
            createPage(newPage9);
            let newPage10 = Object.assign({}, newPage, {
              matchPath: `/z/forgetPassword`
            });
            createPage(newPage10);
            let newPage11 = Object.assign({}, newPage, {
              matchPath: `/z/resetPassword`
            });
            createPage(newPage11);
            let newPage12 = Object.assign({}, newPage, {
              matchPath: `/z/updatePassword`
            });
            createPage(newPage12);
            let newPage13 = Object.assign({}, newPage, {
              matchPath: `/z/validateEmail`
            });
            createPage(newPage13);
            let newPage14 = Object.assign({}, newPage, {
              matchPath: `/z/signup`
            });
            createPage(newPage14);
            let newPage15 = Object.assign({}, newPage, {
              matchPath: `/z/login`
            });
            createPage(
              newPage15
            ); /*
            let newPage16 = Object.assign({}, newPage, {
              matchPath: `/z/posts`
            });
            createPage(newPage16);
            let newPage17 = Object.assign({}, newPage, {
              matchPath: `/z/post/:id`
            });
            createPage(newPage17);*/
          }

          //matchPath: node.fields.slug == "/" ? `/z/*` : undefined,
          createPage(page);
          break;
        default:
          console.log("????");
          break;
      }

      if (node.frontmatter.title !== "default" && isProd) {
        langs.forEach(lg => {
          const tagList = Array.from(tagSets[lg]);
          tagList.forEach(tag => {
            const route = {};
            const kbtag = _.kebabCase(tag);
            if (!tagListDone[kbtag]) {
              route.fr = `/tags_fr/${kbtag}/`;
              route.en = `/tags_en/${kbtag}/`;
              route.ru = `/tags_ru/${kbtag}/`;
              route.uk = `/tags_uk/${kbtag}/`;
              route.pt = `/tags_pt/${kbtag}/`;
              route.ch = `/tags_ch/${kbtag}/`;
              createPage({
                path: `/tags_${lg}/${kbtag}/`,
                component: tagPage,
                context: {
                  route,
                  tag,
                  lng: lg
                }
              });
              tagListDone[kbtag] = true;
            }
          });
          const categoryList = Array.from(categorySets[lg]);
          categoryList.forEach(category => {
            const route = {};
            const kbcategory = _.kebabCase(category);
            if (!catListDone[kbcategory]) {
              route.fr = `/categories_fr/${kbcategory}/`;
              route.en = `/categories_en/${kbcategory}/`;
              route.ru = `/categories_ru/${kbcategory}/`;
              route.uk = `/categories_uk/${kbcategory}/`;
              route.pt = `/categories_pt/${kbcategory}/`;
              route.ch = `/categories_ch/${kbcategory}/`;
              createPage({
                path: `/categories_${lg}/${kbcategory}/`,
                component: categoryPage,
                context: {
                  route,
                  category,
                  lng: lg
                }
              });
              catListDone[kbcategory] = true;
            }
            // });
            // });
          });
        });
      }
    });
    resolve();
  });
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  const route = router[page.path];
  if (!route || page.path == "/dev-404-page/" || page.path == "/404.html") {
    // if(page.path == "/dev-404-page/"||page.path == "/404.html")
    // page.matchPath="/*";
    console.warn("no route", page);
    return;
  }

  console.log("remakefor", page.path);
  const { locales, defaultLocale } = config;
  let oldPage = Object.assign({}, page);
  const newPage = page.path == "/" ? { matchPath: `/z/*` } : {};
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
      //console.log("oncreate", page.path);
      let files;
      let fileres;
      if (page.path === "/instructor/") fileres = arraydepfilesInstructor;
      else if (page.path === "/blog/") fileres = arraydepfilesBlog;
      else if (page.path === "/hotel/") fileres = arraydepfilesHotel;
      const depsfiles = fileres && fileres.join("|");
      let depsfilest = fileres && fileres.join("-");
      // console.log(page.path, depsfiles);
      if (depsfilest && depsfilest !== "") {
        if (!filesArrayCache[depsfilest]) {
          if (depsfilest.length > 15) depsfilest = encode(depsfilest);
          files = await getObj(depsfilest);
          if (!files[0].node.fields) {
            const _require2 = require(`gatsby/dist/redux`);
            const store = _require2.store;
            const schema = store.getState().schema;
            const graphqlo = require(`graphql`).graphql;
            const myquery = QueryFiles(depsfiles);
            let res = await graphqlo(schema, myquery, {}, {}, {});
            if (res.data && res.data.allFile) {
              const { edges: filedeps } = res.data.allFile;
              // console.log("filesArrayCache", filedeps);
              filesArrayCache[depsfilest] = filedeps;
              storeObj({ name: depsfilest, value: filedeps });
            } else {
              console.log(myquery);
              console.warn("lack of deps:", depsfiles);
              filesArrayCache[depsfilest] = [{ node: {} }];
            }
          } else {
            filesArrayCache[depsfilest] = files;
          }
        }
      } else {
        console.log("nothing for", page.path);
        files = filesArrayCache[depsfilest] = [{ node: {} }];
      }
      if (page.path === "/instructor/") console.log(files);
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
