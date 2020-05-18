let siteConfig;
let ghostConfig;

try {
  siteConfig = require(`./siteConfig`);
} catch (e) {
  siteConfig = null;
}

try {
  ghostConfig = require(`./.ghost`);
} catch (e) {
  ghostConfig = {
    development: {
      apiUrl: 'https://shotaroakahori.ghost.io',
      contentApiKey: '4340fa10d33274b5540421630e'
    },
    production: {
      apiUrl: 'https://shotaroakahori.ghost.io',
      contentApiKey: '4340fa10d33274b5540421630e'
    }
  };
} finally {
  const { apiUrl, contentApiKey } =
    process.env.NODE_ENV === `development`
      ? ghostConfig.development
      : ghostConfig.production;

  if (!apiUrl || !contentApiKey || contentApiKey.match(/<key>/)) {
    ghostConfig = null; //allow default config to take over
  }
}

let gatsbyPlugins = [
  {
    resolve: `@draftbox-co/gatsby-ghost-balsa-theme`,
    options: {
      ghostConfig: ghostConfig,
      siteConfig: siteConfig
    }
  }
]

if(process.env.SEGMENT_KEY) {
  gatsbyPlugins.push({
    resolve: `gatsby-plugin-segment-js`,
    options: {
      prodKey: process.env.SEGMENT_KEY,
      devKey: process.env.SEGMENT_KEY,
      trackPage: true,
      delayLoad: true,
      delayLoadTime: 1000
    }
  });
}

if(process.env.GA) {
  gatsbyPlugins.unshift({
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: process.env.GA,
      head: true
    }
  });
}

module.exports = {
  plugins: gatsbyPlugins
};
