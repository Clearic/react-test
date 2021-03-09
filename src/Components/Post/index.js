import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'

import { useQuery } from '@apollo/client'
import arrayMove from 'array-move'

import postQuery from 'GraphQL/Queries/post.graphql'
import postsQuery from 'GraphQL/Queries/posts.graphql'

import { ROOT, POST } from 'Router/routes'

import {
  Back,
  Column,
  Container,
  PostAuthor,
  PostBody,
  PostComment,
  PostContainer,
} from './styles'

const SortableContainer = sortableContainer(({ children }) => (
  <div>{children}</div>
))

const SortableItem = sortableElement(({ value }) => (
  <PostComment mb={2}>{value}</PostComment>
))

function Post() {
  const [comments, setComments] = useState([])
  const history = useHistory()
  const {
    params: { postId },
  } = useRouteMatch()

  const handleClick = () => history.push(ROOT)

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setComments(arrayMove(comments, oldIndex, newIndex))
  }

  const { data, loading } = useQuery(postQuery, { variables: { id: postId } })

  const post = data?.post || {}

  useEffect(() => {
    if (post && post.comments)
      setComments(post.comments.data)
  }, [post])

  // Feels wrong to relay on numerical id to determent next/prev post id. 
  // In a real situation, I would receive it from the server.
  const prevPostId = Number(postId) - 1;
  const nextPostId = Number(postId) + 1;
  const { data: dataPosts } = useQuery(postsQuery, {
    variables: {
      limit: 1
    }
  })

  return (
    <Container>
      <Column>
        <Back onClick={handleClick}>Back</Back>
      </Column>
      {loading ? (
        'Loading...'
      ) : (
        <>
          <Column>
            <h4>Need to add next/previous links</h4>
            <PostContainer key={post.id}>
              <h3>{post.title}</h3>
              <PostAuthor>by {post.user.name}</PostAuthor>
              <PostBody mt={2}>{post.body}</PostBody>
            </PostContainer>
            <div>
              {prevPostId > 0 && (
                <Link to={POST(prevPostId)}>
                  Prev
                </Link>
              )}
              {' '}
              {dataPosts?.posts?.meta.totalCount >= nextPostId && (
                <Link to={POST(nextPostId)}>
                  Next
                </Link>
              )}
            </div>
          </Column>

          <Column>
            <h4>Incorrect sorting</h4>
            Comments:
            <SortableContainer onSortEnd={handleSortEnd}>
              {comments.map((comment, index) => (
                <SortableItem
                  index={index}
                  key={comment.id}
                  mb={3}
                  value={comment.body}
                />
              ))}
            </SortableContainer>
          </Column>
        </>
      )}
    </Container>
  )
}

export default Post
