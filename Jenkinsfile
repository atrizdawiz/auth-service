pipeline {
    agent { docker { image 'node:14-alpine' } }
    stages {
        stage('build docker image') {
            steps {
                sh 'apt-get install docker'
                sh 'docker build . -t rootberg/auth-service'}
            }
    }
}