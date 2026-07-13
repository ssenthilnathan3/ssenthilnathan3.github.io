---
title: "DuckDB internals: Part 0"
description: "Build your own Analytical DB in a weekend: Why DuckDB, OLAP vs OLTP"
date: 2026-07-02
category: tech
draft: true
---

## foundations: OLTP vs OLAP

most of the DBMS that we (i mostly) use are OLTP (online transaction processing) such as MySQL, Postgres, etc. They are designed to handle a large number of small transactions efficiently.

but when analytics comes in, we need to compute aggregates, sums, joins and nested joins in realtime to show insights on scale, OLTP systems fail. OLTP is designed for daily business operations such as transactions, simple inserts/deletes/updates.

but for analytics in large data lakes we need a DBMS that handles historical and aggregated data stored for a long time.

OLTP is optimized for faster writes while OLAP is optimized for faster reads.

we (I) have seen multiple blogs implementing key value stores, but not many go beyond the abstraction to implement their own DB from scratch. one such effort i came across is [TinySQL](https://github.com/TinySQL/TinySQL).

## why duck?

because its so damn easy? DuckDB is an **in-process analytical SQL database** by definition, meaning we can start using it by importing and loading it as a library in your project like NumPy or Pandas

it ships a binary under 20MB with no external dependencies.

DuckDB also happens to be one of the fastest single-node analytical engines available, regularly holding its own against entire clusters that cost millions of dollars per year,

**and a DB which can be imported and just used... seemed too COOL to not try.**

## topics covered

we are gonna address the design choices that were made in the development of DuckDB. down the line, we are gonna implement a toy-version of those..

- In-process execution
- Columnar, compressed storage with zonemaps
- Vectorized execution
- Morsel-driven parallelism
- Snapshot isolation with optimistic MVCC

## note

this is my attempt to study internals of a database and document the process publicly.

one of the reasons i chose DuckDB is: when going straight into Postgres or CassandraDB may seem too complex and overwhelming for so(me)one to start with because there are so many things to talk and learn to.

the material and code used to repro this process are:

- [duckDB Internals Docs](https://blobs.duckdb.org/slides/DiDi.pdf)
- [github/duckdb](https://github.com/duckdb/duckdb)
