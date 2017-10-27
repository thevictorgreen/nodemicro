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
  post {
    always {
      println("PREPARE STAGE ALWAYS")
    }
    success {
      println("PREPARE STAGE SUCCESS")
    }
    unstable {
      println("PREPARE STAGE UNSTABLE")
    }
    failure {
      println("PREPARE STAGE FAILED")
    }
    changed {
      println("PREPARE STAGE CHANGED")
    }
  }

  dir ("app") {

    stage("TEST") {
      //
      def myTestContainer = docker.image('node:4.6')
      myTestContainer.pull()
      myTestContainer.inside {
        sh "npm install --only=dev"
        sh "npm test"
      }
    }
    post {
      always {
        println("TEST STAGE ALWAYS")
      }
      success {
        println("TEST STAGE SUCCESS")
      }
      unstable {
        println("TEST STAGE UNSTABLE")
      }
      failure {
        println("TEST STAGE FAILED")
      }
      changed {
        println("TEST STAGE CHANGED")
      }
    }

    stage("DOCKER BUILD / PUSH") {
      //
      docker.withRegistry("https://index.docker.io/v1/","cba2f3ad-7020-45db-9dc1-cd371a11fd85") {
        def app = docker.build("vdigital/nodemicro:${commit_id}","../.").push()
      }
    }
    post {
      always {
        println("BUILD STAGE ALWAYS")
      }
      success {
        println("BUILD STAGE SUCCESS")
      }
      unstable {
        println("BUILD STAGE UNSTABLE")
      }
      failure {
        println("BUILD STAGE FAILED")
      }
      changed {
        println("BUILD STAGE CHANGED")
      }
    }
  }
}
