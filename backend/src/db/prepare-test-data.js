const bcrypt = require('bcrypt')
const { query } = require('./index')

const subreddits = [
  {
    name: 'memes',
    description: 'dankest memes in town!! yeehaw!',
  },
  {
    name: 'pics',
    description: 'a place to share your photos',
  },
  {
    name: 'news',
    description: 'keep up to date!',
  },
]

const users = [
  {
    username: 'bill',
    password: 'asdf'
  },
  {
    username: 'jeff',
    password: 'asdf'
  },
  {
    username: 'elon',
    password: 'asdf'
  },
  {
    username: 'steve',
    password: 'asdf'
  },
  {
    username: 'mark',
    password: 'asdf'
  },
]

const billPosts = [
  {
    type: 'text',
    title: 'microsoft azure',
    body: 'the best cloud hosting platform!',
    author: 'bill',
    subreddit: 'news'
  },
  {
    type: 'text',
    title: 'why vscode is the best text editor',
    body: 'no one uses vim anyways...',
    author: 'bill',
    subreddit: 'news'
  },
  {
    type: 'link',
    title: 'microsoft purchases minecraft for 1 billion',
    body: 'https://news.microsoft.com/announcement/microsoft-purchases-minecraft/',
    author: 'bill',
    subreddit: 'news',
  },
  {
    type: 'link',
    title: 'bill and melinda gates foundation',
    body: 'https://www.gatesfoundation.org/',
    author: 'bill',
    subreddit: 'news'
  },
  {
    type: 'text',
    title: 'why i donate my money (as a billionaire)',
    body: 'i donate so much money',
    author: 'bill',
    subreddit: 'memes'
  },
]

const jeffPosts = [
  {
    type: 'text',
    title: 'why amazon workers should not get bathroom breaks',
    body: 'i need more money',
    author: 'jeff',
    subreddit: 'memes'
  },
  {
    type: 'text',
    title: 'why aws is priced fairly',
    body: 'it is the best',
    author: 'jeff',
    subreddit: 'memes'
  },
  {
    type: 'text',
    title: 'i am the richest man in the world',
    body: 'let it be known',
    author: 'jeff',
    subreddit: 'news'
  },
]

const elonPosts = [
  {
    type: 'text',
    title: 'i am richer than jeff',
    body: 'tesla stonks to the moon',
    author: 'elon',
    subreddit: 'memes'
  },
  {
    type: 'link',
    title: 'why dogehouse is the next facebook',
    body: 'https://dogehouse.tv/',
    author: 'elon',
    subreddit: 'memes'
  },
  {
    type: 'text',
    title: 'tesla will become the largest company in 2021',
    body: 'absolutely ridiculous',
    author: 'elon',
    subreddit: 'memes'
  },
  {
    type: 'link',
    title: 'd o g e',
    body: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDoge_(meme)&psig=AOvVaw2Z3QPoMctxJ4x4IGOp43nq&ust=1616951425864000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKDQ2c770O8CFQAAAAAdAAAAABAD',
    author: 'elon',
    subreddit: 'memes'
  },
]

const stevePosts = []

const markPosts = [
  {
    type: 'text',
    title: 'why am i using reddit-clone? i already know everything',
    body: 'nice',
    author: 'mark',
    subreddit: 'news'
  },
]

const posts = [billPosts, jeffPosts, elonPosts, stevePosts, markPosts].reduce(
  (accumulator, currentValue) => accumulator.concat(currentValue),
  []
)

const prepareTestData = async () => {
  await query('delete from posts')
  await query('alter sequence posts_id_seq restart with 1')

  await query('delete from users')
  await query('alter sequence users_id_seq restart with 1')

  await query('delete from subreddits')
  await query('alter sequence subreddits_id_seq restart with 1')

  for (const subreddit of subreddits) {
    await query(`insert into subreddits(name, description) values ($1, $2)`, [
      subreddit.name,
      subreddit.description
    ])
  }

  const userToIdMap = {}
  for (const user of users) {
    const insertUserStatement = `
      insert into users(username, password)
      values($1, $2)
      returning *
    `
    const hashedPassword = await bcrypt.hash(user.password, 10)
    const { rows: [insertedUser] } = await query(insertUserStatement, [user.username, hashedPassword])
    userToIdMap[user.username] = insertedUser.id
  }

  for (const post of posts) {
    const { rows: [foundSubreddit] } = await query(`select * from subreddits where name = $1`, [
      post.subreddit
    ])
    const insertPostStatement = `
      insert into posts(type, title, body, author_id, subreddit_id)
      values($1, $2, $3, $4, $5)
      returning *
    `
    const author_id = userToIdMap[post.author]
    await query(insertPostStatement, [post.type, post.title, post.body, author_id, foundSubreddit.id])
  }
}

prepareTestData()