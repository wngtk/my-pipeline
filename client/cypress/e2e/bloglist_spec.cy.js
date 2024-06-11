describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'root',
      password: '123456',
    })
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'hella',
      password: 'hella',
    })
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('login').click()
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    beforeEach(() => {
      cy.contains('login').click()
    })

    it('succeeds with correct credentials', function () {
      cy.get('input:first').type('root')
      cy.get('input:last').type('123456')
      cy.get('#login-button').click()
      cy.contains('root logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('input:first').type('root')
      cy.get('input:last').type('wrongpassword')
      cy.get('#login-button').click()
      cy.contains('root logged in').should('not.exist')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'root', password: '123456' })
    })

    describe('with two blog', function () {
      it('ordered by likes', function () {
        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'second best author',
          url: 'i am url',
        })
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'best author',
          url: 'i am url',
        })

        cy.contains('the most likes').parent().as('mostPopularBlog')
        cy.get('@mostPopularBlog').contains('view').click()
        cy.get('@mostPopularBlog').get('.likes').find('button').click()
        cy.get('.blog-container')
          .eq(0)
          .should('contain', 'The title with the most likes')
        cy.get('.blog-container')
          .eq(1)
          .should('contain', 'The title with the second most likes')
      })
    })

    it('A blog can be created', function () {
      cy.createBlog({
        title: 'a blog',
        author: 'root',
        url: 'no url',
      })
      cy.contains('a blog')
    })

    describe('and a blog exists', function () {
      beforeEach(() => {
        cy.createBlog({
          title: 'another blog',
          author: 'root',
          url: 'no url',
        })
        cy.contains('another blog')
      })

      it('user can like a blog', function () {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('user can delete a blog', function () {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.contains('another blog').should('not.exist')
      })
    })

    it('only the creator can see the delete button', function () {
      cy.createBlog({
        title: 'a blog created by root',
        author: 'root',
        url: 'no url',
      })
      cy.login({ username: 'hella', password: 'hella' })
      cy.contains('hella logged in')
      cy.createBlog({
        title: 'hella de bloig',
        author: 'is hella',
        url: 'cool url',
      })
      cy.contains('a blog created by root').parent().as('blogCreatedByRoot')
      cy.get('@blogCreatedByRoot').contains('view').click()
      cy.get('@blogCreatedByRoot').contains('remove').should('not.exist')
    })
  })
})
