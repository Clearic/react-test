import React, { useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import faker from 'faker'
import { nanoid } from 'nanoid'

import postsQuery from 'GraphQL/Queries/posts.graphql'

import { POST } from 'Router/routes'

import { Column, Container, Post, PostAuthor, PostBody } from './styles'

import ExpensiveTree from '../ExpensiveTree'

const postsPerPageLimit = 10;

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
      limit: postsPerPageLimit
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

  const totalPostsCount = data?.posts?.meta.totalCount || 0;
  const paginationFrom = Math.max(page - 5, 0)
  const maxPages = Math.ceil(totalPostsCount / postsPerPageLimit)
  const paginationTo = Math.min(page + 5, maxPages)

  return (
    <Container>
      <Column>
        <h4>Need to add pagination</h4>
        {loading
          ? 'Loading...'
          : posts.map(post => (
            <Post key={post.id} mx={4}>
              <NavLink href={POST(post.id)} to={POST(post.id)}>
                {post.title}
              </NavLink>
              <PostAuthor>by {post.user.name}</PostAuthor>
              <PostBody>{post.body}</PostBody>
            </Post>
          ))}
        {!loading && (
          <div>
            <button
              disabled={page <= 0}
              type="button"
              onClick={handlePreviousPage}
            >
              Previous
            </button>
            {range(paginationFrom, paginationTo).map(x => (
              <button key={x} type="button" onClick={() => setPage(x)}>
                {x === page ? <strong>{x + 1}</strong> : <>{x + 1}</>}
              </button>
            ))}
            <button
              disabled={page >= maxPages}
              type="button"
              onClick={handleNextPage}
            >
              Next
            </button>
          </div>
        )}
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
            <li key={field.id}>
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
