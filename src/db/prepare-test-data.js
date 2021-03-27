const bcrypt = require('bcrypt')
const { query } = require('./index')

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
    author: 'bill'
  },
  {
    type: 'text',
    title: 'why vscode is the best text editor',
    body: 'no one uses vim anyways...',
    author: 'bill'
  },
  {
    type: 'link',
    title: 'microsoft purchases minecraft for 1 billion',
    body: 'https://news.microsoft.com/announcement/microsoft-purchases-minecraft/',
    author: 'bill'
  },
  {
    type: 'link',
    title: 'bill and melinda gates foundation',
    body: 'https://www.gatesfoundation.org/',
    author: 'bill'
  },
  {
    type: 'text',
    title: 'why i donate my money (as a billionaire)',
    body: 'i donate so much money',
    author: 'bill'
  },
]

const jeffPosts = [
  {
    type: 'text',
    title: 'why amazon workers should not get bathroom breaks',
    body: 'i need more money',
    author: 'jeff'
  },
  {
    type: 'text',
    title: 'why aws is priced fairly',
    body: 'it is the best',
    author: 'jeff'
  },
  {
    type: 'text',
    title: 'i am the richest man in the world',
    body: 'let it be known',
    author: 'jeff'
  },
]

const elonPosts = [
  {
    type: 'text',
    title: 'i am richer than jeff',
    body: 'tesla stonks to the moon',
    author: 'elon'
  },
  {
    type: 'link',
    title: 'why dogehouse is the next facebook',
    body: 'https://dogehouse.tv/',
    author: 'elon'
  },
  {
    type: 'text',
    title: 'tesla will become the largest company in 2021',
    body: 'absolutely ridiculous',
    author: 'elon'
  },
]

const stevePosts = []

const markPosts = [
  {
    type: 'text',
    title: 'why am i using reddit-clone? i already know everything',
    body: 'nice',
    author: 'mark'
  },
]

const posts = [billPosts, jeffPosts, elonPosts, stevePosts, markPosts].reduce(
  (accumulator, currentValue) => accumulator.concat(currentValue),
  []
)

const prepareTestData = async () => {
  const deleteAllRowsStatement = 'truncate table users, posts'
  await query(deleteAllRowsStatement)

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
    const insertPostStatement = `
      insert into posts(type, title, body, author_id)
      values($1, $2, $3, $4)
      returning *
    `
    const author_id = userToIdMap[post.author]
    await query(insertPostStatement, [post.type, post.title, post.body, author_id])
  }
}

prepareTestData()