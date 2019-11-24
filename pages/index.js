import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import fetch from 'isomorphic-unfetch'

const Home = ({ storyDetails }) => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <div className="hero">
      <h1 className="title">Welcome to Next.js!</h1>
      <p className="description">
        To get started, edit <code>pages/index.js</code> and save to reload.
      </p>
      { /* ここに story の情報を一覧表示する */ }
      <ul>
      { storyDetails.map(({ title, date, url }, index) => <li key={index}>
          <a href={url}><p>{title} at {date.year}/{date.month}/{date.date}</p></a>
        </li>) }
      </ul>

      <div className="row">
        <a href="https://nextjs.org/docs" className="card">
          <h3>Documentation &rarr;</h3>
          <p>Learn more about Next.js in the documentation.</p>
        </a>
        <a href="https://nextjs.org/learn" className="card">
          <h3>Next.js Learn &rarr;</h3>
          <p>Learn about Next.js by following an interactive tutorial!</p>
        </a>
        <a
          href="https://github.com/zeit/next.js/tree/master/examples"
          className="card"
        >
          <h3>Examples &rarr;</h3>
          <p>Find other example boilerplates on the Next.js GitHub.</p>
        </a>
      </div>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
    `}</style>
  </div>
)

Home.getInitialProps = async () => {
  const req = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json")
  const storyIds = await req.json()
  const hnurl = (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
  // 10件に一旦制限する
  const storyReqs = storyIds.map((id) => fetch(hnurl(id))).slice(0, 10);
  // API Aggregation
  // Hackers News にあるストーリーのAPI とHackers News の詳細取得 API を結合している。
  const storyRes = await Promise.all(storyReqs);
  const storyRaw = await Promise.all(storyRes.map(s => s.json()));

  // API Translation
  // unixtime になっているデータを扱いやすい形式に変換する
  const storyDetails = storyRaw.map(({ title, time, url }) => { 
    const date = new Date(time * 1000)
    return ({
      title, 
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
      },
      url 
    })
  })
  return { storyDetails }
};

export default Home
