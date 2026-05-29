import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '20fbd16a83088078b0dde32b45db21cb',

  // if you want to restrict pages to a single notion workspace (optional)
  rootNotionSpaceId: 'e2d02841-5074-40dc-94bf-5085aab1cdb6',

  // basic site info (required)
  name: 'lilohoa',
  domain: 'www.lilohoa.com',
  author: 'lilohoa',

  // open graph metadata (optional)
  description: 'lilohoa - digital designer',

  // default notion icon and cover images for site-wide consistency (optional)
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  isRedisEnabled: false,

  pageUrlOverrides: null,

  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'Home',
      pageId: '20fbd16a83088078b0dde32b45db21cb'
    },
    {
      title: 'About',
      pageId: '20fbd16a8308810c954de98088fdf494'
    },
    {
      title: 'Contact',
      pageId: '20fbd16a830881ef99c6da782b367baa'
    }
  ]
})