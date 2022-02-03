/*
     ____  _                   _
    | __ )| | ___   __ _  __ _(_)_ __   __ _
    |  _ \| |/ _ \ / _` |/ _` | | '_ \ / _` |
    | |_) | | (_) | (_| | (_| | | | | | (_| |
    |____/|_|\___/ \__, |\__, |_|_| |_|\__, |
                   |___/ |___/         |___/

    Purpose:

        To interface with bloomreach regarding blogging related documents.

 */

const _ = require('lodash');

const PostFetch = [
    "heroImage/link",
    "author/link",
    "related/*/link",
    "items/images/*/link",
    "text/links/*"
];

const AuthorFetch = [
    "image/link"
];

const BlogSettingsFetch = [
    "featured/*/link",
    "items/heroImage/link",
    "items/introPicture/link"
]

module.exports = {

    /**
     * Grab blog settings.
     *
     * @param hippo {HippoConnection} connection
     * @param path {string} path to where to find the blog settings.
     * @returns {Promise<void>}
     */
    async getBlogSettings(hippo, path) {
        const settings = await hippo.getDocumentByPath(path, { fetch: BlogSettingsFetch });
         return settings;
    },

    /**
     *
     * @param hippo {HippoConnection}
     * @param path {string}
     * @returns {Promise<void>}
     */
    async getPostAtPath(hippo, path) {
        const doc = await hippo.getDocumentByPath(
            `/content/documents/blog/articles/${path}`, {
                fetch: PostFetch
            }
        );

        if (!doc) {
            return null;
        }

        // fetch category
        const category = await this.getPostCategoryAtPath(hippo, path)

        return {...doc, category};
    },


    /**
     * Get category folder information
     *
     * @param hippo {HippoConnection}
     * @param path {string}
     * @returns {Promise<null>}
     */
    async getPostCategoryAtPath(hippo, path) {
        const catName = path.includes("/") ? path.substring(0, path.indexOf("/")) : path;
        const catDoc = await hippo.listDocuments(`/content/documents/blog/articles`);
        return catDoc.folders.find(folder => folder.name === catName) ?? null;
    },

    /**
     * Get all posts with a particular story tag
     *
     * @param hippo {HippoConnection}
     * @param storyTag {string}
     * @returns {Promise<void>}
     */
    async getPostsWithStoryTag(hippo, storyTag, limit = 17) {

        const query = (
            hippo.newQuery()
                .type("xinmods:blog")
                .includePath("/content/documents/blog/articles")
                .orderBy("hippostdpubwf:publicationDate", "desc")
                .where().equals("xinmods:storyTag", storyTag).end()
                .limit(limit)
                .build()
        );

        const results = await hippo.executeQuery(query, {fetch: PostFetch});
        return {totalSize: results.totalSize, articles: results.documents};
    },


    /**
     * @param hippo {HippoConnection}
     * @param path {string}
     * @returns {Promise<void>}
     */
    async getAuthorAtPath(hippo, path) {
        const doc = await hippo.getDocumentByPath(`/content/documents/blog/authors/${path}`, {fetch: AuthorFetch});
        return doc;
    },


    /**
     * Get all products from the repository.
     *
     * @param hippo {HippoConnection} the hippo connection to use.
     * @param limit {?number} a potential limit
     * @returns {Promise<*[]>}
     */
    async getAllAuthors(hippo, limit = null) {

        const query = (
            hippo.newQuery()
                .type("xinmods:blogauthor")
                .includePath("/content/documents")
                .orderBy("hippostdpubwf:publicationDate", "desc")
        );

        if (limit !== null) {
            query.limit(limit);
        }

        const results = await hippo.executeQuery(query.build(), {fetch: AuthorFetch});
        return {totalSize: results.totalSize, authors: results.documents};
    },


    /**
     * Get a list of posts by a particular author
     *
     * @param hippo {HippoConnection} the hippo connection
     * @param author {object} the author document to use
     * @param limit {number} the max number of items to retrieve, default: 50.
     * @returns {Promise<Object>}
     */
    async getPostsByAuthor(hippo, author, limit = 50) {

        const query = (
            hippo.newQuery()
                .type("xinmods:blog")
                .includePath("/content/documents")
                .orderBy("hippostdpubwf:publicationDate", "desc")
                .where().equals("xinmods:author/hippo:docbase", author.id).end()
                .limit(limit)
                .build()
        );

        const results = await hippo.executeQuery(query, {fetch: PostFetch});
        return {totalSize: results.totalSize, articles: results.documents};
    },

    /**
     * Get all products from the repository.
     *
     * @param hippo {HippoConnection} the hippo connection to use.
     * @param limit {?number} a potential limit
     * @returns {Promise<{}>}
     */
    async getAllPosts(hippo, path, limit = null) {

        const query = (
            hippo.newQuery()
                .type("xinmods:blog")
                .includePath(path ?? "/content/documents")
                .orderBy("hippostdpubwf:publicationDate", "desc")
        );

        if (limit !== null) {
            query.limit(limit);
        }

        const results = await hippo.executeQuery(query.build(), {fetch: PostFetch});
        return {totalSize: results.totalSize, articles: results.documents};
    }


};
