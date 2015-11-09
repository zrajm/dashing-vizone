#!/usr/bin/env python

import requests, sqlite3
from argparse import ArgumentParser

from vizone.base import PayloadBase
from vizone.descriptors import Value, RepeatableEmbed
from vizone.iso8601 import Timestamp


parser = ArgumentParser(usage="update")
parser.add_argument('source_url', help='source url')
parser.add_argument('database', help='database')

args = parser.parse_args()


class BuildEntry(PayloadBase):
    _base_element = 'atom:entry'

    title = Value('atom:title', unicode)
    alternate_href = Value('atom:link[@rel="alternate"]/@href', unicode)
    id = Value('atom:id', unicode)
    published = Value('atom:published', Timestamp)
    updated = Value('atom:updated', Timestamp)


class BuildFeed(PayloadBase):
    _base_element = 'atom:feed'

    title = Value('atom:title', unicode)
    id = Value('atom:id', unicode)
    alternate_href = Value('atom:link[@rel="alternate"]/@href', unicode)
    updated = Value('atom:updated', Timestamp)
    entries = RepeatableEmbed('atom:entry', BuildEntry)


# Fetching Data from Jenkins
response = requests.get(args.source_url)
assert response.status_code == 200

feed = BuildFeed(response.content)


# Syncing the data into the database
conn = sqlite3.connect(args.database)

c = conn.cursor()

titles = {}
for row in c.execute('SELECT title FROM heroes_jenkinsdata'):
    title = row[0]
    titles[title.split()[0]] = title

for entry in feed.entries:
    title = entry.title.split()[0]
    if title in titles.keys():
        if title != titles[title]:
            c.execute('UPDATE heroes_jenkinsdata SET title=?, date=? WHERE title=?', (entry.title, entry.updated.datetime(), titles[title]))
    else:
        c.execute('INSERT INTO heroes_jenkinsdata (title, date) VALUES (?, ?)', (entry.title, entry.updated.datetime()))

conn.commit()
conn.close()
