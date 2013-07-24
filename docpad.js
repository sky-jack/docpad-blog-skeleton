    var docpadConfig,
    __indexOf = [].indexOf || function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) return i;
        }
        return -1;
    };

docpadConfig = {
    templateData: {
        site: {
            url: "http://website.com",
            oldUrls: ['www.website.com', 'website.herokuapp.com'],
            title: "This Website",
            description: "When your website appears in search results in say Google, the text here will be shown underneath your website's title.",
            keywords: "place, your, website, keywoards, here, keep, them, related, to, the, content, of, your, website",
            social: {
                Twitter: "https://twitter.com/tenthousandyen",
                Soundcloud: "http://soundcloud.com/gwilymgold",
                Facebook: "http://facebook.com"
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
            var gruntConfig, styles, _;
            _ = require('underscore');
            styles = [];
            gruntConfig = require('./grunt-config.json');
            _.each(gruntConfig, function (value, key) {
                return styles = styles.concat(_.flatten(_.pluck(value, 'dest')));
            });
            styles = _.filter(styles, function (value) {
                return value.indexOf('.min.css') > -1;
            });
            return _.map(styles, function (value) {
                return value.replace('out', '');
            });
        },
        getGruntedScripts: function () {
            var gruntConfig, scripts, _;
            _ = require('underscore');
            scripts = [];
            gruntConfig = require('./grunt-config.json');
            _.each(gruntConfig, function (value, key) {
                return scripts = scripts.concat(_.flatten(_.pluck(value, 'dest')));
            });
            scripts = _.filter(scripts, function (value) {
                return value.indexOf('.min.js') > -1;
            });
            return _.map(scripts, function (value) {
                return value.replace('out', '');
            });
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
        },
        writeAfter: function (opts, next) {
            var balUtil, command, docpad, rootPath, _;
            docpad = this.docpad;
            rootPath = docpad.config.rootPath;
            balUtil = require('bal-util');
            _ = require('underscore');
            command = ["" + rootPath + "/node_modules/.bin/grunt", 'default'];
            balUtil.spawn(command, {
                cwd: rootPath,
                output: true
            }, function () {
                var gruntConfig, src;
                src = [];
                gruntConfig = require('./grunt-config.json');
                _.each(gruntConfig, function (value, key) {
                    return src = src.concat(_.flatten(_.pluck(value, 'src')));
                });
                _.each(src, function (value) {
                    return balUtil.spawn(['rm', value], {
                        cwd: rootPath,
                        output: false
                    }, function () {});
                });
                balUtil.spawn(['find', '.', '-type', 'd', '-empty', '-exec', 'rmdir', '{}', '\;'], {
                    cwd: rootPath + '/out',
                    output: false
                }, function () {});
                return next();
            });
            return this;
        }
    },
    plugins: {
        feedr: {
          feeds: {
            mixcloud: {
                url: "http://api.mixcloud.com/skyjack/cloudcasts/"
            },
            flickr: {
                url: "http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&user_id=8212509@N06&api_key=a8713ffb48a016c09f9126fe500d82af&extras=url_sq,url_t,url_m,url_o&per_page=4&page=2",
                clean: true
            },
            soundCloud: {
                url: "https://api.soundcloud.com/users/gwilymgold/tracks.json?client_id=19b869f8a22bf6b9e84806f2834a9b5a"
            }
          }
        }
    }
};

module.exports = docpadConfig;