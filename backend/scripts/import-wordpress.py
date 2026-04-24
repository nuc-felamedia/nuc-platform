#!/usr/bin/env python3
"""
NUC WordPress Content Import
Imports posts, bulletins, news from WordPress XML exports
Usage: DATABASE_URL="..." python3 import-wordpress.py
"""

import os, re, sys, datetime, psycopg2
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

DATABASE_URL = os.environ.get('DATABASE_URL', '')
if not DATABASE_URL:
    print("❌ Set DATABASE_URL first")
    sys.exit(1)

NS = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'wp':      'http://wordpress.org/export/1.2/',
    'dc':      'http://purl.org/dc/elements/1.1/',
}

FILES = [
    '/Users/sainteni/Downloads/nationaluniversitiescommision.WordPress.2026-02-04 (1).xml',
    '/Users/sainteni/Downloads/nationaluniversitiescommision.WordPress.2026-02-04.xml',
    '/Users/sainteni/Downloads/nationaluniversitiescommision.WordPress.2026-02-05.xml',
]

def make_slug(text, existing):
    s = str(text).lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    s = re.sub(r'-+', '-', s).strip('-')
    s = s[:100]

    original = s
    counter = 1
    while s in existing:
        s = f"{original}-{counter}"
        counter += 1

    existing.add(s)
    return s

def strip_html(text):
    if not text:
        return ''
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:200]  # shorter for UI

def map_category_to_type(cats):
    cats_lower = [c.lower() for c in cats]
    if 'bulletin' in cats_lower:
        return 'BULLETIN'
    if 'circular' in cats_lower:
        return 'CIRCULAR'
    if 'press release' in cats_lower or 'press_release' in cats_lower:
        return 'PRESS_RELEASE'
    if 'announcement' in cats_lower:
        return 'ANNOUNCEMENT'
    return 'NEWS'

def parse_date(date_str):
    if not date_str:
        return None
    try:
        return parsedate_to_datetime(date_str)
    except:
        try:
            return datetime.datetime.strptime(date_str[:10], '%Y-%m-%d')
        except:
            return None

def main():
    print("🔌 Connecting...")
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # Existing slugs
    cur.execute('SELECT slug FROM "Post"')
    existing_slugs = set(r[0] for r in cur.fetchall())
    print(f"   {len(existing_slugs)} posts already in database\n")

    created = 0
    skipped = 0
    errors = 0

    for filepath in FILES:
        if not os.path.exists(filepath):
            print(f"⚠️  File not found: {filepath}")
            continue

        print(f"📂 Parsing: {os.path.basename(filepath)}")
        tree = ET.parse(filepath)
        root = tree.getroot()
        items = root.findall('.//item')
        print(f"   Found {len(items)} items")

        for item in items:
            post_type = item.find('wp:post_type', NS)
            status = item.find('wp:status', NS)

            if post_type is None or post_type.text != 'post':
                continue
            if status is None or status.text != 'publish':
                continue

            title_el = item.find('title')
            title = title_el.text if title_el is not None else ''
            if not title or len(title.strip()) < 3:
                skipped += 1
                continue

            title = title.strip()

            # Content
            content_el = item.find('content:encoded', NS)
            content = content_el.text if content_el is not None else ''
            content = content or ''
            excerpt = strip_html(content)

            # Date
            pub_date_el = item.find('pubDate')
            pub_date = parse_date(pub_date_el.text if pub_date_el is not None else None)

            # Categories
            cats = [c.text for c in item.findall('category') if c.text]
            post_type_mapped = map_category_to_type(cats)

            # Author
            author_el = item.find('dc:creator', NS)
            author_name = author_el.text if author_el is not None else 'NUC Communications'

            # Image
            featured_image = None
            enclosure = item.find('enclosure')
            if enclosure is not None:
                featured_image = enclosure.get('url')

            # Slug
            slug = make_slug(title, existing_slugs)

            try:
                cur.execute(
                    '''INSERT INTO "Post"
                       (id, title, slug, content, excerpt, type, status, "authorName",
                        "featuredImage", "publishedAt", "viewCount", "createdAt", "updatedAt")
                       VALUES (gen_random_uuid(), %s, %s, %s, %s, %s, 'PUBLISHED',
                               %s, %s, %s, 0, NOW(), NOW())
                       ON CONFLICT (slug) DO NOTHING''',
                    (title, slug, content, excerpt, post_type_mapped,
                     author_name, featured_image, pub_date)
                )

                if cur.rowcount > 0:
                    created += 1
                else:
                    skipped += 1

                conn.commit()

            except Exception as e:
                errors += 1
                conn.rollback()
                if errors <= 5:
                    print(f"  ✗ {title[:50]}: {e}")

        print("   Done\n")

    cur.execute('SELECT COUNT(*) FROM "Post" WHERE status = \'PUBLISHED\'')
    total = cur.fetchone()[0]

    print("=" * 50)
    print("✅ WordPress import complete!")
    print(f"   Created: {created:,}")
    print(f"   Skipped: {skipped:,}")
    print(f"   Errors:  {errors:,}")
    print(f"   Total posts in DB: {total:,}")
    print("=" * 50)

    conn.close()

if __name__ == '__main__':
    main()