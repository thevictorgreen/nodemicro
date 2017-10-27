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

  stage("CODE QUALITY") {
    def sonarqubeScannerHome = tool name: 'sonar', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
    withCredentials([string(credentialsId: 'sonar', variable: 'sonarLogin')]) {
      sh "${sonarqubeScannerHome}/bin/sonar-scanner -e -Dsonar.host.url=https://sonarqube.thevictorgreen.com -Dsonar.login=${sonarLogin} -Dsonar.projectName=vdigital-nodemicro -Dsonar.projectVersion=${commit_id} -Dsonar.projectKey=vdigital-nodemicro -Dsonar.sources=app/ -Dsonar.tests=app/test/ -Dsonar.language=javascript"
    }
  }

  dir ("app") {

    try {
      stage("TEST") {
        //
        def myTestContainer = docker.image('node:4.6')
        myTestContainer.pull()
        myTestContainer.inside {
          sh "npm install --only=dev"
          sh "npm test"
        }
      }
    } catch(e) {
      currentBuild.result = "FAILURE";
      println("TEST FAILED")
    }

    try {
      stage("DOCKER BUILD") {
        //
        docker.withRegistry("https://index.docker.io/v1/","cba2f3ad-7020-45db-9dc1-cd371a11fd85") {
          def app = docker.build("vdigital/nodemicro:${commit_id}","../.").push()
        }
      }
    } catch(e) {
      currentBuild.result = "FAILURE";
      println("BUILD PUSH FAILED")
    }

  }
}
