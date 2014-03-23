    var docpadConfig,
    __indexOf = [].indexOf || function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) return i;
        }
        return -1;
    };

    var siteConfig = require('./configs.json');


docpadConfig = {
    templateData: {
        site: {
            url: "http://website.com",
            oldUrls: ['www.website.com', 'website.herokuapp.com'],
            title: siteConfig.WEBSITE_TITLE,
            description: "When your website appears in search results in say Google, the text here will be shown underneath your website's title.",
            keywords: "place, your, website, keywoards, here, keep, them, related, to, the, content, of, your, website",
            social: {
                Twitter:    siteConfig.TWITTER_ID,
                Soundcloud: siteConfig.SOUNDCLOUD_ID,
                Facebook: siteConfig.FACEBOOK_ID
            }
        },
        getPreparedTitle: function () {
            if (this.document.title) {
                return "" + this.document.title + " | " + this.site.title;
            } else {
                return this.site.title;
            }
        },
        getPreparedDescription: function () {
            return this.document.description || this.site.description;
        },
        getPreparedKeywords: function () {
            return this.site.keywords.concat(this.document.keywords || []).join(', ');
        },
        getGruntedStyles: function () {
            var gruntConfig, styles, _, grunt;
            _ = require('underscore');
            grunt = require('grunt');
            gruntConfig = require('./gruntconfig.json');
            if (process.env.NODE_ENV === 'production' && grunt) {
                styles = Object.getOwnPropertyNames(gruntConfig.cssmin.combine.files);
                return styles[0].replace('out', '');
            } else {
                return _.map(gruntConfig.cssmin.combine.files['out/styles/all.min.css'], function(list, url){ return list.replace('out', '') });

            }    
        },
        getGruntedScripts: function () {
           var gruntConfig, scripts, _, grunt;
            _ = require('underscore');
            grunt = require('grunt');
            gruntConfig = require('./gruntconfig.json');

            if (process.env.NODE_ENV === 'production' && grunt) {
                scripts = Object.getOwnPropertyNames(gruntConfig.uglify.dist.files);
                return scripts[0].replace('out', '');

            } else {
               return _.map(gruntConfig.uglify.dist.files['out/scripts/all.min.js'], function(list, url){ return list.replace('out', '') });
            }
        }
    },
    collections: {
        pages: function () {
            return this.getCollection('html').findAllLive({
                pageOrder: {
                    $exists: true
                }
            }, [{
                pageOrder: 1,
                title: 1
            }]);
        },
        posts: function () {
            return this.getCollection('documents').findAllLive({
                relativeOutDirPath: 'posts',
                isPagedAuto:  {$ne: true}
            }, [{
                date: -1
            }]);
        }
    },
    events: {
        serverExtend: function (opts) {
            var docpad, latestConfig, newUrl, oldUrls, server;
            server = opts.server;
            docpad = this.docpad;
            latestConfig = docpad.getConfig();
            oldUrls = latestConfig.templateData.site.oldUrls || [];
            newUrl = latestConfig.templateData.site.url;
            return server.use(function (req, res, next) {
                var _ref;
                if (_ref = req.headers.host, __indexOf.call(oldUrls, _ref) >= 0) {
                    return res.redirect(newUrl + req.url, 301);
                } else {
                    return next();
                }
            });
        }
    },
    plugins: { 
        grunt: {
          writeAfter: false,
          generateAfter: ['cssmin', 'uglify']
        },
        feedr: {
          feeds: {
            mixcloud: {
                url: siteConfig.MIXCLOUD_URL
            },
            flickr: {
                url: "http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&user_id=" + siteConfig.FLICKR_USER_ID + "&api_key=" + siteConfig.FLICKR_API_KEY + "&extras=url_sq,url_t,url_m,url_o&per_page=4&page=2",
                clean: true
            },
            soundCloud: {

                url: siteConfig.SOUNDCLOUD_ENDPOINT + "?client_id=" + siteConfig.SOUNDCLOUD_CLIENT_ID
            }
          }
        }
    }
};

module.exports = docpadConfig;