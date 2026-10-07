const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
  let total = 0

  blogs.forEach(blog => {
    total += blog.likes
  })

  return total
}

const favoriteBlog = (blogs) => {
  const LikesArr = blogs.map( blog =>  Number(blog.likes))
  const topLikes = Math.max(...LikesArr)
  return (blogs.find(blog =>
    Number(blog.likes) === topLikes
  ))

}

const mostBlogs =(blogs) => {
  const counts = {}
  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  let maxAuthor = null
  let maxBlogs = 0

  for (const author in counts) {
    if (counts[author] > maxBlogs) {
      maxBlogs = counts[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs,
  }

}


const mostLikes = (blogs) => {
  const counts ={}

  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author]+blog.likes || blog.likes)
  })

  let maxLikes =  0
  let maxAuthor = null
  for (const author in counts) {
    if(counts[author] > maxLikes){
      maxLikes = counts[author]
      maxAuthor = author
    }
  }
  return ({ author : maxAuthor,
    likes : maxLikes
  })
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }