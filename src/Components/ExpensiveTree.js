import React from 'react'

function ExpensiveTree() {
  const now = performance.now()
  while (performance.now() - now < 100) {
    // Emulate some expensive calculations which takes 300ms
  }
  return <div />
}

export default React.memo(ExpensiveTree)
