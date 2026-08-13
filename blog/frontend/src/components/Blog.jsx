const Blog = ({ blog }) => (
  <div className="AI-blog-card">
    <button className="title AI-title"><a href={blog.url}><h4>{blog.title}</h4></a></button>
    <div className="details AI-details"><h5>USER : {blog.user.name} |</h5><h5>by {blog.author} |</h5><span>liked by {blog.likes}</span></div>
  </div>
)

export default Blog