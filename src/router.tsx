import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'
import { NotFound } from './pages/NotFound'

/** Route table from design.md §2.1. Pages are code-split with route-level lazy loading. */
const lazyPage = <T extends string>(load: () => Promise<Record<T, React.ComponentType>>, name: T): Pick<RouteObject, 'lazy'> => ({
  lazy: async () => ({ Component: (await load())[name] }),
})

const legal = (slug: import('./pages/Legal').LegalSlug): RouteObject => ({
  path: `/${slug}`,
  lazy: async () => {
    const { LegalPage } = await import('./pages/Legal')
    return { Component: () => <LegalPage slug={slug} /> }
  },
})

const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { index: true, ...lazyPage(() => import('./pages/Home'), 'Home') },
      { path: '/destinations', ...lazyPage(() => import('./pages/Destinations'), 'Destinations') },
      { path: '/destinations/:slug', ...lazyPage(() => import('./pages/DestinationDetail'), 'DestinationDetail') },
      { path: '/opportunities', ...lazyPage(() => import('./pages/Opportunities'), 'Opportunities') },
      { path: '/opportunities/:slug', ...lazyPage(() => import('./pages/ProjectDetail'), 'ProjectDetail') },
      { path: '/developments', ...lazyPage(() => import('./pages/Developments'), 'Developments') },
      { path: '/developments/:slug', ...lazyPage(() => import('./pages/DevelopmentDetail'), 'DevelopmentDetail') },
      { path: '/advisory', ...lazyPage(() => import('./pages/Advisory'), 'Advisory') },
      { path: '/land-development-jv', ...lazyPage(() => import('./pages/LandJv'), 'LandJv') },
      { path: '/insights', ...lazyPage(() => import('./pages/Insights'), 'Insights') },
      { path: '/insights/:slug', ...lazyPage(() => import('./pages/Article'), 'Article') },
      { path: '/client-stories', ...lazyPage(() => import('./pages/ClientStories'), 'ClientStories') },
      { path: '/about', ...lazyPage(() => import('./pages/About'), 'About') },
      { path: '/private-consultation', ...lazyPage(() => import('./pages/Consultation'), 'Consultation') },
      { path: '/sitemap', ...lazyPage(() => import('./pages/Sitemap'), 'Sitemap') },
      legal('privacy-policy'),
      legal('terms-of-use'),
      legal('disclaimer'),
      legal('cookie-policy'),
      legal('texas-consumer-protection-notice'),
      legal('information-about-brokerage-services'),
      ...(import.meta.env.DEV ? [{ path: '/styleguide', ...lazyPage(() => import('./pages/Styleguide'), 'Styleguide') } satisfies RouteObject] : []),
      { path: '/404', element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
