// Build Pipeline with docker
node("cicd-build-slaves") {

  // commit_id will be used to tag our docker builds
  def commit_id

  stage('PREPARE') {
    // Clone the Repository into the workspace
    git url: 'https://github.com/thevictorgreen/nodemicro.git'
    sh "git rev-parse --short HEAD > .git/commit-id"
    commit_id = readFile('.git/commit-id').trim()
  }

  dir ("app") {

    stage("TEST") {

      def myTestContainer = docker.image('node:4.6')
      myTestContainer.pull()
      myTestContainer.inside {
        sh "npm install --only=dev"
        sh "npm test"
      }

      stage("DOCKER BUILD / PUSH") {
        docker.withRegistry("https://index.docker.io/v1/","cba2f3ad-7020-45db-9dc1-cd371a11fd85") {
          def app = docker.build("vdigital/nodemicro:${commit_id}","../.").push()
        }
      }

    }
  }



}
