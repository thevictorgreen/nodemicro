// BUILD PIPELINE WITH DOCKER
node("cicd-build-slaves") {

  // THIS COMMIT_ID WILL BE USED TO TAG OUR DOCKER BUILDS
  def commit_id

  try {

    stage('CHECKOUT') {
      // CLONE THE REPOSITORY INTO THE WORKSPACE
      git url: 'https://github.com/thevictorgreen/nodemicro.git'
      sh "git rev-parse --short HEAD > .git/commit-id"
      commit_id = readFile('.git/commit-id').trim()
    }

    stage("CODE-QUALITY") {
      // SCAN SOURCE CODE FOR CODE QUALITY
      def sonarqubeScannerHome = tool name: 'sonar', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
      println("SonarhomeInst:" + sonarqubeScannerHome)
      withCredentials([string(credentialsId: 'sonar', variable: 'sonarLogin')]) {
        sh "${sonarqubeScannerHome}/bin/sonar-scanner -e -Dsonar.host.url=https://sonarqube.thevictorgreen.com -Dsonar.login=${sonarLogin} -Dsonar.projectName=vdigital-nodemicro -Dsonar.projectVersion=${commit_id} -Dsonar.projectKey=vdigital-nodemicro -Dsonar.sources=app/ -Dsonar.language=js"
      }
    }

    stage("TEST") {
      // RUN TEST
      dir ("app") {
        def myTestContainer = docker.image('node:4.6')
        myTestContainer.pull()
        myTestContainer.inside {
          sh "npm install --only=dev"
          sh "npm test"
        }
      }
    }

    stage("BUILD") {
      // BUILD AND PUSH IMAGE TO DOCKERHUB
      dir ("app") {
        stage("DOCKER BUILD") {
          // BUILD AND PUSH IMAGE TO DOCKERHUB
          docker.withRegistry("https://index.docker.io/v1/","cba2f3ad-7020-45db-9dc1-cd371a11fd85") {
            def app = docker.build("vdigital/nodemicro:${commit_id}","../.").push()
          }
        }
      }
    }


  } catch(e) {
    currentBuild.result = "FAILED";
    throw e;
  }
  finally {
    // SUCCESS OR FAILURE
    // ALWAYS SEND NOTIFICATIONS
    // ALWAYS CLEAN UP
    println("FINALLY REACHED")
  }
}
