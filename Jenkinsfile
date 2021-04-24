pipeline {
    agent { docker { image 'docker:20.10.6' } }
    stages {
        stage('build docker image') {
            steps {
                sh 'docker build . -t rootberg/auth-service'}
            }
    }
}