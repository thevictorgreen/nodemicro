// Build Pipeline with docker
node {

  // commit_id will be used to tag our docker builds
  def commit_id

  stage('PREPARE') {
    // Clone the Repository into the workspace
    git url: 'https://github.com/thevictorgreen/nodemicro.git'
    sh "git rev-parse --short HEAD > .git/commit-id"
    commit_id = readFile('.git/commit-id').trim()
  }

  stage('CLEAN') {
    println( commit_id )
  }

  

}
