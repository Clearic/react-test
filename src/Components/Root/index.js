import React, { useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import faker from 'faker'
import { nanoid } from 'nanoid'

import postsQuery from 'GraphQL/Queries/posts.graphql'

import { POST } from 'Router/routes'

import { Column, Container, Post, PostAuthor, PostBody } from './styles'

import ExpensiveTree from '../ExpensiveTree'

const postsLimit = 10;

function range(start, end) {
  const ans = [];
  for (let i = start; i <= end; i += 1) {
      ans.push(i);
  }
  return ans;
}

function Root() {
  const [count, setCount] = useState(0)
  const [fields, setFields] = useState([
    {
      name: faker.name.findName(),
      id: nanoid(),
    },
  ])

  const [value, setValue] = useState('')
  const [page, setPage] = useState(0)
  const { data, loading } = useQuery(postsQuery, {
    variables: {
      page,
      limit: postsLimit
    }
  })

  function handlePush() {
    setFields([{ name: faker.name.findName(), id: nanoid() }, ...fields])
  }

  const countRef = useRef(0);
  const timeoutRef = useRef(null);
  countRef.current = count;
  function handleAlertClick() {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      alert(`You clicked ${countRef.current} times`)
    }, 2500)
  }

  function handleNextPage() {
    setPage(x => x + 1);
  }

  function handlePreviousPage() {
    setPage(x => x - 1);
  }

  const posts = data?.posts.data || []

  return (
    <Container>
      <Column>
        <h4>Need to add pagination</h4>
        {loading
          ? 'Loading...'
          : posts.map(post => (
            <Post mx={4}>
              <NavLink href={POST(post.id)} to={POST(post.id)}>
                {post.title}
              </NavLink>
              <PostAuthor>by {post.user.name}</PostAuthor>
              <PostBody>{post.body}</PostBody>
            </Post>
          ))}
        <div>
          <button type="button" disabled={page <= 0} onClick={handlePreviousPage}>
            Previous
          </button>
          { range(Math.max(page - 5, 0), page + 5).map(x => (
            <button type="button" onClick={() => setPage(x)}>{x+1}</button>
          ))}
          <button type="button" disabled={posts.length < postsLimit} onClick={handleNextPage}>
            Next
          </button>
        </div>
      </Column>
      <Column>
        <h4>Slow rendering</h4>
        <label>
          Enter something here:
          <br />
          <input
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />
        </label>
        <p>So slow...</p>
        <ExpensiveTree />

        <h4>Closures</h4>
        <p>You clicked {count} times</p>
        <button type="button" onClick={() => setCount(count + 1)}>
          Click me
        </button>
        <button type="button" onClick={handleAlertClick}>
          Show alert
        </button>
      </Column>

      <Column>
        <h4>Incorrect form field behavior</h4>
        <button type="button" onClick={handlePush}>
          Add more
        </button>
        <ol>
          {fields.map((field, index) => (
            <li key={index}>
              {field.name}:<br />
              <input type="text" />
            </li>
          ))}
        </ol>
      </Column>
    </Container>
  )
}

export default Root
