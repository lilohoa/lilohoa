'use client'
// Temporary fix for Vercel build type errors
declare module 'prismjs/components/prism-markup-templating.js';
declare module 'prismjs/components/prism-markup.js';
declare module 'prismjs/components/prism-bash.js';
declare module 'prismjs/components/prism-js-templates.js';


import gsap from 'gsap'
import { useEffect } from 'react'
import cs from 'classnames'
import dynamic from 'next/dynamic'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type PageBlock } from 'notion-types'
import { formatDate, getBlockTitle, getPageProperty } from 'notion-utils'
import * as React from 'react'
import BodyClassName from 'react-body-classname'
import {
  type NotionComponents,
  NotionRenderer,
  useNotionContext
} from 'react-notion-x'
import { EmbeddedTweet, TweetNotFound, TweetSkeleton } from 'react-tweet'
import { useSearchParam } from 'react-use'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'
import { mapImageUrl } from '@/lib/map-image-url'
import { getCanonicalPageUrl, mapPageUrl } from '@/lib/map-page-url'
import { searchNotion } from '@/lib/search-notion'
import { useDarkMode } from '@/lib/use-dark-mode'

import { Footer } from './Footer'
// import { GitHubShareButton } from './GitHubShareButton'
import { Loading } from './Loading'
import { NotionPageHeader } from './NotionPageHeader'
import { Page404 } from './Page404'
import { PageAside } from './PageAside'
import { PageHead } from './PageHead'
import styles from './styles.module.css'

// ─────────────────────────────────────────────
// dynamic imports for optional components
// ─────────────────────────────────────────────

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async (m) => {
    await Promise.allSettled([
      import('prismjs/components/prism-markup-templating.js'),
      import('prismjs/components/prism-markup.js'),
      import('prismjs/components/prism-bash.js'),
      import('prismjs/components/prism-js-templates.js')
    ])
    return m.Code
  })
)

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection)
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(() =>
  import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf), { ssr: false }
)
const Modal = dynamic(() =>
  import('react-notion-x/build/third-party/modal').then((m) => {
    m.Modal.setAppElement('.notion-viewport')
    return m.Modal
  }), { ssr: false }
)

function Tweet({ id }: { id: string }) {
  const { recordMap } = useNotionContext()
  const tweet = (recordMap as types.ExtendedTweetRecordMap)?.tweets?.[id]

  return (
    <React.Suspense fallback={<TweetSkeleton />}>
      {tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />}
    </React.Suspense>
  )
}

const propertyLastEditedTimeValue = ({ block, pageHeader }: any, defaultFn: () => React.ReactNode) => {
  if (pageHeader && block?.last_edited_time) {
    return `Last updated ${formatDate(block?.last_edited_time, { month: 'long' })}`
  }
  return defaultFn()
}

const propertyDateValue = ({ data, schema, pageHeader }: any, defaultFn: () => React.ReactNode) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'published') {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date
    if (publishDate) {
      return `${formatDate(publishDate, { month: 'long' })}`
    }
  }
  return defaultFn()
}

const propertyTextValue = ({ schema, pageHeader }: any, defaultFn: () => React.ReactNode) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return <b>{defaultFn()}</b>
  }
  return defaultFn()
}

export function NotionPage({ site, recordMap, error, pageId }: types.PageProps) {
  const router = useRouter()
  const lite = useSearchParam('lite')
  const { isDarkMode } = useDarkMode()

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]!]?.value
  const isBlogPost = block?.type === 'page' && block?.parent_table === 'collection'

  const components = React.useMemo<Partial<NotionComponents>>(() => ({
    nextLegacyImage: Image,
    nextLink: Link,
    Code,
    Collection,
    Equation,
    Pdf,
    Modal,
    Tweet,
    Header: NotionPageHeader,
    propertyLastEditedTimeValue,
    propertyTextValue,
    propertyDateValue
  }), [])

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {}
    if (lite) params.lite = lite
    const searchParams = new URLSearchParams(params)
    return site ? mapPageUrl(site, recordMap!, searchParams) : undefined
  }, [site, recordMap, lite])

  const pageAside = React.useMemo(() => (
    <PageAside block={block!} recordMap={recordMap!} isBlogPost={isBlogPost} />
  ), [block, recordMap, isBlogPost])

  const footer = React.useMemo(() => <Footer />, [])

  const title =
  block && 'properties' in block && recordMap
    ? getBlockTitle(block, recordMap)
    : site?.name || 'Untitled'

  useEffect(() => {
    if (typeof window === 'undefined') return

    const timer = setTimeout(() => {
      const titleEl = document.querySelector('.notion-title')
      if (titleEl) {
        gsap.fromTo(
          titleEl,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }
        )
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  if (router.isFallback) return <Loading />
  if (error || !site || !block) return <Page404 site={site} pageId={pageId} error={error} />

  const canonicalPageUrl = config.isDev ? undefined : getCanonicalPageUrl(site, recordMap)(pageId)

  const socialImage = mapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) ||
    (block as PageBlock).format?.page_cover ||
    config.defaultPageCover,
    block
  )

  const socialDescription =
    getPageProperty<string>('Description', block, recordMap) || config.description

  return (
    <>
      <PageHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />

      {lite === 'true' && <BodyClassName className='notion-lite' />}
      {isDarkMode && <BodyClassName className='dark-mode' />}

      <NotionRenderer
        bodyClassName={cs(
          styles.notion,
          pageId === site.rootNotionPageId && 'index-page'
        )}
        darkMode={isDarkMode}
        components={components}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        rootDomain={site.domain}
        fullPage={lite !== 'true'}
        previewImages={!!recordMap.preview_images}
        showCollectionViewDropdown={false}
        showTableOfContents={isBlogPost}
        minTableOfContentsItems={3}
        defaultPageIcon={config.defaultPageIcon}
        defaultPageCover={config.defaultPageCover}
        defaultPageCoverPosition={config.defaultPageCoverPosition}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapImageUrl}
        searchNotion={config.isSearchEnabled ? searchNotion : undefined}
        pageAside={pageAside}
        footer={footer}
      />
    </>
  )
}