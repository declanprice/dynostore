import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/dynostore/__docusaurus/debug',
    component: ComponentCreator('/dynostore/__docusaurus/debug', '848'),
    exact: true
  },
  {
    path: '/dynostore/__docusaurus/debug/config',
    component: ComponentCreator('/dynostore/__docusaurus/debug/config', '0dc'),
    exact: true
  },
  {
    path: '/dynostore/__docusaurus/debug/content',
    component: ComponentCreator('/dynostore/__docusaurus/debug/content', '816'),
    exact: true
  },
  {
    path: '/dynostore/__docusaurus/debug/globalData',
    component: ComponentCreator('/dynostore/__docusaurus/debug/globalData', '41c'),
    exact: true
  },
  {
    path: '/dynostore/__docusaurus/debug/metadata',
    component: ComponentCreator('/dynostore/__docusaurus/debug/metadata', '6b5'),
    exact: true
  },
  {
    path: '/dynostore/__docusaurus/debug/registry',
    component: ComponentCreator('/dynostore/__docusaurus/debug/registry', '4d8'),
    exact: true
  },
  {
    path: '/dynostore/__docusaurus/debug/routes',
    component: ComponentCreator('/dynostore/__docusaurus/debug/routes', '982'),
    exact: true
  },
  {
    path: '/dynostore/markdown-page',
    component: ComponentCreator('/dynostore/markdown-page', 'e9e'),
    exact: true
  },
  {
    path: '/dynostore/docs',
    component: ComponentCreator('/dynostore/docs', '213'),
    routes: [
      {
        path: '/dynostore/docs',
        component: ComponentCreator('/dynostore/docs', 'db0'),
        routes: [
          {
            path: '/dynostore/docs',
            component: ComponentCreator('/dynostore/docs', '226'),
            routes: [
              {
                path: '/dynostore/docs/category/conditions',
                component: ComponentCreator('/dynostore/docs/category/conditions', 'b83'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/dynostore/docs/category/guide',
                component: ComponentCreator('/dynostore/docs/category/guide', '967'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/dynostore/docs/getting-started',
                component: ComponentCreator('/dynostore/docs/getting-started', 'ff2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/dynostore/docs/guide/conditions/filter_conditions',
                component: ComponentCreator('/dynostore/docs/guide/conditions/filter_conditions', 'e6e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/dynostore/docs/guide/conditions/update-conditions',
                component: ComponentCreator('/dynostore/docs/guide/conditions/update-conditions', 'c0a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/dynostore/docs/guide/delete-item',
                component: ComponentCreator('/dynostore/docs/guide/delete-item', '77b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/dynostore/docs/guide/get-item',
                component: ComponentCreator('/dynostore/docs/guide/get-item', 'f04'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/dynostore/docs/guide/put-item',
                component: ComponentCreator('/dynostore/docs/guide/put-item', '687'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/dynostore/docs/guide/query-items',
                component: ComponentCreator('/dynostore/docs/guide/query-items', '059'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/dynostore/docs/guide/scan-items',
                component: ComponentCreator('/dynostore/docs/guide/scan-items', 'eb3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/dynostore/docs/guide/store',
                component: ComponentCreator('/dynostore/docs/guide/store', '3f1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/dynostore/docs/guide/update-item',
                component: ComponentCreator('/dynostore/docs/guide/update-item', '709'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/dynostore/',
    component: ComponentCreator('/dynostore/', 'd7e'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
