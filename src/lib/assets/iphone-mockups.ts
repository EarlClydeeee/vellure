/** Product mockup images served from /public/iphone */
export const IPHONE_MOCKUP_IMAGES = {
  iphone17: '/iphone/iphone17/iphone_17__fb1277oq3eaa_large.jpg',
  iphone17Pro: '/iphone/iphone17/iphone_17pro__t1j902iw6kya_large.jpg',
  iphone17e: '/iphone/iphone17/iphone_17e__cq5ygzct314y_large.jpg',
  iphoneAir: '/iphone/iphone17/iphone_air__b5qmgl05ojyq_large.jpg',
  iphone17BlackWebp:
    '/iphone/iphone17pro/iphone17/iphone-17-finish-select-202509-black.webp',
  iphone17LavenderWebp:
    '/iphone/iphone17pro/iphone17/iphone-17-finish-select-202509-lavender.webp',
  iphone17WhiteWebp:
    '/iphone/iphone17pro/iphone17/iphone-17-finish-select-202509-white.webp',
  iphone17SageWebp:
    '/iphone/iphone17pro/iphone17/iphone-17-finish-select-202509-sage.webp',
  iphoneAirSkyBlueWebp:
    '/iphone/iphone17pro/iphoneair/iphone-air-finish-select-202509-skyblue.webp',
  iphoneAirCloudWhiteWebp:
    '/iphone/iphone17pro/iphoneair/iphone-air-finish-select-202509-cloudwhite.webp',
  iphoneAirLightGoldWebp:
    '/iphone/iphone17pro/iphoneair/iphone-air-finish-select-202509-lightgold.webp',
  iphoneAirSpaceBlackWebp:
    '/iphone/iphone17pro/iphoneair/iphone-air-finish-select-202509-spaceblack.webp',
} as const;

export type IphoneMockupKey = keyof typeof IPHONE_MOCKUP_IMAGES;
